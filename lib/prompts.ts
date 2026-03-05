export interface PromptSearchItem {
  title: string;
  description: string;
  category: string;
  tags: string[];
}

export function getAllCategories(prompts: PromptSearchItem[]): string[] {
  return [...new Set(prompts.map((prompt) => prompt.category))].sort();
}

export function searchPrompts<T extends PromptSearchItem>(
  prompts: T[],
  searchQuery: string,
  selectedCategory: string
): T[] {
  return prompts.filter((prompt) => {
    const matchesSearch =
      searchQuery === '' ||
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag: string) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === 'All' || prompt.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
}
