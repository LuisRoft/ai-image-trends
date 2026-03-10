'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Copy,
  Download,
  Loader2,
  Lock,
  Settings,
  Sparkles,
  Upload,
  X,
  Zap,
} from 'lucide-react';
import { Authenticated, Unauthenticated, useQuery } from 'convex/react';
import { SignInButton, useUser } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PromptWithAuthVisibility } from '@/lib/types/prompt';
import { cn } from '@/lib/utils';

interface PromptInput {
  key: string;
  type: string;
  description: string;
  required: boolean;
  placeholder?: string;
}

interface ImageGeneratorProps {
  prompt: PromptWithAuthVisibility;
  onBack: () => void;
}

type GenerationSource = 'credits' | 'user_api_key';

const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/bmp',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const DAILY_CREDITS_LIMIT = 10;

const modelOptions = [
  {
    value: 'gemini-2.5-flash-image',
    label: 'Flash (Rápido)',
    description: 'Generación rápida, ideal para iteraciones',
    icon: Zap,
    maxImages: 3,
    supportedSizes: ['1K'] as const,
  },
  {
    value: 'gemini-3-pro-image-preview',
    label: 'Pro (Avanzado)',
    description: 'Alta calidad, hasta 4K, pensamiento avanzado',
    icon: Sparkles,
    maxImages: 14,
    supportedSizes: ['1K', '2K', '4K'] as const,
  },
];

const aspectRatioOptions = [
  { value: '1:1', label: '1:1', description: 'Cuadrado' },
  { value: '2:3', label: '2:3', description: 'Retrato' },
  { value: '3:2', label: '3:2', description: 'Paisaje' },
  { value: '3:4', label: '3:4', description: 'Retrato' },
  { value: '4:3', label: '4:3', description: 'Paisaje' },
  { value: '4:5', label: '4:5', description: 'Retrato' },
  { value: '5:4', label: '5:4', description: 'Paisaje' },
  { value: '9:16', label: '9:16', description: 'Vertical' },
  { value: '16:9', label: '16:9', description: 'Widescreen' },
  { value: '21:9', label: '21:9', description: 'Ultra-wide' },
];

