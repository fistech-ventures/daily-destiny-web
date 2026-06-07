"use client";

import React from "react";
import { Article } from "@/lib/types";
import ArticleCard from "./ArticleCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface CategoryData {
  title: string;
  slug: string;
  articles: Article[];
}

interface FourCategoryGridProps {
  categories: CategoryData[]; // Pass array of 4 categories
}

export default function FourCategoryGrid({ categories }: FourCategoryGridProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-white p-4 rounded-md">
      {categories.slice(0, 4).map((cat) => {
        const leadArticle = cat.articles[0];
        const listArticles = cat.articles.slice(1, 4); // Next 3 items

        return (
          <div key={cat.slug} className="flex flex-col gap-4 border-r border-gray-100 last:border-0 pr-2 last:pr-0">
            
            {/* Minimal Header Line */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
              <Link href={`/${cat.slug}`} className="flex items-center gap-1 group">
                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-red-600 pl-2">
                  {cat.title}
                </h3>
              </Link>
              <Link href={`/${cat.slug}`} className="text-xs text-red-600 flex items-center gap-0.5 hover:underline">
                আরও <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Top Featured Card Content */}
            {leadArticle && (
              <ArticleCard article={leadArticle} variant="vertical-lead" />
            )}

            {/* Remaining Sublinks list */}
            <div className="flex flex-col">
              {listArticles.map((article) => (
                <ArticleCard key={article.code} article={article} variant="text-only" />
              ))}
            </div>

          </div>
        );
      })}
    </div>
  );
}