import type { Doc } from '@/convex/_generated/dataModel';

export type PromptWithAuthVisibility = Omit<Doc<'prompts'>, 'prompt'> & {
  prompt: string | null;
};
