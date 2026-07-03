import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getArticles } from "@/lib/api";
import { Article } from "@/lib/types";
import AdBanner from "@/components/shared/ad-banner";

export default async function LatestNewsSection() {
  // Fetch 7 latest articles (1 featured + 3 middle + 3 right)
  const articlesRes = await getArticles({
    page: 1,
    limit: 7,
    sortBy: "date",
    sortOrder: "DESC",
    status: "Published",
  });

  const articles: Article[] = articlesRes?.data || [];

  if (articles.length === 0) return null;

  const featuredArticle = articles[0];
  const middleArticles = articles.slice(1, 4); // 3 items
  const rightArticles = articles.slice(5,6); // 3 items for right column

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <Link
          href="/recent"
          className="flex items-center gap-1.5 group cursor-pointer"
        >
          <h2 className="text-xl font-bold text-gray-900 border-b-2 border-red-600 pb-2 -mb-[10px]">
            সর্বশেষ সংবাদ
          </h2>
          <ChevronRight className="h-5 w-5 text-red-600 mt-0.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Grid: col 1 = big card, col 2 = 3 cards, col 3 = news + ad */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* First Column: Big featured card */}
        {featuredArticle && (
          <div className="lg:col-span-1 flex flex-col bg-white border border-gray-200 rounded-md p-4 pb-14 shadow-xs relative h-fit">
            <Link
              href={`/news/${featuredArticle.category?.slug || featuredArticle.category?.slugBn || "others"}/${featuredArticle.code}`}
              className="group flex flex-col gap-3"
            >
              <div className="relative w-full aspect-video rounded overflow-hidden bg-gray-100">
                <img
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-[#000058] transition-colors">
                {featuredArticle.title}
              </h3>

              {featuredArticle.category?.titleBn && (
                <span className="inline-block text-xs font-medium text-brand bg-blue-50 px-2 py-0.5 rounded-full self-start">
                  {featuredArticle.category.titleBn}
                </span>
              )}

              {featuredArticle.excerpt && (
                <p className="text-sm text-gray-600"
                  style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}>
                  {featuredArticle.excerpt}
                </p>
              )}
            </Link>

            <div className="absolute bottom-4 right-4">
              <Link
                href={`/news/${featuredArticle.category?.slug || featuredArticle.category?.slugBn || "others"}/${featuredArticle.code}`}
                className="inline-flex items-center justify-center bg-[#000058] hover:bg-[#000058]/80 text-white hover:text-white text-sm font-medium px-4 py-1.5 rounded transition-colors shadow-xs"
              >
                বিস্তারিত
              </Link>
            </div>
          </div>
        )}

        {/* Middle Column: 3 horizontal cards (same design as right column) */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {middleArticles.map((article, idx) => (
            <Link
              key={article.id || article.code || idx}
              href={`/news/${article.category?.slug || article.category?.slugBn || "others"}/${article.code}`}
              className="group flex gap-4 bg-white border border-gray-200 rounded-md p-3 shadow-xs hover:border-gray-300 transition-all items-center"
            >
              <div className="relative w-28 sm:w-36 h-20 sm:h-24 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div>
                  <h4 className="text-base font-bold text-gray-800 leading-snug group-hover:text-[#000058] transition-colors">
                    {article.title}
                  </h4>
                </div>

                {article.category?.titleBn && (
                  <span className="inline-block mt-1.5 text-xs font-medium text-brand bg-blue-50 px-2 py-0.5 rounded-full">
                    {article.category.titleBn}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Right Column: 3 news items + Advertisement */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {rightArticles.map((article, idx) => (
            <Link
              key={article.id || article.code || idx}
              href={`/news/${article.category?.slug || article.category?.slugBn || "others"}/${article.code}`}
              className="group flex gap-4 bg-white border border-gray-200 rounded-md p-3 shadow-xs hover:border-gray-300 transition-all items-center"
            >
              <div className="relative w-28 sm:w-36 h-20 sm:h-24 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div>
                  <h4 className="text-base font-bold text-gray-800 leading-snug group-hover:text-[#000058] transition-colors">
                    {article.title}
                  </h4>
                </div>

                {article.category?.titleBn && (
                  <span className="inline-block mt-1.5 text-xs font-medium text-brand bg-blue-50 px-2 py-0.5 rounded-full">
                    {article.category.titleBn}
                  </span>
                )}
              </div>
            </Link>
          ))}

          {/* Advertisement at bottom of right column */}
          <AdBanner className="rounded-lg" altText="সর্বশেষ সংবাদ বিজ্ঞাপন" />
        </div>
      </div>
    </div>
  );
}
