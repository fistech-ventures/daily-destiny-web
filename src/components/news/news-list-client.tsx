"use client";

import React from "react";
import PaginatedList from "@/components/shared/paginated-list";
import HorizontalArticleCard from "@/components/category/horizontal-article-card";
import { getArticles } from "@/lib/api";
import { Article, ArticleQueryParams } from "@/lib/types";

// 1. Extend the local props interface to expect the domain switch flag
interface NewsListClientProps {
  initialData: Article[];
  initialMeta: { total: number; page: number; limit: number };
  fetchParams?: ArticleQueryParams & { useLocationApi?: boolean }; // 👈 Added custom field support
  noDataMessage?: string;
}

export default function NewsListClient({
  initialData,
  initialMeta,
  fetchParams = {},
  noDataMessage = "কোনো সংবাদ পাওয়া যায়নি",
}: NewsListClientProps) {
  const fetchMore = async (page: number) => {
    return getArticles({
      ...fetchParams,
      page,
      limit: initialMeta?.limit || 20,
    });
  };

  return (
    <PaginatedList<Article>
      initialData={initialData}
      initialMeta={initialMeta}
      fetchData={fetchMore}
      listClassName="grid grid-cols-2 md:grid-cols-3 gap-6"
      wrapperClassName="w-full"
      noDataMessage={noDataMessage}
      renderItem={(article: Article, index: number) => {
        if (index === 0) {
          return (
            <div key={article.id} className="col-span-2 md:col-span-3">
              <HorizontalArticleCard article={article} layoutType="hero" />
            </div>
          );
        }

        return (
          <div key={article.id}>
            <HorizontalArticleCard article={article} layoutType="grid" />
          </div>
        );
      }}
    />
  );
}
