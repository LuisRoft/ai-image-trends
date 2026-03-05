'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  startTransition,
} from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PromptCard from '@/components/prompt-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePaginatedQuery, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Doc } from '@/convex/_generated/dataModel';
import { PromptCardSkeleton } from '@/components/skeletons/prompt-grid-skeleton';
import { useDebounce } from '@/lib/use-debounce';

type PromptDoc = Doc<'prompts'>;

const ITEMS_PER_PAGE = 8;
const SEARCH_DEBOUNCE_MS = 300;

export default function GridPrompts() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const sentinelRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);
  const isSearchMode = debouncedSearch.trim().length > 0;
  const categoryArg = selectedCategory === 'All' ? undefined : selectedCategory;

  const categories = useQuery(api.prompts.getCategories);
  const categoriesList = ['All', ...(categories ?? [])];

  const { results, status, loadMore } = usePaginatedQuery(
    api.prompts.getPrompts,
    !isSearchMode ? { category: categoryArg } : 'skip',
    { initialNumItems: ITEMS_PER_PAGE }
  );

  const searchResult = useQuery(
    api.prompts.getPromptsSearch,
    isSearchMode
      ? {
          searchQuery: debouncedSearch.trim(),
          category: categoryArg,
          numItems: 200,
          offset: 0,
        }
      : 'skip'
  );

  const handleLoadMore = useCallback(() => {
    if (!isSearchMode && status === 'CanLoadMore') {
      loadMore(ITEMS_PER_PAGE);
    }
  }, [isSearchMode, status, loadMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) handleLoadMore();
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore]);

  const handleClearFilters = useCallback(() => {
    setSearchInput('');
    setSelectedCategory('All');
  }, []);

  const isInitialLoad = isSearchMode
    ? searchResult === undefined
    : status === 'LoadingFirstPage';

  const currentPrompts: PromptDoc[] = isSearchMode
    ? (searchResult?.page ?? [])
    : results;

  const isLoadingMore = !isSearchMode && status === 'LoadingMore';
  const isExhausted = !isSearchMode && status === 'Exhausted';
  const hasResults = currentPrompts.length > 0;

  const handleCategoryChange = useCallback((value: string) => {
    startTransition(() => setSelectedCategory(value));
  }, []);

  const handlePromptSelect = useCallback(
    (prompt: PromptDoc) => {
      router.push(`/generator?id=${prompt.id}`);
    },
    [router]
  );

  return (
    <div className="w-full max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <p className="text-sm sm:text-base lg:text-lg text-gray-800">
          Descubre y explora prompts de generación de imágenes de IA en
          diferentes categorías
        </p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar prompts, categorías o etiquetas..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-64">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Seleccionar categoría" />
          </SelectTrigger>
          <SelectContent>
            {categoriesList.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isSearchMode && searchResult !== undefined && (
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            {searchResult.totalCount === 0
              ? 'Sin resultados'
              : `${searchResult.totalCount} prompt${searchResult.totalCount !== 1 ? 's' : ''} encontrado${searchResult.totalCount !== 1 ? 's' : ''}`}
            {selectedCategory !== 'All' && ` en ${selectedCategory}`}
          </p>
        </div>
      )}

      {isInitialLoad ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, i) => (
            <PromptCardSkeleton key={i} />
          ))}
        </div>
      ) : hasResults ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentPrompts.map((prompt, i) => (
              <div
                key={prompt.id}
                className="animate-fade-up"
                style={{
                  animationDelay: `${Math.min(i % ITEMS_PER_PAGE, 7) * 40}ms`,
                }}
              >
                <PromptCard prompt={prompt} onClick={handlePromptSelect} />
              </div>
            ))}
            {isLoadingMore &&
              Array.from({ length: 4 }, (_, i) => (
                <PromptCardSkeleton key={`loading-${i}`} />
              ))}
          </div>

          {!isSearchMode && <div ref={sentinelRef} className="h-1" />}

          {isExhausted && (
            <p className="mt-10 text-center text-sm text-gray-400">
              Has visto todos los prompts
            </p>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron prompts
          </h3>
          <p className="text-gray-600 mb-4">
            Intenta ajustar tus términos de búsqueda o filtro de categoría
          </p>
          <Button variant="outline" onClick={handleClearFilters}>
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
