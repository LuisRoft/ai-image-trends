import {
  GoogleGenAI,
  GenerateContentResponse,
  Part,
  Modality,
} from '@google/genai';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const VALID_MODELS = ['gemini-2.5-flash-image', 'gemini-3-pro-image-preview'];
const VALID_IMAGE_SIZES = ['1K', '2K', '4K'] as const;

const fileToGenerativePart = async (file: File) => {
  const buffer = await file.arrayBuffer();
  let mimeType = file.type;

  // Map unsupported formats to supported ones
  const supportedFormats = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
  ];

  if (!supportedFormats.includes(file.type)) {
    // For unsupported formats like AVIF, WebP, treat as JPEG
    mimeType = 'image/jpeg';
    console.warn(`Unsupported image format ${file.type}, treating as JPEG`);
  }

  const base64EncodedData = Buffer.from(buffer).toString('base64');
  return {
    inlineData: { data: base64EncodedData, mimeType },
  };
};

export async function POST(request: Request) {
  try {
    // Start independent work in parallel to reduce route latency.
    const [authData, formData] = await Promise.all([auth(), request.formData()]);
    const { userId } = authData;

    if (!userId) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          details: 'You must be logged in to generate images',
        },
        { status: 401 }
      );
    }

    // Get user's API key from Convex
    const userApiKeyData = await convex.query(api.userApiKeys.getActualApiKey, {
      userId,
    });

    if (!userApiKeyData || !userApiKeyData.apiKey) {
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

    const prompt = formData.get('prompt') as string;
    const images = formData.getAll('images') as File[];
    const aspectRatio = (formData.get('aspectRatio') as string) || '1:1';
    const imageSize = (formData.get('imageSize') as string) || '1K';
    const model = (formData.get('model') as string) || 'gemini-2.5-flash-image';

    // Validate model selection
    const selectedModel = VALID_MODELS.includes(model)
      ? model
      : 'gemini-2.5-flash-image';
    const selectedImageSize = VALID_IMAGE_SIZES.includes(
      imageSize as (typeof VALID_IMAGE_SIZES)[number]
    )
      ? imageSize
      : '1K';
    const normalizedImageSize =
      selectedModel === 'gemini-3-pro-image-preview' ? selectedImageSize : '1K';

    if (!prompt?.trim()) {
      return NextResponse.json(
        {
          error: 'Invalid prompt',
          details: 'Prompt cannot be empty',
        },
        { status: 400 }
      );
    }

    // Initialize Google GenAI with user's API key
    const genAI = new GoogleGenAI({ apiKey: userApiKeyData.apiKey });

    const imageParts = await Promise.all(
      images.map((file) => fileToGenerativePart(file))
    );
    const textPart: Part = { text: prompt };

    const response: GenerateContentResponse =
      await genAI.models.generateContent({
        model: selectedModel,
        contents: [{ parts: [textPart, ...imageParts] }],
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
          imageConfig: {
            aspectRatio: aspectRatio,
            imageSize: normalizedImageSize,
          },
        } as any, // Type assertion needed as imageConfig is not in TypeScript definitions yet
      });

    const result: Part[] = response.candidates?.[0]?.content?.parts || [];

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error generating image:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';

    // Check if error is related to invalid API key
    if (
      errorMessage.includes('API key') ||
      errorMessage.includes('authentication')
    ) {
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
      errorMessage.includes('NOT_FOUND')
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

    return NextResponse.json(
      { error: 'Internal Server Error', details: errorMessage },
      { status: 500 }
    );
  }
}
