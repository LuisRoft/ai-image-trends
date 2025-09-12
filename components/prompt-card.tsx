"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ImagePrompt } from "@/lib/types";

interface PromptCardProps {
  prompt: ImagePrompt;
  onSelect: (prompt: ImagePrompt) => void;
  getDifficultyColor: (difficulty: string) => string;
  getDifficultyIcon: (difficulty: string) => string;
}

export default function PromptCard({ 
  prompt, 
  onSelect, 
  getDifficultyColor, 
  getDifficultyIcon 
}: PromptCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Card 
      ref={cardRef}
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      onClick={() => onSelect(prompt)}
    >
      <div className="relative overflow-hidden rounded-t-lg bg-gray-100">
        {isVisible ? (
          <>
            {!imageLoaded && (
              <div className="w-full h-48 bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="text-gray-400 text-sm">Loading...</div>
              </div>
            )}
            <Image
              src={prompt.imageUrl}
              alt={prompt.title}
              width={500}
              height={300}
              className={`w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          </>
        ) : (
          <div className="w-full h-48 bg-gray-200 animate-pulse" />
        )}
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
              📝 {prompt.inputs.length} input{prompt.inputs.length !== 1 ? 's' : ''}
            </span>
            {prompt.author && (
              <span className="truncate">
                by {prompt.author}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
