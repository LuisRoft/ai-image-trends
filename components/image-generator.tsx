"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Upload,
  Download,
  Loader2,
  Copy,
  Check,
  X,
  Settings,
  AlertCircle,
  Sparkles,
  Zap,
} from "lucide-react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Doc } from "@/convex/_generated/dataModel";

interface PromptInput {
  key: string;
  type: string;
  description: string;
  required: boolean;
  placeholder?: string;
}

interface ImageGeneratorProps {
  prompt: Doc<"prompts">;
  onBack: () => void;
}

const SUPPORTED_IMAGE_FORMATS = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/bmp",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const modelOptions = [
  {
    value: "gemini-2.5-flash-image",
    label: "Flash (Rápido)",
    description: "Generación rápida, ideal para iteraciones",
    icon: Zap,
    maxImages: 3,
    supportedSizes: ["1K"] as const,
  },
  {
    value: "gemini-3-pro-image-preview",
    label: "Pro (Avanzado)",
    description: "Alta calidad, hasta 4K, pensamiento avanzado",
    icon: Sparkles,
    maxImages: 14,
    supportedSizes: ["1K", "2K", "4K"] as const,
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "hard":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getDifficultyIcon = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "●";
    case "medium":
      return "●●";
    case "hard":
      return "●●●";
    default:
      return "●";
  }
};

