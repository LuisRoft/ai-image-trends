"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Filter } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { aiImagePrompts, getAllCategories, searchPrompts } from "@/lib/prompts";
import type { ImagePrompt } from "@/lib/types";

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "hard":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getDifficultyIcon = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "●";
    case "medium":
      return "●●";
    case "hard":
      return "●●●";
    default:
      return "●";
  }
};

export default function GridPrompts() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const categories = ["All", ...getAllCategories()];

  const filteredPrompts = useMemo(() => {
    return searchPrompts(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPrompts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPrompts = filteredPrompts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handlePromptSelect = (prompt: ImagePrompt) => {
    router.push(`/generator?id=${prompt.id}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-sm sm:text-base lg:text-lg text-gray-800">
          Discover and explore {aiImagePrompts.length} AI image generation
          prompts across different categories
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search prompts, categories, or tags..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-64">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Showing {currentPrompts.length} of {filteredPrompts.length} prompts
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
          {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentPrompts.map((prompt) => (
          <Card
            key={prompt.id}
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 pt-0"
            onClick={() => handlePromptSelect(prompt)}
          >
            <div className="relative overflow-hidden rounded-t-lg">
              <Image
                src={prompt.imageUrl}
                alt={prompt.title}
                width={500}
                height={300}
                className="w-full h-46 object-cover group-hover:scale-105 transition-transform duration-300"
              />{" "}
              <div className="absolute top-3 right-3">
                <Badge className={getDifficultyColor(prompt.difficulty)}>
                  {getDifficultyIcon(prompt.difficulty)} {prompt.difficulty}
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {prompt.title}
                </CardTitle>
              </div>
              <Badge variant="outline" className="w-fit text-xs">
                {prompt.category}
              </Badge>
            </CardHeader>

            <CardContent className="pt-0">
              <CardDescription className="line-clamp-3 text-sm mb-4">
                {prompt.description}
              </CardDescription>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {prompt.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {prompt.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{prompt.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    📝 {prompt.inputs.length} input
                    {prompt.inputs.length !== 1 ? "s" : ""}
                  </span>
                  {prompt.author && (
                    <span className="truncate">by {prompt.author}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Show first page, last page, current page, and pages around current page
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1;

                  if (!showPage) {
                    // Show ellipsis only once between gaps
                    const showEllipsis =
                      (page === currentPage - 2 && currentPage > 3) ||
                      (page === currentPage + 2 &&
                        currentPage < totalPages - 2);

                    return showEllipsis ? (
                      <PaginationItem key={`ellipsis-${page}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : null;
                  }

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Empty State */}
      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No prompts found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or category filter
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setCurrentPage(1);
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
