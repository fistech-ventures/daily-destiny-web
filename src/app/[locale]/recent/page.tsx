import React from "react";
import { getArticles } from "@/lib/api";
import { getTranslations } from "next-intl/server";
import NewsListClient from "@/components/news/news-list-client";
import { generateHomeMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return generateHomeMetadata({
    path: "/recent",
    locale,
  });
}

export default async function RecentPage() {
  const t = await getTranslations("recent");

  // Fetch initial page
  const response = await getArticles({ page: 1, limit: 10 });
  const articles = response?.data || [];
  const meta = response?.meta;

  return (
    <div className="">
      <div className="my-2">
        <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {t("title")}
          </h1>
        </div>
      </div>

      <div className="bg-background px-3 rounded-md overflow-hidden">
        <NewsListClient initialData={articles} initialMeta={meta} />
      </div>
    </div>
  );
}