export default function ImageGenerator({
  prompt,
  onBack,
}: ImageGeneratorProps) {
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
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [selectedModel, setSelectedModel] = useState<string>(
    'gemini-2.5-flash-image'
  );
  const [imageSize, setImageSize] = useState<string>('1K');
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
      toast.error('Límite de imágenes excedido', {
        description: `El modelo ${currentModel.label} permite máximo ${maxImages} imágenes de referencia.`,
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
          description: `El archivo "${file.name}" excede el límite de 10MB.`,
        });
        return;
      }

      validFiles.push(file);
    });

    setUploadedImages((prev) => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setApiKeyError(null);

    const loadingToast = toast.loading('Generando imagen...', {
      description:
        generationSource === 'credits'
          ? `Usando ${currentModel.label} con créditos`
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
          toast.info('Generación en progreso', {
            description:
              'Ya hay una generación con créditos en curso. Espera a que termine.',
          });
          return;
        }
        if (data.noCredits) {
          toast.dismiss(loadingToast);
          toast.error('Sin créditos disponibles', {
            description:
              'Espera el reinicio diario a las 00:00 UTC o usa tu API key.',
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
              'Ve a configuración para agregar tu API key de Gemini.',
            action: {
              label: 'Configurar',
              onClick: () => router.push('/settings'),
            },
          });
          setApiKeyError(
            'No tienes una API key configurada. Por favor, ve a configuración para agregar tu API key de Gemini.'
          );
          return;
        }
        if (data.invalidApiKey) {
          toast.dismiss(loadingToast);
          toast.error('API Key inválida', {
            description: 'Verifica tu configuración y actualiza tu API key.',
            action: {
              label: 'Configurar',
              onClick: () => router.push('/settings'),
            },
          });
          setApiKeyError(
            'Tu API key es inválida. Por favor, verifica tu configuración y actualízala.'
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
      toast.success('¡Imagen generada!', {
        description:
          generationSource === 'credits' && data.creditsStatus
            ? `Se generó ${imageUrls.length} imagen(es). Te quedan ${data.creditsStatus.remainingCount} créditos hoy.`
            : `Se generó ${imageUrls.length} imagen(es) correctamente.`,
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast.dismiss(loadingToast);
      if (!apiKeyError) {
        toast.error('Error al generar', {
          description:
            error instanceof Error
              ? error.message
              : 'Por favor, inténtalo de nuevo.',
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = () => {
    if (editablePrompt.trim() === '') return false;

    const requiredImageInputs = prompt.inputs.filter(
      (input: PromptInput) => input.type === 'image' && input.required
    );
    if (requiredImageInputs.length > 0 && uploadedImages.length === 0) {
      return false;
    }

    return true;
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

  const handleGenerationSourceChange = (value: string) => {
    setApiKeyError(null);
    setGenerationSource(value as GenerationSource);
  };

  const handlePrimaryAction = () => {
    if (shouldConfigureUserApiKey) {
      router.push('/settings');
      return;
    }

    handleGenerate();
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
        ? 'Generación en progreso'
        : generationSource === 'credits' && !hasCreditsAvailable
          ? 'Sin créditos disponibles'
          : 'Generar Imagen';

  return (
    <div className="mx-auto w-full max-w-7xl py-4">
      {/* ── Header compacto ── */}
      <div className="mb-4 flex items-center gap-4 border-b border-zinc-200/80 pb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
          <Image
            src={prompt.imageUrl}
            alt={prompt.title}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-lg font-bold tracking-tight text-zinc-900">
              {prompt.title}
            </h1>
            <Badge
              variant="outline"
              className="shrink-0 rounded-full text-[11px]"
            >
              {prompt.category}
            </Badge>
          </div>
          <p className="truncate text-sm text-zinc-500">
            {prompt.description}
            {prompt.author && (
              <span className="text-zinc-400"> · por {prompt.author}</span>
            )}
          </p>
          {prompt.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap items-center gap-1">
              {prompt.tags.slice(0, 4).map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500"
                >
                  {tag}
                </span>
              ))}
              {prompt.tags.length > 4 && (
                <span className="text-[10px] text-zinc-400">
                  +{prompt.tags.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Layout principal: sidebar + canvas ── */}
      <div className="grid items-start gap-5 xl:grid-cols-[340px_1fr]">
        {/* ── SIDEBAR ── */}
        <aside className="xl:sticky xl:top-20 xl:max-h-[calc(100dvh-6rem)] rounded-2xl border border-zinc-200/80 bg-white/90 backdrop-blur-sm flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
            <div className="space-y-0 divide-y divide-zinc-100">
              {/* Referencias (imagen inputs) */}
              {hasImageInputs && (
                <section className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-sm">Referencias</Label>
                    <span className="text-xs text-zinc-400">
                      {uploadedImages.length}/{currentModel.maxImages}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {prompt.inputs
                      .filter((input: PromptInput) => input.type === 'image')
                      .map((input) => (
                        <p key={input.key} className="text-xs text-zinc-500">
                          <span className="font-medium text-zinc-700">
                            {input.required ? 'Obligatorio' : 'Opcional'}:
                          </span>{' '}
                          {input.description}
                        </p>
                      ))}
                  </div>

                  <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/70 p-4 text-center transition-colors hover:border-zinc-400 hover:bg-zinc-50">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          handleImageUpload(e.target.files);
                        }
                      }}
                      className="hidden"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="mx-auto mb-2 h-6 w-6 text-zinc-400" />
                      <p className="text-sm font-medium text-zinc-700">
                        Sube imágenes de referencia
                      </p>
                      <p className="mt-0.5 text-[11px] text-zinc-400">
                        JPEG, PNG, GIF o BMP · Máx. 10MB
                      </p>
                    </label>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {uploadedImages.map((file, index) => (
                        <div
                          key={`${file.name}-${file.size}-${file.lastModified}`}
                          className="min-w-20 max-w-20"
                        >
                          <div className="relative overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
                            <Image
                              src={previewUrls[index]!}
                              alt={`Imagen subida ${index + 1} para el prompt ${prompt.title}`}
                              width={80}
                              height={80}
                              className="h-20 w-20 object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-5 w-5 rounded-full p-0"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="mt-1 truncate text-[10px] text-zinc-400">
                            {file.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* Modelo + Resolución + Ratio */}
              <section className="space-y-3 p-4">
                <Label className="text-sm">Modelo</Label>
                <div className="grid grid-cols-2 gap-2">
                  {modelOptions.map((model) => {
                    const IconComponent = model.icon;
                    const isSelected = selectedModel === model.value;

                    return (
                      <button
                        key={model.value}
                        type="button"
                        onClick={() => {
                          setSelectedModel(model.value);
                          const nextDefaultSize = model.supportedSizes[0];

                          if (
                            !model.supportedSizes.some(
                              (size) => size === imageSize
                            )
                          ) {
                            setImageSize(nextDefaultSize);
                          }

                          if (uploadedImages.length > model.maxImages) {
                            setUploadedImages((prev) =>
                              prev.slice(0, model.maxImages)
                            );
                            toast.info('Imágenes ajustadas', {
                              description: `Se removieron imágenes para cumplir el límite de ${model.maxImages} del modelo ${model.label}.`,
                            });
                          }
                        }}
                        className={cn(
                          'flex flex-col items-start rounded-xl border p-3 text-left transition-all',
                          isSelected
                            ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                            : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
                        )}
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <IconComponent
                              className={cn(
                                'h-3.5 w-3.5',
                                isSelected ? 'text-white' : 'text-zinc-500'
                              )}
                            />
                            <span className="text-sm font-medium">
                              {model.label}
                            </span>
                          </div>
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 shrink-0 text-white" />
                          )}
                        </div>
                        <p
                          className={cn(
                            'mt-1 text-[11px] leading-tight',
                            isSelected ? 'text-zinc-300' : 'text-zinc-500'
                          )}
                        >
                          {model.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="image-size" className="text-xs">
                      Resolución
                    </Label>
                    <Select value={imageSize} onValueChange={setImageSize}>
                      <SelectTrigger id="image-size" className="h-9 w-full">
                        <SelectValue placeholder="Resolución" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentModel.supportedSizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="aspect-ratio" className="text-xs">
                      Aspect ratio
                    </Label>
                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                      <SelectTrigger id="aspect-ratio" className="h-9 w-full">
                        <SelectValue placeholder="Ratio" />
                      </SelectTrigger>
                      <SelectContent>
                        {aspectRatioOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center justify-between gap-4">
                              <span>{option.label}</span>
                              <span className="text-xs text-zinc-500">
                                {option.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              {/* Fuente de generación */}
              <Authenticated>
                <section className="space-y-3 p-4">
                  <Label className="text-sm">Fuente</Label>

                  <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-zinc-100 p-1">
                    <button
                      type="button"
                      onClick={() => handleGenerationSourceChange('credits')}
                      disabled={
                        !hasCreditsAvailable && generationSource !== 'credits'
                      }
                      className={cn(
                        'rounded-lg px-3 py-1.5 text-sm font-medium transition',
                        generationSource === 'credits'
                          ? 'bg-white text-zinc-900 shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-900',
                        !hasCreditsAvailable &&
                          generationSource !== 'credits' &&
                          'cursor-not-allowed opacity-50'
                      )}
                    >
                      Créditos
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleGenerationSourceChange('user_api_key')
                      }
                      disabled={!hasApiKey}
                      className={cn(
                        'rounded-lg px-3 py-1.5 text-sm font-medium transition',
                        generationSource === 'user_api_key'
                          ? 'bg-white text-zinc-900 shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-900',
                        !hasApiKey && 'cursor-not-allowed opacity-50'
                      )}
                    >
                      Mi API key
                    </button>
                  </div>

                  {generationSource === 'credits' ? (
                    !hasCreditsAvailable ? (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                          <div className="space-y-1.5">
                            <p className="text-xs font-medium text-amber-900">
                              Sin créditos disponibles.
                            </p>
                            <p className="text-xs text-amber-800">
                              Se recargan 24h después. Usa tu API key para
                              seguir.
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push('/settings')}
                              className="h-7 bg-white text-xs hover:bg-amber-100"
                            >
                              <Settings className="mr-1.5 h-3 w-3" />
                              Configurar API key
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500">
                        Te quedan{' '}
                        <span className="font-semibold text-zinc-900">
                          {creditsRemaining}
                        </span>{' '}
                        créditos hoy.
                      </p>
                    )
                  ) : hasApiKey ? (
                    <p className="text-xs text-zinc-500">
                      Generarás con tu API key personal.
                    </p>
                  ) : (
                    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600" />
                        <div className="space-y-1.5">
                          <p className="text-xs font-medium text-yellow-900">
                            Sin API key configurada.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push('/settings')}
                            className="h-7 bg-white text-xs hover:bg-yellow-100"
                          >
                            <Settings className="mr-1.5 h-3 w-3" />
                            Ir a Configuración
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </Authenticated>

              {/* Prompt avanzado */}
              <section className="space-y-3 p-4">
                <div className="flex items-center justify-between gap-2">
                  <Label className="text-sm">Prompt avanzado</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setIsPromptPanelOpen((prev) => !prev)}
                  >
                    {isPromptPanelOpen ? 'Ocultar' : 'Editar'}
                  </Button>
                </div>

                {isPromptPanelOpen && (
                  <div className="space-y-3">
                    {hasTextInputs && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">
                          Variables editables
                        </p>
                        <ul className="space-y-0.5">
                          {prompt.inputs
                            .filter(
                              (input: PromptInput) => input.type === 'text'
                            )
                            .map((input) => (
                              <li
                                key={input.key}
                                className="text-xs leading-5 text-zinc-600"
                              >
                                <span className="font-medium text-zinc-800">
                                  {input.description}
                                </span>
                                {input.placeholder && (
                                  <span className="italic">
                                    {' '}
                                    · busca [{input.placeholder}]
                                  </span>
                                )}
                                {input.required && (
                                  <span className="font-medium text-red-600">
                                    {' '}
                                    (Obligatorio)
                                  </span>
                                )}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="prompt-editor" className="text-xs">
                          Editor
                        </Label>
                        {isPromptUnlocked && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={copyPromptToClipboard}
                            className="h-6 text-[11px]"
                          >
                            {isCopied ? (
                              <>
                                <Check className="mr-1 h-3 w-3" />
                                Copiado
                              </>
                            ) : (
                              <>
                                <Copy className="mr-1 h-3 w-3" />
                                Copiar
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      <div className="relative">
                        <Textarea
                          id="prompt-editor"
                          placeholder="Edita tu prompt aquí..."
                          value={
                            isPromptUnlocked
                              ? editablePrompt
                              : 'Prompt bloqueado. Inicia sesión para verlo y editarlo.'
                          }
                          onChange={(e) => setEditablePrompt(e.target.value)}
                          readOnly={!isPromptUnlocked}
                          className={cn(
                            'min-h-[140px] border-zinc-200 bg-white font-mono text-xs transition',
                            !isPromptUnlocked &&
                              'pointer-events-none select-none text-transparent blur-sm shadow-[inset_0_0_0_1px_rgba(113,113,122,0.15)]'
                          )}
                        />
                        {!isPromptUnlocked && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-md border border-dashed border-zinc-200 bg-white/80 backdrop-blur-[2px]">
                            <div className="max-w-sm text-center">
                              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white shadow-sm">
                                <Lock className="h-3.5 w-3.5" />
                              </div>
                              <p className="text-xs font-semibold text-zinc-900">
                                Inicia sesión para ver este prompt
                              </p>
                              <SignInButton mode="modal">
                                <Button className="mt-2" size="sm">
                                  Ver prompt
                                </Button>
                              </SignInButton>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* ── Botón Generar — sticky bottom ── */}
          <div className="sticky bottom-0 border-t border-zinc-200 bg-white/95 p-4 backdrop-blur-sm rounded-b-2xl">
            {apiKeyError && (
              <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                  <div className="flex-1">
                    <p className="text-xs text-red-800">{apiKeyError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push('/settings')}
                      className="mt-2 h-7 border-red-300 bg-white text-xs hover:bg-red-50"
                    >
                      <Settings className="mr-1.5 h-3 w-3" />
                      Ir a Configuración
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <Authenticated>
              <Button
                onClick={handlePrimaryAction}
                disabled={isPrimaryActionDisabled}
                className="h-11 w-full rounded-xl"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : shouldConfigureUserApiKey ? (
                  <>
                    <Settings className="mr-2 h-4 w-4" />
                    {primaryActionLabel}
                  </>
                ) : (
                  primaryActionLabel
                )}
              </Button>
            </Authenticated>

            <Unauthenticated>
              <SignInButton mode="modal">
                <Button className="h-11 w-full rounded-xl" size="lg">
                  Iniciar Sesión para Generar
                </Button>
              </SignInButton>
            </Unauthenticated>
          </div>
        </aside>

        {/* ── CANVAS ── */}
        <section className="space-y-3">
          {/* Canvas area */}
          <div
            className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-[linear-gradient(135deg,rgba(244,244,245,0.9),rgba(255,255,255,1))] p-3 sm:p-5"
            style={{ aspectRatio: canvasAspectRatio }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,235,255,0.45),transparent_45%)]" />
            <div className="absolute inset-3 rounded-xl border border-dashed border-zinc-200/80" />

            <div className="relative flex h-full w-full items-center justify-center">
              {isGenerating ? (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                    <Loader2 className="h-7 w-7 animate-spin text-zinc-700" />
                  </div>
                  <p className="text-base font-semibold text-zinc-900">
                    Generando imagen...
                  </p>
                  <p className="mt-1.5 max-w-sm text-sm text-zinc-500">
                    {generationSource === 'credits'
                      ? `Usando ${currentModel.label} con créditos.`
                      : `Usando ${currentModel.label} con tu API key.`}
                  </p>
                </div>
              ) : selectedGeneratedImage ? (
                <>
                  <Image
                    src={selectedGeneratedImage}
                    alt={`Imagen generada con IA - ${prompt.title} (${selectedGeneratedImageIndex + 1})`}
                    fill
                    sizes="(max-width: 1279px) 100vw, 66vw"
                    className="rounded-xl object-contain"
                  />
                  <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                    {generatedImages.length > 1 && (
                      <span className="flex items-center rounded-lg bg-black/60 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                        {selectedGeneratedImageIndex + 1}/
                        {generatedImages.length}
                      </span>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 rounded-lg bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"
                      onClick={() =>
                        downloadImage(
                          selectedGeneratedImage,
                          selectedGeneratedImageIndex
                        )
                      }
                    >
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      Descargar
                    </Button>
                  </div>
                </>
              ) : (
                <div className="max-w-sm text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                    <Sparkles className="h-6 w-6 text-zinc-700" />
                  </div>
                  <p className="text-base font-semibold text-zinc-900">
                    Tu imagen aparecerá aquí
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-zinc-500">
                    Configura los parámetros y genera una imagen optimizada para{' '}
                    {aspectRatio}.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                    <Badge
                      variant="secondary"
                      className="rounded-full bg-white text-[11px] text-zinc-600"
                    >
                      {currentModel.label}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="rounded-full bg-white text-[11px] text-zinc-600"
                    >
                      {imageSize}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="rounded-full bg-white text-[11px] text-zinc-600"
                    >
                      {uploadedImages.length > 0
                        ? `${uploadedImages.length} ref.`
                        : 'Sin ref.'}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Variaciones — horizontal strip */}
          {generatedImages.length > 1 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-medium text-zinc-900">
                  Variaciones
                </h3>
                <p className="text-xs text-zinc-400">
                  Selecciona una para verla en grande
                </p>
              </div>
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {generatedImages.map((imageUrl, index) => (
                  <button
                    key={imageUrl}
                    type="button"
                    onClick={() => setSelectedGeneratedImageIndex(index)}
                    className={cn(
                      'relative shrink-0 overflow-hidden rounded-xl border bg-zinc-100 transition',
                      selectedGeneratedImageIndex === index
                        ? 'border-zinc-900 shadow-md ring-2 ring-zinc-900/10'
                        : 'border-zinc-200 hover:border-zinc-300'
                    )}
                  >
                    <Image
                      src={imageUrl}
                      alt={`Variación ${index + 1} de ${prompt.title}`}
                      width={100}
                      height={100}
                      className="h-20 w-20 object-cover sm:h-24 sm:w-24"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-2 py-1">
                      <span className="text-[10px] font-medium text-white">
                        {index + 1}
                      </span>
                    </div>
                    {selectedGeneratedImageIndex === index && (
                      <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900">
                        <Check className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
