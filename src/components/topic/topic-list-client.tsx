"use client";

import React from "react";
import PaginatedList from "@/components/shared/paginated-list";
import TopicCard from "@/components/topic/topic-card";
import { getArticles } from "@/lib/api";
import { Article } from "@/lib/types";

interface TopicListClientProps {
  initialData: Article[];
  initialMeta: { total: number; page: number; limit: number };
  topic: string;
}

export default function TopicListClient({
  initialData,
  initialMeta,
  topic,
}: TopicListClientProps) {
  const fetchMore = async (page: number) => {
    return getArticles({ topics: [topic], page, limit: initialMeta?.limit || 10 });
  };

  return (
    <PaginatedList<Article>
      initialData={initialData}
      initialMeta={initialMeta}
      fetchData={fetchMore}
      listClassName="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8"
      noDataMessage="কোনো সংবাদ পাওয়া যায়নি"
      renderItem={(article: Article) => (
        <TopicCard key={article.id} article={article} />
      )}
    />
  );
}
