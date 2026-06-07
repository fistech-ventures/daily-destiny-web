"use client";

import React from "react";
import PaginatedList from "@/components/shared/paginated-list";
import HorizontalArticleCard from "@/components/category/horizontal-article-card";
import { getArticles } from "@/lib/api";
import { Article, ArticleQueryParams } from "@/lib/types";

interface NewsListClientProps {
  initialData: Article[];
  initialMeta: { total: number; page: number; limit: number };
  fetchParams?: ArticleQueryParams;
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
      limit: initialMeta?.limit || 10,
    });
  };

  return (
    <PaginatedList<Article>
      initialData={initialData}
      initialMeta={initialMeta}
      fetchData={fetchMore}
      listClassName="grid grid-cols-1 md:grid-cols-3 gap-6"
      wrapperClassName="w-full"
      noDataMessage={noDataMessage}
      renderItem={(article: Article, index: number) => {

        let layoutType: "featured" | "side" | "grid" = "grid";
        if (index === 0) layoutType = "featured";
        if (index === 1) layoutType = "side";

        return (
          <div
            key={article.id}
            className={`${index === 0 ? "md:col-span-2" : "md:col-span-1"}`}
          >
            <HorizontalArticleCard article={article} layoutType={layoutType} />
          </div>
        );
      }}
    />
  );
}
