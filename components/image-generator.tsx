'use client';

import { ImageGeneratorCanvas } from '@/components/image-generator/image-generator-canvas';
import { ImageGeneratorHeader } from '@/components/image-generator/image-generator-header';
import { ImageGeneratorSidebar } from '@/components/image-generator/image-generator-sidebar';
import { useImageGeneratorController } from '@/components/image-generator/use-image-generator-controller';
import type { ImageGeneratorProps } from '@/lib/types/image-generator';

export default function ImageGenerator({
  onBack,
  prompt,
}: ImageGeneratorProps) {
  const controller = useImageGeneratorController(prompt);

  return (
    <div className="mx-auto w-full max-w-7xl py-4">
      <ImageGeneratorHeader onBack={onBack} prompt={prompt} />

      <div className="grid items-start gap-5 xl:grid-cols-[340px_1fr]">
        <ImageGeneratorSidebar controller={controller} prompt={prompt} />
        <ImageGeneratorCanvas controller={controller} prompt={prompt} />
      </div>
    </div>
  );
}
