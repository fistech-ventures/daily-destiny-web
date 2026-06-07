"use client";

import React from "react";
import { Article } from "@/lib/types";
import ArticleCard from "./ArticleCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface CategoryNewsRowProps {
  articles: Article[];
  title: string;
  categorySlug: string;
}

export default function CategoryNewsRow({
  articles = [],
  title,
  categorySlug,
}: CategoryNewsRowProps) {
  
  if (!articles || articles.length === 0) return null;

  // Split your incoming news array safely
  const featuredArticle = articles[0];
  const secondArticle = articles[1];
  const remainingArticles = articles.slice(2, 5); // Grabs 3rd, 4th, and 5th items

  return (
    <div className="w-full bg-white p-4 rounded-md flex flex-col gap-6">
      
      {/* Category Section Header line matching news styles */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <Link 
          href={`/${categorySlug}`}
          className="flex items-center gap-1.5 group cursor-pointer"
        >
          <h2 className="text-xl font-bold text-gray-900 border-b-2 border-red-600 pb-2 -mb-[10px]">
            {title}
          </h2>
          <ChevronRight className="h-5 w-5 text-red-600 mt-0.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Main Responsive Grid Framework */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: First Card (Big Featured Layout Block) */}
        <div className="lg:col-span-7 xl:col-span-8 w-full">
          <ArticleCard article={featuredArticle} variant="center-featured" />
        </div>

        {/* Right Column: Second Card and Feed list stacked neatly */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 w-full divide-y divide-gray-100">
          
          {/* Second Card styled as a regular standard horizontal article row */}
          {secondArticle && (
            <div className="pb-2">
              <ArticleCard article={secondArticle} variant="horizontal" />
            </div>
          )}

          {/* Remaining items parsed cleanly as a mini tracking sidebar block */}
          {remainingArticles.map((article) => (
            <div key={article.code} className="pt-2">
              <ArticleCard article={article} variant="compact-row" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}