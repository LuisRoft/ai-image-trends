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
} from "lucide-react";
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
import type { ImagePrompt } from "@/lib/types";

interface ImageGeneratorProps {
  prompt: ImagePrompt;
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
  const [editablePrompt, setEditablePrompt] = useState(prompt.prompt);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);

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

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();

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
      alert("Error generating image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = () => {
    return editablePrompt.trim() !== "";
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
          Back to Catalog
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
              {prompt.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {prompt.author && (
              <p className="text-sm text-gray-500">
                Created by {prompt.author}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Configure Your Generation</CardTitle>
            <CardDescription>
              Edit the prompt below and optionally add images to generate your
              AI image. You can modify anything between [ ] to customize it to
              your style.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label>Upload Images (Optional)</Label>
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
                    Click to upload images or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: JPEG, PNG, GIF, BMP (Max 10MB each)
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
                        alt={`Uploaded ${index + 1}`}
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

            {/* Editable Prompt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="prompt-editor">Prompt Editor</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyPromptToClipboard}
                  className="h-8"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                id="prompt-editor"
                placeholder="Edit your prompt here..."
                value={editablePrompt}
                onChange={(e) => setEditablePrompt(e.target.value)}
                className="min-h-[120px] font-mono text-sm"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!isFormValid() || isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Image"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Results</CardTitle>
            <CardDescription>
              Your AI-generated images will appear here
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
                      Download Image {index + 1}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">🎨</div>
                <p>
                  Edit your prompt and click "Generate Image" to see results
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
