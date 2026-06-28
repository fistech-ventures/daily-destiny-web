import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getAllcategories, getArticles } from "@/lib/api";
import { Category, Article } from "@/lib/types";

export default async function BinodonSection() {
  // Fetch categories
  const categoriesRes = await getAllcategories();
  const allCategories: Category[] = categoriesRes?.data || [];

  const binodonCat = allCategories.find(
    (cat) => cat.slug === "binodon" || cat.slug === "entertainment",
  );

  if (!binodonCat) return null;

  // Fetch 6 articles
  const articlesRes = await getArticles({
    categoryId: binodonCat.id,
    limit: 6,
    status: "Published",
  });

  const articles: Article[] = articlesRes?.data || [];

  if (articles.length === 0) return null;

  const displayTitle = binodonCat.titleBn || binodonCat.title || "বিনোদন";

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <Link
          href={`/${binodonCat.slug}`}
          className="flex items-center gap-1.5 group cursor-pointer"
        >
          <h2 className="text-xl font-bold text-gray-900 border-b-2 border-red-600 pb-2 -mb-[10px]">
            {displayTitle}
          </h2>
          <ChevronRight className="h-5 w-5 text-red-600 mt-0.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* 3x2 Grid of 6 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        {articles.map((article, idx) => (
          <Link
            key={article.id || article.code || idx}
            href={`/news/${article.category?.slug || article.category?.slugBn || "others"}/${article.code}`}
            className="group flex flex-col bg-white border border-gray-200 rounded-md overflow-hidden shadow-xs hover:shadow-sm hover:border-gray-300 transition-all"
          >
            {/* Image */}
            <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="flex-1 p-3 flex flex-col">
              <h3 className="text-base font-semibold text-gray-800 leading-snug group-hover:text-[#1a66ca] transition-colors line-clamp-2">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {article.excerpt}
                </p>
              )}
              <div className="mt-auto pt-2">
                <span className="inline-flex items-center text-sm cursor-pointer font-medium text-[#000058] hover:text-[#1a66ca] transition-colors">
                  বিস্তারিত →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
