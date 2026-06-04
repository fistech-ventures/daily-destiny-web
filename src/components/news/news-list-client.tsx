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
  noDataMessage = "কোনো সংবাদ পাওয়া যায়নি",
}: NewsListClientProps) {
  const fetchMore = async (page: number) => {
    return getArticles({ ...fetchParams, page, limit: initialMeta?.limit || 10 });
  };

  return (
    <PaginatedList<Article>
      initialData={initialData}
      initialMeta={initialMeta}
      fetchData={fetchMore}
      listClassName="divide-y divide-gray-100"
      noDataMessage={noDataMessage}
      renderItem={(article: Article) => (
        <div key={article.id} className="">
          <HorizontalArticleCard article={article} />
        </div>
      )}
    />
  );
}
