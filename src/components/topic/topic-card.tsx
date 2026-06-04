import { Article } from "@/lib/types";
// import { formatRelativeTime } from "@/utils/date-formatter";
// import { Timer } from "lucide-react";

import Link from "next/link";
import React from "react";

interface NewsCardProps {
  article: Article;
}

export default async function TopicCard({ article }: NewsCardProps) {
  return (
    <Link
      href={`/news/${article.category?.slug || "uncategorized"}/${article.code}`}
      className="group cursor-pointer"
    >
      <div className="relative aspect-video overflow-hidden rounded-2xl mb-3">
        <img
          src={article.coverImage}
          alt={article.title}
          className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="space-y-1 px-1">
        {/* <div className="flex items-center gap-1.5 mb-1">
          <Timer className="text-primary h-3.5 w-3.5" />
          <h5 className="text-primary text-sm font-semibold">
            {formatRelativeTime(article.date)}
          </h5>
        </div> */}

        <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-snug">
          {article.title}
        </h3>

        <div
          dangerouslySetInnerHTML={{ __html: article.details }}
          className="line-clamp-2 text-sm font-normal text-muted-foreground"
        />
      </div>
    </Link>
  );
}
