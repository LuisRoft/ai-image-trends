import { memo } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { Doc } from '@/convex/_generated/dataModel';

type PromptDoc = Doc<'prompts'>;

interface PromptCardProps {
  prompt: PromptDoc;
  onClick: (prompt: PromptDoc) => void;
}

const PromptCard = memo(function PromptCard({
  prompt,
  onClick,
}: PromptCardProps) {
  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-2xl aspect-[3/4] bg-zinc-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
      onClick={() => onClick(prompt)}
    >
      <Image
        src={prompt.imageUrl}
        alt={prompt.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />

      <div className="absolute top-3 left-3 z-10">
        <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-zinc-800 shadow-sm">
          {prompt.category}
        </span>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
        <h3 className="text-white font-semibold text-base leading-snug line-clamp-2 mb-2 drop-shadow">
          {prompt.title}
        </h3>
        <div className="flex flex-wrap gap-1 mb-3">
          {prompt.tags.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-2 py-0.5 text-xs text-white/90"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-zinc-900 text-sm font-semibold">
          <span>Probar prompt</span>
          <ArrowRight className="size-4" />
        </div>
      </div>
    </div>
  );
});

export default PromptCard;
