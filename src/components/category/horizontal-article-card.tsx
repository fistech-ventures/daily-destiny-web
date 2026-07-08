import React from "react";
import Link from "next/link";
import { Article } from "@/lib/types";
import { getArticleCategory } from "@/lib/utils";

interface HorizontalArticleCardProps {
  article: Article;
  layoutType?: "featured" | "side" | "grid";
}

export default function HorizontalArticleCard({
  article,
  layoutType = "grid",
}: HorizontalArticleCardProps) {
  if (layoutType === "featured") {
    return (
      <Link
        href={`/news/${getArticleCategory(article)?.slug || "others"}/${article.code}`}
        className="group block relative w-full aspect-[16/10] md:aspect-video overflow-hidden rounded-lg shadow-sm"
      >
        <img
          src={article.coverImage}
          alt={article.title}
          loading="lazy"
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight group-hover:text-gray-200 transition-colors"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}>
            {article.title}
          </h2>
          {/* <p className="text-xs text-gray-300 mt-2 font-light">২১ মিনিট আগে</p> */}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/news/${getArticleCategory(article)?.slug || "others"}/${article.code}`}
      className="group block w-full transition-all pb-3"
    >
      <div className="flex flex-col gap-3">
        {/* Image Frame */}
        <div className="relative w-full aspect-video overflow-hidden rounded-lg shadow-xs bg-gray-100 h-50">
          <img
            src={article.coverImage}
            alt={article.title}
            loading="lazy"
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Text Area */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-base md:text-lg font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}>
            {article.title}
          </h2>

          {layoutType === "side" ? (
            <div
              dangerouslySetInnerHTML={{
                __html: article.details || article.excerpt,
              }}
              className="text-xs md:text-sm font-normal text-gray-600 leading-relaxed"
              style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}
            />
          ) : layoutType === "grid" ? (
            (article.excerpt || article.details) ? (
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed"
                style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}>
                {article.excerpt || article.details?.replace(/<[^>]*>/g, '')}
              </p>
            ) : null
          ) : null}

          <p className="text-[11px] text-gray-400 font-normal mt-1"></p>
        </div>
      </div>
    </Link>
  );
}

