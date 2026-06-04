import { Article } from "@/lib/types";

import React from "react";
import Link from "next/link";
// import { useLocale } from "next-intl";
// import { Timer } from "lucide-react";
// import { formatRelativeTime } from "@/utils/date-formatter";

export default function SecondArticleCard({ article }: { article: Article }) {
  return (
    <div className="group">
      <div className="grid md:grid-cols-5 items-center gap-2 md:gap-3">
        <Link
          href={`/news/${article.category.slug}/${article.code}`}
          className="md:col-span-2"
        >
          <img
            src={article.coverImage}
            alt={article.title}
            height={400}
            width={200}
            className="w-full aspect-4/3 object-cover rounded-md"
          />
        </Link>
        <div className="md:col-span-3">
          <div className="flex lg:flex-col gap-2 lg:gap-0">
            {/* <div className="flex items-center gap-1">
              <Timer className="text-primary h-3 w-3" />
              <div className="text-primary">
                <h5 className="text-primary lg:text-sm text-xs">
                  {formatRelativeTime(article.date)}
                </h5>
              </div>
            </div> */}
            {/* <Link href={article.category.slug}>
              <h5 className="text-xs lg:text-sm relative before:absolute before:top-1/2 before:-left-3 before:-translate-y-1/2 before:rounded-full before:h-2 before:w-2 before:bg-primary ml-3.5 hover:underline">
                {currentLocale === "bn"
                  ? article.category.titleBn
                  : article.category.title}
              </h5>
            </Link> */}
          </div>
          <Link href={`/news/${article.category.slug}/${article.code}`}>
            <h3 className="lg:text-base text-xs font-semibold hover:underline line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm line-clamp-2 font-normal text-muted-foreground">
              {article.excerpt}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
