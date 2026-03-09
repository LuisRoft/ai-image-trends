import { generateText } from 'ai';
import {
  createGoogleGenerativeAI,
  type GoogleLanguageModelOptions,
} from '@ai-sdk/google';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { internal } from '@/convex/_generated/api';

const VALID_MODELS = ['gemini-2.5-flash-image', 'gemini-3-pro-image-preview'];
const VALID_IMAGE_SIZES = ['1K', '2K', '4K'] as const;
const VALID_GENERATION_SOURCES = ['credits', 'user_api_key'] as const;
const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/bmp',
];

type GenerationSource = (typeof VALID_GENERATION_SOURCES)[number];
type SupportedModel = (typeof VALID_MODELS)[number];

type CreditsStatus = {
  ok: boolean;
  usedCount: number;
  remainingCount: number;
  resetAtUtc: number;
};

type ConvexAdminClient = {
  setAdminAuth: (token: string) => void;
  query: <T>(queryRef: unknown, args?: Record<string, unknown>) => Promise<T>;
  mutation: <T>(
    mutationRef: unknown,
    args?: Record<string, unknown>
  ) => Promise<T>;
};

const normalizeModel = (model: string): SupportedModel =>
  VALID_MODELS.includes(model) ? (model as SupportedModel) : VALID_MODELS[0];

const fileToPromptImage = async (file: File) => {
  if (!SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
    throw new Error(`Unsupported image format: ${file.type}`);
  }

  const buffer = await file.arrayBuffer();
  return Buffer.from(buffer);
};

const buildConvexAdminClient = () => {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error('Missing NEXT_PUBLIC_CONVEX_URL environment variable');
  }

  if (!process.env.CONVEX_DEPLOY_KEY) {
    throw new Error('Missing CONVEX_DEPLOY_KEY environment variable');
  }

  const convex = new ConvexHttpClient(
    process.env.NEXT_PUBLIC_CONVEX_URL
  ) as unknown as ConvexAdminClient;
  convex.setAdminAuth(process.env.CONVEX_DEPLOY_KEY);
  return convex;
};

