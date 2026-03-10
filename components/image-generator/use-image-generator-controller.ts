'use client';

import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import type { PromptWithAuthVisibility } from '@/lib/types/prompt';
import {
  DAILY_CREDITS_LIMIT,
  MAX_FILE_SIZE,
  SUPPORTED_IMAGE_FORMATS,
  modelOptions,
} from '@/lib/image-generator/constants';
import type {
  GenerationSource,
  ModelOption,
  PromptInput,
} from '@/lib/types/image-generator';

export function useImageGeneratorController(prompt: PromptWithAuthVisibility) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [editablePrompt, setEditablePrompt] = useState(
    () => prompt.prompt ?? ''
  );
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedGeneratedImageIndex, setSelectedGeneratedImageIndex] =
    useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash-image');
  const [imageSize, setImageSize] = useState('1K');
  const [generationSource, setGenerationSource] =
    useState<GenerationSource>('credits');
  const [initializedSourceForUserId, setInitializedSourceForUserId] = useState<
    string | null
  >(null);
  const [isPromptPanelOpen, setIsPromptPanelOpen] = useState(() =>
    prompt.inputs.some((input: PromptInput) => input.type === 'text')
  );

  const userApiKey = useQuery(
    api.userApiKeys.getApiKey,
    isLoaded && user ? {} : 'skip'
  );
  const creditsStatus = useQuery(
    api.generationCredits.getDailyCreditsStatus,
    isLoaded && user ? {} : 'skip'
  );

  const currentModel = useMemo(
    () =>
      modelOptions.find((model) => model.value === selectedModel) ??
      modelOptions[0],
    [selectedModel]
  );
  const previewUrls = useMemo(
    () => uploadedImages.map((file) => URL.createObjectURL(file)),
    [uploadedImages]
  );
  const hasImageInputs = prompt.inputs.some(
    (input: PromptInput) => input.type === 'image'
  );
  const hasTextInputs = prompt.inputs.some(
    (input: PromptInput) => input.type === 'text'
  );
  const hasApiKey = Boolean(user && userApiKey && userApiKey.hasKey);
  const isPromptUnlocked = prompt.prompt !== null;
  const creditsRemaining = creditsStatus?.remainingCount ?? DAILY_CREDITS_LIMIT;
  const hasCreditsAvailable =
    creditsStatus === undefined ? true : creditsRemaining > 0;
  const hasPendingCreditGeneration =
    creditsStatus?.hasPendingGeneration ?? false;
  const isCreditsStatusLoading = Boolean(user && creditsStatus === undefined);
  const isApiKeyStatusLoading = Boolean(user && userApiKey === undefined);
  const shouldConfigureUserApiKey =
    generationSource === 'user_api_key' && !hasApiKey;
  const selectedGeneratedImage = generatedImages[selectedGeneratedImageIndex];
  const canvasAspectRatio = aspectRatio.replace(':', ' / ');

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!user) {
      setGenerationSource('credits');
      setInitializedSourceForUserId(null);
      return;
    }

    if (initializedSourceForUserId === user.id || userApiKey === undefined) {
      return;
    }

    setGenerationSource(userApiKey?.hasKey ? 'user_api_key' : 'credits');
    setInitializedSourceForUserId(user.id);
  }, [initializedSourceForUserId, isLoaded, user, userApiKey]);

  const handleImageUpload = (files: FileList) => {
    const validFiles: File[] = [];
    const maxImages = currentModel.maxImages;

    if (uploadedImages.length + files.length > maxImages) {
      toast.error('Limite de imagenes excedido', {
        description: `El modelo ${currentModel.label} permite maximo ${maxImages} imagenes de referencia.`,
      });
      return;
    }

    Array.from(files).forEach((file) => {
      if (!SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
        toast.error('Formato no compatible', {
          description: `El formato ${file.type} no es compatible. Usa JPEG, PNG, GIF o BMP.`,
        });
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error('Archivo muy grande', {
          description: `El archivo "${file.name}" excede el limite de 10MB.`,
        });
        return;
      }

      validFiles.push(file);
    });

    setUploadedImages((previousImages) => [...previousImages, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setUploadedImages((previousImages) =>
      previousImages.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setApiKeyError(null);

    const loadingToast = toast.loading('Generando imagen...', {
      description:
        generationSource === 'credits'
          ? `Usando ${currentModel.label} con creditos`
          : `Usando ${currentModel.label} con tu API key`,
    });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('prompt', editablePrompt);
      formDataToSend.append('aspectRatio', aspectRatio);
      formDataToSend.append('imageSize', imageSize);
      formDataToSend.append('model', selectedModel);
      formDataToSend.append('generationSource', generationSource);
      formDataToSend.append('promptId', prompt.id);

      uploadedImages.forEach((file) => {
        formDataToSend.append('images', file);
      });

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        body: formDataToSend,
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.generationInProgress) {
          toast.dismiss(loadingToast);
          toast.info('Generacion en progreso', {
            description:
              'Ya hay una generacion con creditos en curso. Espera a que termine.',
          });
          return;
        }

        if (data.noCredits) {
          toast.dismiss(loadingToast);
          toast.error('Sin creditos disponibles', {
            description:
              'Espera 24 horas desde que agotaste tus creditos o usa tu API key.',
            action: {
              label: 'Configurar API key',
              onClick: () => router.push('/settings'),
            },
          });
          return;
        }

        if (data.needsApiKey) {
          toast.dismiss(loadingToast);
          toast.error('API Key no configurada', {
            description:
              'Ve a configuracion para agregar tu API key de Gemini.',
            action: {
              label: 'Configurar',
              onClick: () => router.push('/settings'),
            },
          });
          setApiKeyError(
            'No tienes una API key configurada. Ve a configuracion para agregar tu API key de Gemini.'
          );
          return;
        }

        if (data.invalidApiKey) {
          toast.dismiss(loadingToast);
          toast.error('API Key invalida', {
            description: 'Verifica tu configuracion y actualiza tu API key.',
            action: {
              label: 'Configurar',
              onClick: () => router.push('/settings'),
            },
          });
          setApiKeyError(
            'Tu API key es invalida. Verifica tu configuracion y actualizala.'
          );
          return;
        }

        throw new Error(data.details || 'Error al generar la imagen');
      }

      interface ImagePart {
        inlineData?: { mimeType: string; data: string };
      }

      const imageResults = (data.result as ImagePart[]).filter(
        (part) =>
          part.inlineData && part.inlineData.mimeType.startsWith('image/')
      );
      const imageUrls = imageResults.map(
        (part) =>
          `data:${part.inlineData!.mimeType};base64,${part.inlineData!.data}`
      );

      setSelectedGeneratedImageIndex(0);
      setGeneratedImages(imageUrls);
      toast.dismiss(loadingToast);
      toast.success('Imagen generada', {
        description:
          generationSource === 'credits' && data.creditsStatus
            ? `Se generaron ${imageUrls.length} imagenes. Te quedan ${data.creditsStatus.remainingCount} creditos disponibles.`
            : `Se generaron ${imageUrls.length} imagenes correctamente.`,
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast.dismiss(loadingToast);

      if (!apiKeyError) {
        toast.error('Error al generar', {
          description:
            error instanceof Error
              ? error.message
              : 'Por favor, intentalo de nuevo.',
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = () => {
    if (editablePrompt.trim() === '') {
      return false;
    }

    const requiredImageInputs = prompt.inputs.filter(
      (input: PromptInput) => input.type === 'image' && input.required
    );

    if (requiredImageInputs.length > 0 && uploadedImages.length === 0) {
      return false;
    }

    return true;
  };

  const handleModelSelect = (model: ModelOption) => {
    setSelectedModel(model.value);
    const nextDefaultSize = model.supportedSizes[0];

    if (!model.supportedSizes.some((size) => size === imageSize)) {
      setImageSize(nextDefaultSize);
    }

    if (uploadedImages.length > model.maxImages) {
      setUploadedImages((previousImages) =>
        previousImages.slice(0, model.maxImages)
      );
      toast.info('Imagenes ajustadas', {
        description: `Se removieron imagenes para cumplir el limite de ${model.maxImages} del modelo ${model.label}.`,
      });
    }
  };

  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${prompt.title.replace(/\s+/g, '-').toLowerCase()}-${
      index + 1
    }.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyPromptToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editablePrompt);
      setIsCopied(true);
      toast.success('Prompt copiado', {
        description: 'El prompt ha sido copiado al portapapeles.',
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text: ', error);
      toast.error('Error al copiar', {
        description: 'No se pudo copiar el prompt al portapapeles.',
      });
    }
  };

  const handleGenerationSourceChange = (value: GenerationSource) => {
    setApiKeyError(null);
    setGenerationSource(value);
  };

  const handlePrimaryAction = () => {
    if (shouldConfigureUserApiKey) {
      router.push('/settings');
      return;
    }

    void handleGenerate();
  };

  const isPrimaryActionDisabled = shouldConfigureUserApiKey
    ? isApiKeyStatusLoading
    : !isPromptUnlocked ||
      !isFormValid() ||
      isGenerating ||
      (generationSource === 'credits'
        ? isCreditsStatusLoading ||
          !hasCreditsAvailable ||
          hasPendingCreditGeneration
        : isApiKeyStatusLoading || !hasApiKey);

  const primaryActionLabel = isGenerating
    ? 'Generando...'
    : shouldConfigureUserApiKey
      ? 'Agregar mi API key'
      : generationSource === 'credits' && hasPendingCreditGeneration
        ? 'Generacion en progreso'
        : generationSource === 'credits' && !hasCreditsAvailable
          ? 'Sin creditos disponibles'
          : 'Generar imagen';

  return {
    apiKeyError,
    aspectRatio,
    canvasAspectRatio,
    copyPromptToClipboard,
    creditsRemaining,
    currentModel,
    editablePrompt,
    generatedImages,
    generationSource,
    handleGenerationSourceChange,
    handleImageUpload,
    handleModelSelect,
    handlePrimaryAction,
    hasApiKey,
    hasCreditsAvailable,
    hasImageInputs,
    hasPendingCreditGeneration,
    hasTextInputs,
    imageSize,
    isCopied,
    isGenerating,
    isPrimaryActionDisabled,
    isPromptPanelOpen,
    isPromptUnlocked,
    previewUrls,
    primaryActionLabel,
    removeImage,
    router,
    selectedGeneratedImage,
    selectedGeneratedImageIndex,
    selectedModel,
    setAspectRatio,
    setEditablePrompt,
    setImageSize,
    setIsPromptPanelOpen,
    setSelectedGeneratedImageIndex,
    shouldConfigureUserApiKey,
    uploadedImages,
    downloadImage,
  };
}

export type ImageGeneratorController = ReturnType<
  typeof useImageGeneratorController
>;
