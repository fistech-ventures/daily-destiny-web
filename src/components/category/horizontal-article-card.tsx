import React from "react";
import Link from "next/link";
import { Article } from "@/lib/types";
// import { Timer } from "lucide-react";
// import { formatRelativeTime } from "@/utils/date-formatter";

interface HorizontalArticleCardProps {
  article: Article;
}

export default function HorizontalArticleCard({
  article,
}: HorizontalArticleCardProps) {

  return (
    <Link
      href={`/news/${article.category?.slug || "others"}/${article.code}`}
      className="group block w-full last:border-0 py-3 transition-all hover:bg-gray-50/50 rounded-xl"
    >
      <div className="flex flex-col sm:flex-row gap-2 md:gap-6 items-center">
        {/* img Container */}
        <div className="relative w-full sm:w-60 md:w-70 lg:w-[320px] aspect-video sm:aspect-16/10 shrink-0 overflow-hidden rounded-xl shadow-sm">
          <img
            src={article.coverImage}
            alt={article.title}
            loading="lazy"
            className="object-contain w-full h-full transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 280px, 320px"
          />
        </div>

        <div className="flex flex-col flex-1 gap-2 pt-1">
          {/* <div className="flex items-center gap-1.5 mb-1">
            <Timer className="text-primary h-3.5 w-3.5" />
            <h5 className="text-primary text-sm font-semibold">
              {formatRelativeTime(article.date)}
            </h5>
          </div> */}

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-[1.3] group-hover:text-primary transition-colors line-clamp-2 md:line-clamp-3">
            {article.title}
          </h2>

          <div
            dangerouslySetInnerHTML={{
              __html: article.details || article.excerpt,
            }}
            className="line-clamp-2 sm:line-clamp-3 text-sm md:text-base font-normal text-gray-600 leading-relaxed"
          />
        </div>
      </div>
    </Link>
  );
}
