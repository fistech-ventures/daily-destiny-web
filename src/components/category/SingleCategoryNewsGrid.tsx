import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getAllcategories, getArticles } from "@/lib/api";
import { Category, Article } from "@/lib/types";
import { getArticleCategory } from "@/lib/utils";
import ArticleTitle from "../shared/article-title";

interface Props {
  slug: string;
  fallbackTitle?: string;
  limit?: number;
}

export default async function SingleCategoryNewsGrid({
  slug,
  fallbackTitle,
  limit = 7,
}: Props) {
  // Fetch categories with a sufficient limit so lower-positioned categories are included
  const categoriesRes = await getAllcategories({ sortBy: "position", limit: 50 });
  const allCategories: Category[] = categoriesRes?.data || [];

  const currentCat = allCategories.find(category => category.slug === slug);

  if (!currentCat) return null;

  // Fetch articles
  const articlesRes = await getArticles({
    categoryId: currentCat.id,
    limit,
    status: "Published",
    includeMultiCategory: true,
  });

  const articles: Article[] = articlesRes?.data || [];

  if (articles.length === 0) return null;

  const displayTitle = currentCat.titleBn || currentCat.title || fallbackTitle;

  // ✅ 1 + 3 + 3 layout
  const featuredArticle = articles[0];
  const middleArticles = articles.slice(1, 4); // 3 items
  const rightArticles = articles.slice(4, 7); // 3 items

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <Link
          href={`/${currentCat.slug}`}
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
              href={`/news/${getArticleCategory(featuredArticle)?.slug || getArticleCategory(featuredArticle)?.slugBn}/${featuredArticle.code}`}
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

              <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-snug group-hover:text-[#000058] transition-colors">
                <ArticleTitle article={featuredArticle} />
              </h3>

              {featuredArticle.excerpt && (
                <p className="text-lg md:text-xl text-gray-600"
                  style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}>
                  {featuredArticle.excerpt}
                </p>
              )}
            </Link>

            {/* <div className="absolute bottom-4 right-4">
              <Link
                href={`/news/${getArticleCategory(featuredArticle)?.slug || getArticleCategory(featuredArticle)?.slugBn}/${featuredArticle.code}`}
                className="inline-flex items-center justify-center bg-[#000058] hover:bg-[#000058]/80 text-white hover:text-white text-sm font-medium px-4 py-1.5 rounded transition-colors shadow-xs"
              >
                বিস্তারিত
              </Link>
            </div> */}
          </div>
        )}

        {/* Middle Column (3 items) */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {middleArticles.map((article, idx) => (
            <Link
              key={article.id || article.code || idx}
              href={`/news/${getArticleCategory(article)?.slug || getArticleCategory(article)?.slugBn}/${article.code}`}
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
                <h4 className="text-lg md:text-xl font-bold text-gray-800 leading-snug group-hover:text-[#000058] transition-colors line-clamp-2 sm:line-clamp-3">
                  {article.title}
                </h4>

                {article.excerpt && (
                  <p
                    className="hidden sm:block text-lg md:text-xl text-gray-500 mt-1"
                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}
                  >
                    {article.excerpt}
                  </p>
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
              href={`/news/${getArticleCategory(article)?.slug || getArticleCategory(article)?.slugBn}/${article.code}`}
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
                <h4 className="text-lg md:text-xl font-bold text-gray-800 leading-snug group-hover:text-[#000058] transition-colors line-clamp-2 sm:line-clamp-3">
                  {article.title}
                </h4>

                {article.excerpt && (
                  <p className="hidden sm:block text-lg md:text-xl text-gray-500 mt-1"
                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}>
                    {article.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
