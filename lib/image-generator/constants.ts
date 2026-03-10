import { Sparkles, Zap } from 'lucide-react';
import type {
  AspectRatioOption,
  ModelOption,
} from '@/lib/types/image-generator';

export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/bmp',
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const DAILY_CREDITS_LIMIT = 10;

export const modelOptions: ModelOption[] = [
  {
    value: 'gemini-2.5-flash-image',
    label: 'Flash (Rapido)',
    description: 'Generacion rapida, ideal para iteraciones',
    icon: Zap,
    maxImages: 3,
    supportedSizes: ['1K'],
  },
  {
    value: 'gemini-3-pro-image-preview',
    label: 'Pro (Avanzado)',
    description: 'Alta calidad, hasta 4K, pensamiento avanzado',
    icon: Sparkles,
    maxImages: 14,
    supportedSizes: ['1K', '2K', '4K'],
  },
];

export const aspectRatioOptions: AspectRatioOption[] = [
  { value: '1:1', label: '1:1', description: 'Cuadrado' },
  { value: '2:3', label: '2:3', description: 'Retrato' },
  { value: '3:2', label: '3:2', description: 'Paisaje' },
  { value: '3:4', label: '3:4', description: 'Retrato' },
  { value: '4:3', label: '4:3', description: 'Paisaje' },
  { value: '4:5', label: '4:5', description: 'Retrato' },
  { value: '5:4', label: '5:4', description: 'Paisaje' },
  { value: '9:16', label: '9:16', description: 'Vertical' },
  { value: '16:9', label: '16:9', description: 'Widescreen' },
  { value: '21:9', label: '21:9', description: 'Ultra-wide' },
];
