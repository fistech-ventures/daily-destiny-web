import React from "react";
import { getArticles } from "@/lib/api";
import { getTranslations } from "next-intl/server";
import NewsListClient from "@/components/news/news-list-client";
import LocationFilter from "@/components/category/categoryfilter";
import AdBanner from "@/components/shared/ad-banner";
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
    <div className="container mx-auto px-4 py-6">
      {/* Header section */}
      <div className="my-2">
        <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {t("title")}
          </h1>
        </div>
      </div>

      <div className="mt-6 flex flex-col lg:flex-row gap-6 items-start">
        {/* Left: News List */}
        <div className="flex-1 w-full pr-2 border-r border-gray-100">
          <div className="bg-background px-3 rounded-md overflow-hidden">
            <NewsListClient initialData={articles} initialMeta={meta} />
          </div>
        </div>

        {/* Right Sidebar: Ad & Location Filter */}
        <div className="w-full lg:w-80 shrink-0 sticky top-4 flex flex-col gap-4">
          <AdBanner className="rounded-lg" altText="সাম্প্রতিক পাতা বিজ্ঞাপন" />
          <LocationFilter />
        </div>
      </div>
    </div>
  );
}
