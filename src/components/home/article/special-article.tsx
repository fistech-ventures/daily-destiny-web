import { Article } from "@/lib/types";
// import { formatRelativeTime } from "@/utils/date-formatter";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import Link from "next/link";
import React from "react";

export default async function SpecialArticle({
  specialArticles,
}: {
  specialArticles: Article[];
}) {
  const tArticle = await getTranslations("article");
  const tCommon = await getTranslations("common");

  if (!specialArticles || specialArticles.length === 0) {
    return (
      <section className="relative p-3 rounded-md h-full bg-[url('/images/bg-pattern.svg')] bg-cover bg-center bg-no-repeat z-10">
        <div className="absolute inset-0 w-full h-full opacity-40 bg-primary rounded-md -z-10"></div>
        <div className="flex justify-between items-center py-3">
          <h2 className="text-xl font-bold border-l-4 border-primary pl-3">
            {tArticle("specialArticle")}
          </h2>
          <Link
            href="/news?category=special"
            className="flex items-center gap-1 cursor-pointer hover:underline"
          >
            <span className="text-sm font-medium">{tArticle("more")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex justify-center items-center py-20">
          <p className="text-primary-foreground font-medium">
            {tCommon("noDataAvailable")}
          </p>
        </div>
      </section>
    );
  }

  const firstSpecialArticle = specialArticles[0];
  const restFourSpecialArticles = specialArticles.slice(1, 6);

  return (
    <section className="relative p-3 rounded-md h-full bg-[url('/images/bg-pattern.svg')] bg-cover bg-center bg-no-repeat z-10">
      <div className="absolute inset-0 w-full h-full opacity-40 bg-primary rounded-md -z-10"></div>
      <div className="flex justify-between items-center py-3">
        <h2 className="text-xl font-bold  border-l-4 border-primary pl-3">
          {tArticle("specialArticle")}
        </h2>
        {/* <Link
          href="/news?category=special"
          className="flex items-center gap-1  cursor-pointer hover:underline"
        >
          <span className="text-sm font-medium">{tArticle("more")}</span>
          <ArrowRight className="w-4 h-4" />
        </Link> */}
      </div>

      <div className="grid lg:grid-cols-2 gap-3 items-stretch">
        {/* Fisrt Special Article */}
        <Link
          href={`/news/${firstSpecialArticle.category.slug}/${firstSpecialArticle.code}`}
          className="bg-primary/80 rounded-md"
        >
          <img
            src={firstSpecialArticle.coverImage}
            alt={firstSpecialArticle.title}
            height={1000}
            width={1000}
            className="w-full aspect-5/3 object-contain rounded-t-md"
          />
          <div className="p-3 rounded-b-md">
            {/* <div className="flex items-center gap-1">
              <Timer className="text-primary-foreground h-3 w-3" />
              <h5 className="text-primary-foreground text-xs">
                {formatRelativeTime(firstSpecialArticle.date)}
              </h5>
            </div> */}
            <h3 className="text-lg text-primary-foreground font-semibold  ">
              {firstSpecialArticle.title}
            </h3>
            <p className="text-sm line-clamp-2 font-normal text-white">
              {firstSpecialArticle.excerpt}
            </p>
          </div>
        </Link>

        {/* Rest Special Articles */}
        <div className="flex flex-col gap-4 md:gap-2">
          {restFourSpecialArticles.map((article: Article) => (
            <Link
              key={article.id}
              href={`/news/${article.category.slug}/${article.code}`}
              className="group grid-cols-12 grid items-center gap-2"
            >
              <div className="col-span-12 md:col-span-3 relative">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  height={1000}
                  width={1000}
                  className="w-full aspect-video object-contain rounded-md"
                />
              </div>
              <div className="col-span-12 md:col-span-9 md:p-3 rounded-md">
                {/* <div className="flex items-center gap-1">
                  <Timer className="h-3 w-3" />
                  <h5 className="text-xs">
                    {formatRelativeTime(article.date)}
                  </h5>
                </div> */}
                <h3 className="text-base font-semibold group-hover:underline">
                  {article.title}
                </h3>
                <p className="text-sm line-clamp-2 font-normal text-foreground">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
