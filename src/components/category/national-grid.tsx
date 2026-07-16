import React from "react";
import { Article, Category } from "@/lib/types";
import { getArticleCategory } from "@/lib/utils";
import Link from "next/link";

interface NationalGridProps {
  articles: Article[];
  category: Category;
}

export default function NationalGrid({ articles, category }: NationalGridProps) {
  if (!articles.length) return null;

  const displayTitle = category.titleBn || category.title;
  const categorySlug = category.slug;

  return (
    <div className="bg-white rounded-xl p-5 lg:p-6 shadow-sm border border-gray-100 h-full">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-red-500 rounded-full"></div>
          <Link href={`/${categorySlug}`}>
            <h3 className="text-lg font-bold text-gray-900 cursor-pointer hover:text-[#1a66ca] transition-colors">
              {displayTitle}
            </h3>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {/* Top row: 2 cards side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {articles.slice(0, 2).map((article, idx) => (
            <a
              key={article.id || article.code || idx}
              href={`/news/${getArticleCategory(article)?.slug || categorySlug}/${article.code}`}
              className="group flex flex-col rounded-xl overflow-hidden border border-gray-100 hover:border-gray-300 bg-white shadow-sm hover:shadow-lg transition-all duration-200"
            >
              {article.coverImage && (
                <div className="relative w-full h-48 sm:h-52 lg:h-60 overflow-hidden bg-gray-100">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  {getArticleCategory(article)?.titleBn && (
                    <span className="absolute top-3 left-3 text-xs font-semibold text-white bg-red-600 px-2.5 py-1 rounded-full shadow-sm">
                      {getArticleCategory(article)?.titleBn}
                    </span>
                  )}
                </div>
              )}
              <div className="p-4 flex flex-col">
                <h4
                  className="text-lg font-bold text-gray-900 leading-snug group-hover:text-[#1a66ca] transition-colors"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    width: "100%",
                  }}
                >
                  {article.title}
                </h4>
                {article.excerpt && (
                  <p
                    className="text-sm text-gray-500 mt-2"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      width: "100%",
                    }}
                  >
                    {article.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2 pt-2">
                  {article.date && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(article.date).toLocaleDateString("bn-BD", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom row: 3 small cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {articles.slice(2, 5).map((article, idx) => (
            <a
              key={article.id || article.code || idx}
              href={`/news/${getArticleCategory(article)?.slug || categorySlug}/${article.code}`}
              className={`group flex flex-col bg-white border border-gray-100 rounded-lg overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all ${idx === 2 ? "col-span-2 sm:col-span-1" : ""}`}
            >
              {article.coverImage && (
                <div className="relative w-full h-32 sm:h-36 overflow-hidden bg-gray-100">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-3">
                <h4
                  className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-[#1a66ca] transition-colors"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    width: "100%",
                  }}
                >
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 mt-2">
                  {getArticleCategory(article)?.titleBn && (
                    <span className="text-[10px] font-medium text-brand bg-blue-50 px-1.5 py-0.5 rounded-full">
                      {getArticleCategory(article)?.titleBn}
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
