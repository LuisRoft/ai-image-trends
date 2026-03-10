'use client';

import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PromptWithAuthVisibility } from '@/lib/types/prompt';

interface ImageGeneratorHeaderProps {
  onBack: () => void;
  prompt: PromptWithAuthVisibility;
}

export function ImageGeneratorHeader({
  onBack,
  prompt,
}: ImageGeneratorHeaderProps) {
  return (
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
        {prompt.previewUrl ? (
          <Image
            src={prompt.previewUrl}
            alt={prompt.title}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-200" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-lg font-bold tracking-tight text-zinc-900">
            {prompt.title}
          </h1>
          <Badge variant="outline" className="shrink-0 rounded-full text-[11px]">
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
            {prompt.tags.slice(0, 4).map((tag) => (
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
  );
}
