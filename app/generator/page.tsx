"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import ImageGenerator from "@/components/image-generator";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ImageGeneratorSkeleton } from "@/components/skeletons/image-generator-skeleton";

function GeneratorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const promptId = searchParams.get("id");

  // Get prompts from Convex
  const prompts = useQuery(api.prompts.getPrompts);

  // Show skeleton while loading
  if (prompts === undefined) {
    return <ImageGeneratorSkeleton />;
  }

  // Find the prompt by ID
  const prompt = prompts.find((p) => p.id === promptId);

  if (!prompt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Prompt no encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            El prompt que buscas no existe o ha sido eliminado.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    router.push("/");
  };

  return <ImageGenerator prompt={prompt} onBack={handleBack} />;
}

export default function GeneratorPage() {
  return (
    <div className="min-h-screen">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando generador...</p>
            </div>
          </div>
        }
      >
        <GeneratorContent />
      </Suspense>
    </div>
  );
}
