import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Article, Category } from "@/lib/types";
import { getArticleCategory } from "@/lib/utils";
import ArticleTitle from "@/components/shared/article-title";

interface ThreeColumnSectionProps {
  articles: Article[];
  category: Category;
}

/**
 * Renders a 1 (featured) + 3 (middle) + 3 (right) grid layout.
 * Pure presentational — receives articles as props.
 */
export default function ThreeColumnSection({
  articles,
  category,
}: ThreeColumnSectionProps) {
  if (!articles.length) return null;

  const displayTitle = category.titleBn || category.title;
  const slug = category.slug;
  const featuredArticle = articles[0];
  const middleArticles = articles.slice(1, 4);
  const rightArticles = articles.slice(4, 7);

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <Link
          href={`/${slug}`}
          className="flex items-center gap-1.5 group cursor-pointer"
        >
          <h2 className="text-xl font-bold text-gray-900 border-b-2 border-red-600 pb-2 -mb-[10px]">
            {displayTitle}
          </h2>
          <ChevronRight className="h-5 w-5 text-[#000058] mt-0.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* Featured */}
        {featuredArticle && (
          <div className="lg:col-span-1 flex flex-col bg-white border border-gray-200 rounded-md p-4 pb-14 shadow-xs relative">
            <Link
              href={`/news/${getArticleCategory(featuredArticle)?.slug || slug}/${featuredArticle.code}`}
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
                <ArticleTitle article={featuredArticle} />
              </h3>

              {getArticleCategory(featuredArticle)?.titleBn && (
                <span className="inline-block text-xs font-medium text-brand bg-blue-50 px-2 py-0.5 rounded-full self-start">
                  {getArticleCategory(featuredArticle)?.titleBn}
                </span>
              )}

              {featuredArticle.excerpt && (
                <p className="text-sm text-gray-600"
                  style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}>
                  {featuredArticle.excerpt}
                </p>
              )}
            </Link>
          </div>
        )}

        {/* Middle Column (3 items) */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {middleArticles.map((article, idx) => (
            <Link
              key={article.id || article.code || idx}
              href={`/news/${getArticleCategory(article)?.slug || slug}/${article.code}`}
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
                <h4 className="text-base font-bold text-gray-800 leading-snug group-hover:text-[#000058] transition-colors line-clamp-2 sm:line-clamp-3">
                  {article.title}
                </h4>

                {getArticleCategory(article)?.titleBn && (
                  <span className="inline-block mt-1.5 text-xs font-medium text-brand bg-blue-50 px-2 py-0.5 rounded-full">
                    {getArticleCategory(article)?.titleBn}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Right Column (3 items) */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {rightArticles.map((article, idx) => (
            <Link
              key={article.id || article.code || idx}
              href={`/news/${getArticleCategory(article)?.slug || slug}/${article.code}`}
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
                <h4 className="text-base font-bold text-gray-800 leading-snug group-hover:text-[#000058] transition-colors line-clamp-2 sm:line-clamp-3">
                  {article.title}
                </h4>

                {getArticleCategory(article)?.titleBn && (
                  <span className="inline-block mt-1.5 text-xs font-medium text-brand bg-blue-50 px-2 py-0.5 rounded-full">
                    {getArticleCategory(article)?.titleBn}
                  </span>
                )}
              </div>
            </Link>
          ))}

          {/* Advertisement at bottom of right column */}
          {/* <AdBanner className="rounded-lg" altText={`${displayTitle} বিজ্ঞাপন`} /> */}
        </div>
      </div>
    </div>
  );
}
