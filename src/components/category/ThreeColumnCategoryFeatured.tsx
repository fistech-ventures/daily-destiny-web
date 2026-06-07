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
  categories: CategoryData[];
  sectionTitle?: string; // Made dynamic so you can pass "অন্যান্য" or anything else
}

export default function FourCategoryGrid({
  categories,
  sectionTitle = "অন্যান্য", // Defaults to the screenshot title
}: FourCategoryGridProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* 1. Main Global Section Header (Like "অন্যান্য" in the screenshot) */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex items-center gap-1.5 group cursor-pointer">
          <h2 className="text-xl font-bold text-gray-900 border-b-2 border-red-600 pb-2 -mb-[10px]">
            {sectionTitle}
          </h2>
          <ChevronRight className="h-5 w-5 text-red-600 mt-0.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>

      {/* 2. Four Column Grid Matrix */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 bg-transparent mt-2">
        {categories.slice(0, 4).map(cat => {
          const leadArticle = cat.articles[0];
          const listArticles = cat.articles.slice(1, 4);

          return (
            <div
              key={cat.slug} // Fixed: Key is assigned right back to the root map element
              className="flex flex-col bg-white border border-gray-200 rounded-md p-4 shadow-xs"
            >
              {/* Category Card Header */}
              <div className="flex items-start mb-4">
                <Link href={`/${cat.slug}`} className="inline-block group">
                  <h3 className="text-base font-bold text-gray-800 border-b-2 border-red-700 pb-1">
                    {cat.title}
                  </h3>
                </Link>
              </div>

              {/* Card Body Content */}
              <div className="flex-1 flex flex-col gap-4">
                {/* Top Featured Lead Layout */}
                {leadArticle && (
                  <div className="border-b border-gray-100 pb-3">
                    <ArticleCard
                      article={leadArticle}
                      variant="vertical-lead"
                    />
                  </div>
                )}

                {/* Sub-articles Text Links List */}
                <div className="flex flex-col flex-1">
                  {listArticles.map((article, idx) => (
                    <div
                      key={article.code || idx}
                      className="border-b border-gray-100 last:border-0 py-2.5 first:pt-0 last:pb-0"
                    >
                      <ArticleCard article={article} variant="text-only" />
                    </div>
                  ))}
                </div>
              </div>

              {/* "More" Action Button centered at bottom of card */}
              <div className="w-full flex justify-center mt-6 pt-2">
                <Link
                  href={`/${cat.slug}`}
                  className="inline-flex items-center justify-center bg-primary hover:bg-primary text-white text-xs font-medium px-5 py-2 rounded transition-colors shadow-xs min-w-[84px]"
                >
                  আরও
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
