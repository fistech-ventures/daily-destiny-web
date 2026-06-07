import React, { Suspense } from "react";
import { getArticles } from "@/lib/api";
import { Article } from "@/lib/types";
import HorizontalArticleCard from "@/components/category/horizontal-article-card";
import { getTranslations } from "next-intl/server";
import { Search } from "lucide-react";
import SearchInput from "@/components/search/search-input";
import { Metadata } from "next";
import { generateFallbackMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { q } = await searchParams;

  if (q?.trim()) {
    return {
      ...generateFallbackMetadata({ path: "/search", locale }),
      title: `${q} - Search | Daily Destiny`,
      description: `Search results for "${q}" on Daily Destiny`,
      robots: { index: false, follow: false },
    };
  }

  return generateFallbackMetadata({
    path: "/search",
    locale,
    noIndex: true,
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const t = await getTranslations("search");

  const articles = q?.trim() ? (await getArticles({ searchTerm: q })).data : [];

  return (
    <div className="">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Search Input Area */}
        <div className="mb-4">
          <Suspense fallback={null}>
            <SearchInput placeholder={t("placeholder")} />
          </Suspense>
        </div>

        {q?.trim() && (
          <>
            {/* Results Info */}
            <div className="mb-4 space-y-2">
              <p className="text-gray-500 text-sm md:text-base font-medium tracking-wide">
                {t("resultsFound", { count: articles.length })}
              </p>
              <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">
                {t("showingResults", { query: q })}
              </h1>
            </div>

            {/* Results List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100 px-4 md:px-8">
                {articles.length > 0 ? (
                  articles.map((article: Article) => (
                    <div key={article.id} className="py-2">
                      <HorizontalArticleCard article={article} />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-24">
                    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {t("noResults")}
                    </h3>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
