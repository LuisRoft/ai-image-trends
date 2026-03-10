import type { LucideIcon } from 'lucide-react';
import type { PromptWithAuthVisibility } from '@/lib/types/prompt';

export interface PromptInput {
  key: string;
  type: string;
  description: string;
  required: boolean;
  placeholder?: string;
}

export interface ImageGeneratorProps {
  prompt: PromptWithAuthVisibility;
  onBack: () => void;
}

export type GenerationSource = 'credits' | 'user_api_key';

export interface ModelOption {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
  maxImages: number;
  supportedSizes: readonly string[];
}

export interface AspectRatioOption {
  value: string;
  label: string;
  description: string;
}
