import type { Doc } from '@/convex/_generated/dataModel';

export type PromptWithPreviewUrl = Doc<'prompts'> & {
  previewUrl: string | null;
};

export type PromptWithAuthVisibility = Omit<
  PromptWithPreviewUrl,
  'prompt'
> & {
  prompt: string | null;
};
