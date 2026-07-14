import { Article } from "@/lib/types";
import { getArticleCategory } from "@/lib/utils";
import React from "react";
import Link from "next/link";
// import { Timer } from "lucide-react";
// import { formatRelativeTime } from "@/utils/date-formatter";

export default function RelatedNewsCard({ article }: { article: Article }) {
  return (
    <div>
      <Link
        href={`/news/${getArticleCategory(article)?.slug || "uncategorized"}/${article.code}`}
      >
        <div
          key={article.id}
          className="border-t border-gray-200 py-3 group grid grid-cols-5 gap-2 items-center"
        >
          <div className="col-span-2 w-full aspect-video">
            <img
              src={article.coverImage}
              alt={article.title}
              width={400}
              height={400}
              className="w-full h-full object-contain rounded-md"
            />
          </div>
          <div className="col-span-3">
            {/* <div className="flex items-center gap-1">
            <Timer className="text-primary h-3 w-3" />
            <h5 className="text-primary text-xs">
              {formatRelativeTime(article.date)}
            </h5>
          </div> */}

            <h4
              className="text-base font-medium leading-relaxed text-gray-800 group-hover:underline transition-colors"
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
          </div>
        </div>
      </Link>
    </div>
  );
}
