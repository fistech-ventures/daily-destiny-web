import { Article } from "@/lib/types";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
// import { Timer } from "lucide-react";
// import { formatRelativeTime } from "@/utils/date-formatter";

export default function MainArticle({
  mainArticles,
}: {
  mainArticles: Article[];
}) {
  const tCommon = useTranslations("common");

  if (!mainArticles || mainArticles.length === 0) {
    return (
      <div className="flex bg-background justify-center items-center py-20 rounded-md">
        <p className="text-gray-500 font-medium">
          {tCommon("noDataAvailable")}
        </p>
      </div>
    );
  }

  const firstArticle = mainArticles[0];

  return (
    <div className="grid md:grid-cols-7 md:gap-4 gap-2 items-start">
      {/* First Article */}
      <Link
        href={`/news/${firstArticle.category?.slug || "others"}/${firstArticle.code}`}
        className="md:col-span-5 col-span-7 bg-background p-3 rounded-lg space-y-2 md:space-y-3"
      >
        <img
          src={firstArticle.coverImage}
          alt={firstArticle.title}
          height={1000}
          width={1000}
          className="w-full aspect-video object-contain rounded-lg"
        />
        {/* <div className="flex items-center gap-1.5 mb-1">
          <Timer className="text-primary h-3.5 w-3.5" />
          <h5 className="text-primary text-sm font-semibold">
            {formatRelativeTime(firstArticle.date)}
          </h5>
        </div> */}
        <h2 className="lg:text-xl font-semibold">{firstArticle.title}</h2>
        <p className="line-clamp-4 text-base font-normal text-muted-foreground">
          {firstArticle.excerpt}
        </p>
      </Link>

      {/* Rest of the articles */}
      <div className="md:col-span-2 col-span-7">
        <div className="flex flex-col gap-4">
          {mainArticles.slice(1).map((article) => (
            <Link
              href={`/news/${article.category?.slug || "others"}/${article.code}`}
              key={article.id}
              className="p-3 bg-background rounded-md space-y-2 lg:space-y-3"
            >
              <img
                src={article.coverImage}
                alt={article.title}
                height={1000}
                width={1000}
                className="w-full aspect-video rounded-md object-contain"
              />
              {/* <div className="flex items-center gap-1.5 mb-1">
                <Timer className="text-primary h-3.5 w-3.5" />
                <h5 className="text-primary text-sm font-semibold">
                  {formatRelativeTime(article.date)}
                </h5>
              </div> */}
              <h2 className="lg:text-base font-semibold">{article.title}</h2>
              <p className="line-clamp-2 text-base font-normal text-muted-foreground">
                {article.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
