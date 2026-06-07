"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import ArticleCard from "./ArticleCard";
import { Article } from "@/lib/types";

interface SubCategoryItem {
  id: string;
  title: string;
  titleBn: string;
  slug: string;
  position: number;
  articles: Article[];
}

interface DedicatedCategoryGridProps {
  mainCategoryTitle: string; 
  mainCategorySlug: string;  
  subCategoriesData: SubCategoryItem[]; 
}

export default function DedicatedCategoryGrid({
  mainCategoryTitle,
  mainCategorySlug,
  subCategoriesData,
}: DedicatedCategoryGridProps) {
  
  if (!subCategoriesData || subCategoriesData.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      
      {/* Global Parent Section Header (e.g., আন্তর্জাতিক) */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <Link href={`/${mainCategorySlug}`} className="flex items-center gap-1.5 group cursor-pointer">
          <h2 className="text-xl font-bold text-gray-900 border-b-2 border-red-600 pb-2 -mb-[10px]">
            {mainCategoryTitle}
          </h2>
          <ChevronRight className="h-5 w-5 text-red-600 mt-0.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* 4-Column Subcategory Matrix Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 bg-transparent mt-2">
        {subCategoriesData.slice(0, 4).map((subCat) => {
          const leadArticle = subCat.articles?.[0];
          const listArticles = subCat.articles?.slice(1, 4) || [];

          return (
            <div
              key={subCat.id}
              className="flex flex-col bg-white border border-gray-200 rounded-md p-4 shadow-xs justify-between"
            >
              <div>
                {/* Subcategory Header Title linking to compound route -> e.g., /international/war */}
                <div className="flex items-start mb-4">
                  <Link href={`/${mainCategorySlug}/${subCat.slug}`} className="inline-block group">
                    <h3 className="text-base font-bold text-gray-800 border-b-2 border-red-700 pb-1 group-hover:text-red-700 transition-colors">
                      {subCat.titleBn || subCat.title}
                    </h3>
                  </Link>
                </div>

                {/* Subcategory Column Content Body */}
                <div className="flex flex-col gap-4">
                  {/* Vertical Featured Layout */}
                  {leadArticle && (
                    <div className="border-b border-gray-100 pb-3">
                      <ArticleCard
                        article={leadArticle}
                        variant="vertical-lead"
                      />
                    </div>
                  )}

                  {/* Secondary Text Only Items */}
                  {listArticles.length > 0 && (
                    <div className="flex flex-col">
                      {listArticles.map((article, idx) => (
                        <div
                          key={article.id || idx}
                          className="border-b border-gray-100 last:border-0 py-2.5 first:pt-0 last:pb-0"
                        >
                          <ArticleCard article={article} variant="text-only" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button locked uniformly to bottom edge */}
              <div className="w-full flex justify-center mt-6 pt-2">
                <Link
                  href={`/${mainCategorySlug}/${subCat.slug}`}
                  className="inline-flex items-center justify-center bg-[#0066da] hover:bg-[#0052b4] text-white text-xs font-medium px-5 py-2 rounded transition-colors shadow-xs min-w-[84px]"
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