export default function ImageGenerator({
  prompt,
  onBack,
}: ImageGeneratorProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [editablePrompt, setEditablePrompt] = useState(prompt.prompt);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>("1:1");
  const [selectedModel, setSelectedModel] = useState<string>("gemini-2.5-flash-image");
  const [imageSize, setImageSize] = useState<string>("1K");

  // Check if user has configured their API key - only query if user is logged in
  const userApiKey = useQuery(
    api.userApiKeys.getApiKey,
    isLoaded && user ? {} : "skip"
  );

  const hasApiKey =
    user &&
    userApiKey !== undefined &&
    userApiKey !== null &&
    userApiKey.hasKey;

  const currentModel = useMemo(
    () => modelOptions.find((m) => m.value === selectedModel) ?? modelOptions[0],
    [selectedModel]
  );

  const previewUrls = useMemo(
    () => uploadedImages.map((file) => URL.createObjectURL(file)),
    [uploadedImages]
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleImageUpload = (files: FileList) => {
    const validFiles: File[] = [];
    const maxImages = currentModel.maxImages;

    // Check if adding these files would exceed the limit
    if (uploadedImages.length + files.length > maxImages) {
      toast.error(`Límite de imágenes excedido`, {
        description: `El modelo ${currentModel?.label} permite máximo ${maxImages} imágenes de referencia.`,
      });
      return;
    }

    Array.from(files).forEach((file) => {
      // Check if the file format is supported
      if (!SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
        toast.error(`Formato no compatible`, {
          description: `El formato ${file.type} no es compatible. Usa JPEG, PNG, GIF o BMP.`,
        });
        return;
      }

      // Check file size (max 10MB)
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`Archivo muy grande`, {
          description: `El archivo "${file.name}" excede el límite de 10MB.`,
        });
        return;
      }

      validFiles.push(file);
    });

    setUploadedImages((prev) => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setApiKeyError(null);
    
    const loadingToast = toast.loading("Generando imagen...", {
      description: `Usando modelo ${currentModel.label}`,
    });
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("prompt", editablePrompt);
      formDataToSend.append("aspectRatio", aspectRatio);
      formDataToSend.append("imageSize", imageSize);
      formDataToSend.append("model", selectedModel);

      // Add uploaded images
      uploadedImages.forEach((file) => {
        formDataToSend.append("images", file);
      });

      const response = await fetch("/api/generate-image", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (data.needsApiKey) {
          toast.dismiss(loadingToast);
          toast.error("API Key no configurada", {
            description: "Ve a configuración para agregar tu API key de Gemini.",
            action: {
              label: "Configurar",
              onClick: () => router.push("/settings"),
            },
          });
          setApiKeyError(
            "No tienes una API key configurada. Por favor, ve a configuración para agregar tu API key de Gemini."
          );
          return;
        }
        if (data.invalidApiKey) {
          toast.dismiss(loadingToast);
          toast.error("API Key inválida", {
            description: "Verifica tu configuración y actualiza tu API key.",
            action: {
              label: "Configurar",
              onClick: () => router.push("/settings"),
            },
          });
          setApiKeyError(
            "Tu API key es inválida. Por favor, verifica tu configuración y actualízala."
          );
          return;
        }
        throw new Error(data.details || "Error al generar la imagen");
      }

      // Extract image data from the response
      interface ImagePart {
        inlineData?: { mimeType: string; data: string };
      }
      const imageResults = (data.result as ImagePart[]).filter(
        (part) =>
          part.inlineData && part.inlineData.mimeType.startsWith("image/")
      );
      const imageUrls = imageResults.map(
        (part) =>
          `data:${part.inlineData!.mimeType};base64,${part.inlineData!.data}`
      );

      setGeneratedImages(imageUrls);
      toast.dismiss(loadingToast);
      toast.success("¡Imagen generada!", {
        description: `Se generó ${imageUrls.length} imagen(es) correctamente.`,
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast.dismiss(loadingToast);
      if (!apiKeyError) {
        toast.error("Error al generar", {
          description: error instanceof Error ? error.message : "Por favor, inténtalo de nuevo.",
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = () => {
    // Check if prompt is not empty
    if (editablePrompt.trim() === "") return false;

    // Check if required image inputs are provided
    const requiredImageInputs = prompt.inputs.filter(
      (input: PromptInput) => input.type === "image" && input.required
    );
    if (requiredImageInputs.length > 0 && uploadedImages.length === 0) {
      return false;
    }

    return true;
  };

  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${prompt.title.replace(/\s+/g, "-").toLowerCase()}-${
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
      toast.success("Prompt copiado", {
        description: "El prompt ha sido copiado al portapapeles.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("Error al copiar", {
        description: "No se pudo copiar el prompt al portapapeles.",
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto  py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Catálogo
        </Button>

        <div className="flex items-start gap-6">
          <div className="relative">
            <Image
              src={prompt.imageUrl}
              alt={prompt.title}
              width={300}
              height={200}
              className="rounded-lg object-cover"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {prompt.title}
            </h1>
            <p className="text-gray-600 mb-4">{prompt.description}</p>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">{prompt.category}</Badge>
              <Badge className={getDifficultyColor(prompt.difficulty)}>
                {getDifficultyIcon(prompt.difficulty)} {prompt.difficulty}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {prompt.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {prompt.author && (
              <p className="text-sm text-gray-500">
                Creado por {prompt.author}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Configura tu Generación</CardTitle>
            <CardDescription>
              {prompt.inputs.length === 0
                ? "Edita el prompt a continuación para generar tu imagen de IA. Puedes modificar cualquier cosa entre [ ] para personalizarlo a tu estilo."
                : "Configura las entradas a continuación y edita el prompt para generar tu imagen de IA. Completa los campos obligatorios y modifica cualquier cosa entre [ ] para personalizarlo a tu estilo."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image Upload Section - Only show if prompt has image inputs */}
            {prompt.inputs.some((input: PromptInput) => input.type === "image") && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Subir Imágenes</Label>
                  {/* Show descriptions for each image input */}
                  <div className="space-y-1">
                    {prompt.inputs
                      .filter((input: PromptInput) => input.type === "image")
                      .map((input) => (
                        <p key={input.key} className="text-sm text-gray-600">
                          <span className="font-medium">
                            {input.required ? "Obligatorio" : "Opcional"}:
                          </span>{" "}
                          {input.description}
                        </p>
                      ))}
                  </div>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
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
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Haz clic para subir imágenes o arrastra y suelta
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Formatos soportados: JPEG, PNG, GIF, BMP (Máx 10MB cada
                      uno)
                    </p>
                  </label>
                </div>

                {/* Uploaded Images Preview */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {uploadedImages.map((file, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={previewUrls[index]!}
                          alt={`Subido ${index + 1}`}
                          width={150}
                          height={100}
                          className="rounded-lg object-cover w-full h-24"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Customization Instructions - Show if prompt has text inputs */}
            {prompt.inputs.some((input: PromptInput) => input.type === "text") && (
              <div className="space-y-2">
                <Label>Instrucciones de Personalización</Label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-blue-800 font-medium">
                    Puedes personalizar lo siguiente en el editor de prompts de
                    abajo:
                  </p>
                  <ul className="space-y-1">
                    {prompt.inputs
                      .filter((input: PromptInput) => input.type === "text")
                      .map((input) => (
                        <li key={input.key} className="text-sm text-blue-700">
                          <span className="font-medium">•</span>{" "}
                          <span className="font-medium">
                            {input.description}:
                          </span>{" "}
                          {input.placeholder && (
                            <span className="italic">
                              Busca [{input.placeholder}] en el prompt y
                              reemplázalo con el valor deseado
                            </span>
                          )}
                          {input.required && (
                            <span className="text-red-600 font-medium">
                              {" "}
                              (Obligatorio)
                            </span>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Editable Prompt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="prompt-editor">Editor de Prompt</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyPromptToClipboard}
                  className="h-8"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                id="prompt-editor"
                placeholder="Edita tu prompt aquí..."
                value={editablePrompt}
                onChange={(e) => setEditablePrompt(e.target.value)}
                className="min-h-[120px] font-mono text-sm"
              />
            </div>

            {/* Model Selector */}
            <div className="space-y-3">
              <Label>Modelo de Generación</Label>
              <div className="grid grid-cols-2 gap-3">
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
                        if (!model.supportedSizes.some((size) => size === imageSize)) {
                          setImageSize(nextDefaultSize);
                        }
                        // Clear images if exceeding new model limit
                        if (uploadedImages.length > model.maxImages) {
                          setUploadedImages((prev) => prev.slice(0, model.maxImages));
                          toast.info("Imágenes ajustadas", {
                            description: `Se removieron imágenes para cumplir el límite de ${model.maxImages} del modelo ${model.label}.`,
                          });
                        }
                      }}
                      className={`relative flex flex-col items-start p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <IconComponent
                          className={`h-4 w-4 ${
                            isSelected ? "text-primary" : "text-gray-500"
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            isSelected ? "text-primary" : "text-gray-900"
                          }`}
                        >
                          {model.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{model.description}</p>
                      <span className="text-xs text-gray-400 mt-1">
                        Máx. {model.maxImages} imágenes
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500">
                Flash es más rápido para iteraciones. Pro ofrece mayor calidad y resolución hasta 4K.
              </p>
            </div>

            {/* Image Size Selector */}
            <div className="space-y-2">
              <Label htmlFor="image-size">Resolución de salida</Label>
              <Select value={imageSize} onValueChange={setImageSize}>
                <SelectTrigger id="image-size">
                  <SelectValue placeholder="Selecciona la resolución" />
                </SelectTrigger>
                <SelectContent>
                  {currentModel.supportedSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Si envías imagen de referencia, Gemini puede mantener su tamaño original por defecto. Esta opción fuerza la resolución de salida cuando el modelo lo soporta.
              </p>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="space-y-2">
              <Label htmlFor="aspect-ratio">Relación de Aspecto</Label>
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger id="aspect-ratio">
                  <SelectValue placeholder="Selecciona la relación de aspecto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:1">
                    <div className="flex items-center justify-between w-full">
                      <span>1:1 (Cuadrado)</span>
                      <span className="text-xs text-gray-500 ml-4">
                        1024x1024
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="2:3">
                    <div className="flex items-center justify-between w-full">
                      <span>2:3 (Retrato)</span>
                      <span className="text-xs text-gray-500 ml-4">
                        832x1248
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="3:2">
                    <div className="flex items-center justify-between w-full">
                      <span>3:2 (Paisaje)</span>
                      <span className="text-xs text-gray-500 ml-4">
                        1248x832
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="3:4">
                    <div className="flex items-center justify-between w-full">
                      <span>3:4 (Retrato)</span>
                      <span className="text-xs text-gray-500 ml-4">
                        864x1184
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="4:3">
                    <div className="flex items-center justify-between w-full">
                      <span>4:3 (Paisaje)</span>
                      <span className="text-xs text-gray-500 ml-4">
                        1184x864
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="4:5">
                    <div className="flex items-center justify-between w-full">
                      <span>4:5 (Retrato)</span>
                      <span className="text-xs text-gray-500 ml-4">
                        896x1152
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="5:4">
                    <div className="flex items-center justify-between w-full">
                      <span>5:4 (Paisaje)</span>
                      <span className="text-xs text-gray-500 ml-4">
                        1152x896
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="9:16">
                    <div className="flex items-center justify-between w-full">
                      <span>9:16 (Vertical)</span>
                      <span className="text-xs text-gray-500 ml-4">
                        768x1344
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="16:9">
                    <div className="flex items-center justify-between w-full">
                      <span>16:9 (Widescreen)</span>
                      <span className="text-xs text-gray-500 ml-4">
                        1344x768
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="21:9">
                    <div className="flex items-center justify-between w-full">
                      <span>21:9 (Ultra-wide)</span>
                      <span className="text-xs text-gray-500 ml-4">
                        1536x672
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Selecciona la relación de aspecto deseada para tu imagen
                generada
              </p>
            </div>

            <Authenticated>
              {/* API Key Warning */}
              {!hasApiKey && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-yellow-900 mb-1">
                        API Key no configurada
                      </h4>
                      <p className="text-sm text-yellow-800 mb-3">
                        Para generar imágenes necesitas configurar tu API key
                        personal de Google Gemini.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/settings")}
                        className="bg-white hover:bg-yellow-50 border-yellow-300"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Ir a Configuración
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* API Key Error */}
              {apiKeyError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-red-900 mb-1">Error</h4>
                      <p className="text-sm text-red-800 mb-3">{apiKeyError}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/settings")}
                        className="bg-white hover:bg-red-50 border-red-300"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Ir a Configuración
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={!isFormValid() || isGenerating || !hasApiKey}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  "Generar Imagen"
                )}
              </Button>
            </Authenticated>
            <Unauthenticated>
              <SignInButton mode="modal">
                <Button className="w-full" size="lg">
                  Iniciar Sesión para Generar
                </Button>
              </SignInButton>
            </Unauthenticated>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Resultados Generados</CardTitle>
            <CardDescription>
              Tus imágenes generadas por IA aparecerán aquí
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedImages.length > 0 ? (
              <div className="space-y-4">
                {generatedImages.map((imageUrl, index) => (
                  <div key={index} className="space-y-2">
                    <div className="relative">
                      <Image
                        src={imageUrl}
                        alt={`Generated image ${index + 1}`}
                        width={400}
                        height={300}
                        className="w-full rounded-lg object-cover"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadImage(imageUrl, index)}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Imagen {index + 1}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">🎨</div>
                <p>
                  Edita tu prompt y haz clic en &apos;Generar Imagen&apos; para ver los
                  resultados
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
