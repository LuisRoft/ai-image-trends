"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

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

interface ImageGeneratorProps {
  prompt: any; // Type from Convex
  onBack: () => void;
}

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
  const { user } = useUser();
  const router = useRouter();
  const [editablePrompt, setEditablePrompt] = useState(prompt.prompt);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  // Check if user has configured their API key
  const userApiKey = useQuery(
    api.userApiKeys.getApiKey,
    user?.id ? { userId: user.id } : "skip"
  );

  const hasApiKey =
    userApiKey !== undefined && userApiKey !== null && userApiKey.hasKey;

  const handleImageUpload = (files: FileList) => {
    const validFiles: File[] = [];

    Array.from(files).forEach((file) => {
      // Check if the file format is supported
      const supportedFormats = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/bmp",
      ];

      if (!supportedFormats.includes(file.type)) {
        alert(
          `El formato ${file.type} no es compatible. Por favor, usa JPEG, PNG, GIF o BMP.`
        );
        return;
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert("El archivo es demasiado grande. El tamaño máximo es 10MB.");
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
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("prompt", editablePrompt);

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
          setApiKeyError(
            "No tienes una API key configurada. Por favor, ve a configuración para agregar tu API key de Gemini."
          );
          return;
        }
        if (data.invalidApiKey) {
          setApiKeyError(
            "Tu API key es inválida. Por favor, verifica tu configuración y actualízala."
          );
          return;
        }
        throw new Error(data.details || "Error al generar la imagen");
      }

      // Extract image data from the response
      const imageResults = data.result.filter(
        (part: any) =>
          part.inlineData && part.inlineData.mimeType.startsWith("image/")
      );
      const imageUrls = imageResults.map(
        (part: any) =>
          `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
      );

      setGeneratedImages(imageUrls);
    } catch (error) {
      console.error("Error generating image:", error);
      if (!apiKeyError) {
        alert("Error al generar la imagen. Por favor, inténtalo de nuevo.");
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
      (input: any) => input.type === "image" && input.required
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
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
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
            {prompt.inputs.some((input: any) => input.type === "image") && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Subir Imágenes</Label>
                  {/* Show descriptions for each image input */}
                  <div className="space-y-1">
                    {prompt.inputs
                      .filter((input: any) => input.type === "image")
                      .map((input: any, index: number) => (
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
                          src={URL.createObjectURL(file)}
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
            {prompt.inputs.some((input: any) => input.type === "text") && (
              <div className="space-y-2">
                <Label>Instrucciones de Personalización</Label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-blue-800 font-medium">
                    Puedes personalizar lo siguiente en el editor de prompts de
                    abajo:
                  </p>
                  <ul className="space-y-1">
                    {prompt.inputs
                      .filter((input: any) => input.type === "text")
                      .map((input: any) => (
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
              <SignInButton>
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
                  Edita tu prompt y haz clic en "Generar Imagen" para ver los
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
