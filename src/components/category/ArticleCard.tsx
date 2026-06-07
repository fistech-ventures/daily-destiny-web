import React from "react";
import Link from "next/link";
import { Article } from "@/lib/types";

interface ArticleCardProps {
  article: Article;
  variant?:
    | "horizontal"
    | "vertical-lead"
    | "text-only"
    | "center-featured"
    | "compact-row";
}

export default function ArticleCard({
  article,
  variant = "horizontal",
}: ArticleCardProps) {
  const isCenterFeatured = variant === "center-featured";
  const isCompactRow = variant === "compact-row";
  const isVerticalLead = variant === "vertical-lead";
  const isTextOnly = variant === "text-only";

  return (
    <Link
      href={`/news/${article.category?.slug || "others"}/${article.code}`}
      className="group block w-full transition-all rounded-xl"
    >
      <div
        className={`flex ${
          isCenterFeatured
            ? "flex-col gap-4"
            : isVerticalLead
              ? "flex-col gap-3"
              : isTextOnly
                ? "flex-col"
                : isCompactRow
                  ? "flex-row-reverse sm:flex-row gap-3 items-start py-2.5 border-b border-gray-100 last:border-0"
                  : "flex-col sm:flex-row gap-4 md:gap-6 items-center py-3 hover:bg-gray-50/50"
        }`}
      >
        {/* Render Cover Image if NOT text-only */}
        {!isTextOnly && (
          <div
            className={`relative shrink-0 overflow-hidden rounded-md shadow-sm bg-gray-50 aspect-video ${
              isCenterFeatured
                ? "w-full"
                : isVerticalLead
                  ? "w-full"
                  : isCompactRow
                    ? "w-24 h-16 sm:w-28 sm:h-20"
                    : "w-full sm:w-60 md:w-70 lg:w-[320px] sm:aspect-16/10"
            }`}
          >
            <img
              src={article.coverImage}
              alt={article.title}
              loading="lazy"
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}

        {/* Content Box */}
        <div className="flex flex-col flex-1 min-w-0">
          <h2
            className={`font-bold text-gray-900 leading-normal group-hover:text-red-600 transition-colors ${
              isCenterFeatured
                ? "text-xl md:text-2xl font-black line-clamp-3"
                : isCompactRow
                  ? "text-sm sm:text-base font-bold line-clamp-2 md:line-clamp-3 text-gray-900"
                  : isVerticalLead
                    ? "text-base md:text-lg line-clamp-2"
                    : isTextOnly
                      ? "text-sm md:text-base font-normal py-1.5 line-clamp-2"
                      : "text-lg md:text-xl lg:text-2xl line-clamp-2 md:line-clamp-3"
            }`}
          >
            {article.title}
          </h2>

          {/* Render description details snippet ONLY for large center featured slots */}
          {isCenterFeatured && (
            <div
              dangerouslySetInnerHTML={{
                __html: article.details || article.excerpt || "",
              }}
              className="line-clamp-3 text-sm md:text-base font-normal text-gray-600 leading-relaxed mt-1"
            />
          )}

          {/* Relative layout footer timing text for side cards */}
          {isCompactRow && (
            <span className="text-xs text-gray-400 mt-1 block">
              ২ ঘণ্টা আগে
            </span>
          )}
          {isCenterFeatured && (
            <span className="text-xs text-gray-400 mt-2 block">
              ১ ঘণ্টা আগে
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