export async function POST(request: Request) {
  let convex: ConvexAdminClient | null = null;
  let selectedSource: GenerationSource | null = null;
  let selectedModel: SupportedModel = VALID_MODELS[0];
  let promptId: string | undefined;
  let userId: string | null = null;
  let hasReservedCredit = false;

  try {
    const [authData, formData] = await Promise.all([
      auth(),
      request.formData(),
    ]);
    userId = authData.userId;

    if (!userId) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          details: 'You must be logged in to generate images',
        },
        { status: 401 }
      );
    }

    const prompt = formData.get('prompt') as string;
    const images = formData.getAll('images') as File[];
    const aspectRatio = (formData.get('aspectRatio') as string) || '1:1';
    const imageSize = (formData.get('imageSize') as string) || '1K';
    const model = (formData.get('model') as string) || VALID_MODELS[0];
    const generationSource = formData.get('generationSource') as string;
    const rawPromptId = formData.get('promptId') as string | null;
    promptId = rawPromptId?.trim() || undefined;

    if (!prompt?.trim()) {
      return NextResponse.json(
        {
          error: 'Invalid prompt',
          details: 'Prompt cannot be empty',
        },
        { status: 400 }
      );
    }

    if (
      !VALID_GENERATION_SOURCES.includes(
        generationSource as GenerationSource
      )
    ) {
      return NextResponse.json(
        {
          error: 'Invalid generation source',
          details: 'Select a valid generation source',
        },
        { status: 400 }
      );
    }

    selectedSource = generationSource as GenerationSource;
    selectedModel = normalizeModel(model);
    const normalizedImageSize: '1K' | '2K' | '4K' = VALID_IMAGE_SIZES.includes(
      imageSize as (typeof VALID_IMAGE_SIZES)[number]
    )
      ? (imageSize as '1K' | '2K' | '4K')
      : '1K';

    convex = buildConvexAdminClient();

    let apiKeyToUse: string;

    if (selectedSource === 'user_api_key') {
      const userApiKeyData = await convex.query<{ apiKey: string } | null>(
        internal.userApiKeys.getActualApiKey,
        {
          userId,
        }
      );

      if (!userApiKeyData?.apiKey) {
        return NextResponse.json(
          {
            error: 'API Key not configured',
            details:
              'Please configure your Gemini API key in settings to generate images',
            needsApiKey: true,
          },
          { status: 403 }
        );
      }

      apiKeyToUse = userApiKeyData.apiKey;
    } else {
      const appApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

      if (!appApiKey) {
        return NextResponse.json(
          {
            error: 'App configuration error',
            details:
              'Falta GOOGLE_GENERATIVE_AI_API_KEY en el servidor para generar con créditos.',
          },
          { status: 500 }
        );
      }

      const reservation = await convex.mutation<{
        ok: boolean;
        reason?: 'pending_in_progress' | 'limit_reached';
        remainingCount: number;
        resetAtUtc: number;
      }>(
        internal.generationCredits.reserveDailyCreditGeneration,
        {
          userId,
          model: selectedModel,
          promptId,
        }
      );

      if (!reservation.ok) {
        if (reservation.reason === 'pending_in_progress') {
          return NextResponse.json(
            {
              error: 'Generation already in progress',
              details:
                'Ya hay una generación con créditos en progreso. Espera a que termine.',
              generationInProgress: true,
              remainingCount: reservation.remainingCount,
              resetAtUtc: reservation.resetAtUtc,
            },
            { status: 409 }
          );
        }

        return NextResponse.json(
          {
            error: 'No credits available',
            details:
              'No tienes créditos disponibles. Espera el reinicio diario o usa tu API key.',
            noCredits: true,
            remainingCount: reservation.remainingCount,
            resetAtUtc: reservation.resetAtUtc,
          },
          { status: 403 }
        );
      }

      hasReservedCredit = true;
      apiKeyToUse = appApiKey;
    }

    const google = createGoogleGenerativeAI({ apiKey: apiKeyToUse });
    const promptImages = await Promise.all(images.map((file) => fileToPromptImage(file)));

    const result = await generateText({
      model: google(selectedModel),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            ...promptImages.map((image, index) => ({
              type: 'file' as const,
              data: image,
              mediaType: images[index]?.type || 'image/jpeg',
            })),
          ],
        },
      ],
      providerOptions: {
        google: {
          responseModalities: ['IMAGE'],
          imageConfig: {
            aspectRatio: aspectRatio as
              | '1:1'
              | '2:3'
              | '3:2'
              | '3:4'
              | '4:3'
              | '4:5'
              | '5:4'
              | '9:16'
              | '16:9'
              | '21:9',
            imageSize: normalizedImageSize,
          },
        } satisfies GoogleLanguageModelOptions,
      },
    });

    const generatedImages = result.files.filter((file) =>
      file.mediaType.startsWith('image/')
    );

    if (generatedImages.length === 0) {
      throw new Error('No image generated');
    }

    let creditsStatus: CreditsStatus | null = null;

    if (selectedSource === 'credits' && hasReservedCredit) {
      creditsStatus = await convex.mutation<CreditsStatus>(
        internal.generationCredits.confirmDailyCreditGeneration,
        {
          userId,
          model: selectedModel,
          promptId,
        }
      );
      hasReservedCredit = false;
    }

    return NextResponse.json({
      result: generatedImages.map((image) => ({
        inlineData: {
          mimeType: image.mediaType,
          data: image.base64,
        },
      })),
      creditsStatus,
    });
  } catch (error) {
    console.error('Error generating image:', error);

    if (
      selectedSource === 'credits' &&
      hasReservedCredit &&
      convex &&
      userId
    ) {
      try {
        await convex.mutation(internal.generationCredits.releaseDailyCreditGeneration, {
          userId,
        });
      } catch (releaseError) {
        console.error('Failed to release reserved credit:', releaseError);
      }
    }

    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';

    if (errorMessage.includes('No image generated')) {
      return NextResponse.json(
        {
          error: 'No image generated',
          details:
            'La generación no devolvió imágenes válidas. Inténtalo de nuevo.',
        },
        { status: 502 }
      );
    }

    if (errorMessage.includes('Unsupported image format:')) {
      return NextResponse.json(
        {
          error: 'Unsupported image format',
          details:
            'Se recibió una imagen en un formato no compatible. Usa JPEG, PNG, GIF o BMP.',
        },
        { status: 400 }
      );
    }

    if (
      errorMessage.includes('API key') ||
      errorMessage.includes('authentication')
    ) {
      if (selectedSource === 'credits') {
        return NextResponse.json(
          {
            error: 'Generation service unavailable',
            details:
              'El servicio de generación no está disponible en este momento. Inténtalo más tarde.',
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          error: 'Invalid API Key',
          details:
            'Your API key appears to be invalid. Please check your settings and update it.',
          invalidApiKey: true,
        },
        { status: 403 }
      );
    }

    if (
      errorMessage.includes('is not found for API version') ||
      errorMessage.includes('NOT_FOUND') ||
      errorMessage.includes('Model not found')
    ) {
      return NextResponse.json(
        {
          error: 'Model not available',
          details:
            'The selected model is not available for your current Gemini API access. Try another model.',
        },
        { status: 400 }
      );
    }

    if (errorMessage.includes('ENCRYPTION_SECRET environment variable is required')) {
      return NextResponse.json(
        {
          error: 'App configuration error',
          details:
            'Falta ENCRYPTION_SECRET en Convex. Es necesaria para leer la API key guardada del usuario.',
        },
        { status: 500 }
      );
    }

    if (errorMessage.includes('Missing CONVEX_DEPLOY_KEY environment variable')) {
      return NextResponse.json(
        {
          error: 'App configuration error',
          details:
            'Falta CONVEX_DEPLOY_KEY en Next.js. Es necesaria para acceder a las funciones internas de Convex.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details:
          'No se pudo completar la generación en este momento. Inténtalo de nuevo.',
      },
      { status: 500 }
    );
  }
}
