"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Article } from "@/lib/types";
import { getArticleCategory } from "@/lib/utils";
import ArticleTitle from "@/components/shared/article-title";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";

interface GridCardProps {
  article: Article;
}

// Grid Card - Image on top, Title below (design unchanged)
const GridCard: React.FC<GridCardProps> = ({ article }) => (
  <Link
    href={`/news/${getArticleCategory(article)?.slug || "others"}/${article.code}`}
  >
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
      <img
        src={article.coverImage}
        alt={article.title}
        className="w-full aspect-video object-cover hover:opacity-90"
      />
      <div className="p-4">
        <h3
          className="text-sm md:text-base font-bold hover:text-blue-600"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            width: "100%",
          }}
        >
          <ArticleTitle article={article} />
        </h3>
      </div>
    </div>
  </Link>
);

const INITIAL_COUNT = 6;
const BATCH_SIZE = 3;

interface ArticleGridWithMoreProps {
  articles: Article[];
}

export default function ArticleGridWithMore({
  articles,
}: ArticleGridWithMoreProps) {
  const t = useTranslations("article");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const visibleArticles = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleArticles.map((article: Article) => (
          <GridCard key={article.id} article={article} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() =>
              setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, articles.length))
            }
            className="cursor-pointer inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-sm font-bold tracking-wide whitespace-nowrap transition-all duration-300 select-none bg-gray-50 border border-gray-200/80 text-gray-700 hover:bg-gray-100 hover:text-red-600 hover:border-red-200"
          >
            <Plus className="h-4 w-4" />
            <span>{t("more")}</span>
          </button>
        </div>
      )}
    </>
  );
}
