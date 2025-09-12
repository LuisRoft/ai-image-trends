export interface ImagePrompt {
  id: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
  inputs: {
    type: "image" | "text" | "none";
    description: string;
    required: boolean;
    placeholder?: string;
    options?: string[];
    // Add an identifier for mapping form state
    key: string;
  }[];
  outputType: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  author?: string;
  sourceUrl?: string;
  // A representative image for the card
  imageUrl: string;
}

export interface PromptFormData {
  [key: string]: string | File | null;
}
