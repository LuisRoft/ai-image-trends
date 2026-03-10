'use client';

import Image from 'next/image';
import { Check, Download, Loader2, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PromptWithAuthVisibility } from '@/lib/types/prompt';
import type { ImageGeneratorController } from './use-image-generator-controller';

interface ImageGeneratorCanvasProps {
  controller: ImageGeneratorController;
  prompt: PromptWithAuthVisibility;
}

export function ImageGeneratorCanvas({
  controller,
  prompt,
}: ImageGeneratorCanvasProps) {
  return (
    <section className="space-y-3">
      <div
        className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-[linear-gradient(135deg,rgba(244,244,245,0.9),rgba(255,255,255,1))] p-3 sm:p-5"
        style={{ aspectRatio: controller.canvasAspectRatio }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,235,255,0.45),transparent_45%)]" />
        <div className="absolute inset-3 rounded-xl border border-dashed border-zinc-200/80" />

        <div className="relative flex h-full w-full items-center justify-center">
          {controller.isGenerating ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <Loader2 className="h-7 w-7 animate-spin text-zinc-700" />
              </div>
              <p className="text-base font-semibold text-zinc-900">
                Generando imagen...
              </p>
              <p className="mt-1.5 max-w-sm text-sm text-zinc-500">
                {controller.generationSource === 'credits'
                  ? `Usando ${controller.currentModel.label} con creditos.`
                  : `Usando ${controller.currentModel.label} con tu API key.`}
              </p>
            </div>
          ) : controller.selectedGeneratedImage ? (
            <>
              <Image
                src={controller.selectedGeneratedImage}
                alt={`Imagen generada con IA - ${prompt.title} (${controller.selectedGeneratedImageIndex + 1})`}
                fill
                sizes="(max-width: 1279px) 100vw, 66vw"
                className="rounded-xl object-contain"
              />
              <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                {controller.generatedImages.length > 1 && (
                  <span className="flex items-center rounded-lg bg-black/60 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                    {controller.selectedGeneratedImageIndex + 1}/
                    {controller.generatedImages.length}
                  </span>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 rounded-lg bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"
                  onClick={() =>
                    controller.downloadImage(
                      controller.selectedGeneratedImage,
                      controller.selectedGeneratedImageIndex
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
                Tu imagen aparecera aqui
              </p>
              <p className="mt-1.5 text-sm leading-6 text-zinc-500">
                Configura los parametros y genera una imagen optimizada para{' '}
                {controller.aspectRatio}.
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                <Badge
                  variant="secondary"
                  className="rounded-full bg-white text-[11px] text-zinc-600"
                >
                  {controller.currentModel.label}
                </Badge>
                <Badge
                  variant="secondary"
                  className="rounded-full bg-white text-[11px] text-zinc-600"
                >
                  {controller.imageSize}
                </Badge>
                <Badge
                  variant="secondary"
                  className="rounded-full bg-white text-[11px] text-zinc-600"
                >
                  {controller.uploadedImages.length > 0
                    ? `${controller.uploadedImages.length} ref.`
                    : 'Sin ref.'}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </div>

      {controller.generatedImages.length > 1 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-medium text-zinc-900">Variaciones</h3>
            <p className="text-xs text-zinc-400">
              Selecciona una para verla en grande
            </p>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {controller.generatedImages.map((imageUrl, index) => (
              <button
                key={imageUrl}
                type="button"
                onClick={() => controller.setSelectedGeneratedImageIndex(index)}
                className={cn(
                  'relative shrink-0 overflow-hidden rounded-xl border bg-zinc-100 transition',
                  controller.selectedGeneratedImageIndex === index
                    ? 'border-zinc-900 shadow-md ring-2 ring-zinc-900/10'
                    : 'border-zinc-200 hover:border-zinc-300'
                )}
              >
                <Image
                  src={imageUrl}
                  alt={`Variacion ${index + 1} de ${prompt.title}`}
                  width={100}
                  height={100}
                  className="h-20 w-20 object-cover sm:h-24 sm:w-24"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-2 py-1">
                  <span className="text-[10px] font-medium text-white">
                    {index + 1}
                  </span>
                </div>
                {controller.selectedGeneratedImageIndex === index && (
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
  );
}
