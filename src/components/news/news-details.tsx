import { Article } from "@/lib/types";

import React from "react";
import SocialShare from "../shared/social-share";
import { useLocale, useTranslations } from "next-intl";
import { formatBdTime } from "@/utils/date-formatter";
import Link from "next/link";

export default function NewsDetails({ article }: { article: Article }) {
  const currentLocale = useLocale();

  const tFooter = useTranslations("footer");

  return (
    <div className="w-full">
      <div className="hidden print:flex print-header justify-center border-b border-gray-200 pb-2 mb-0">
        <img
          width={200}
          height={200}
          src="/images/logo.png"
          alt="Daily Destiny"
          className="w-24 h-16 object-contain"
        />
      </div>

      <div id="article-content" className="px-2 lg:px-4 print:px-0 py-8 bg-background rounded-md">
        <h1 className="text-lg md:text-2xl font-bold text-gray-900 leading-tight mb-2 lg:mb-6">
          {article.title}
        </h1>

        <div className="flex print:flex-row print:justify-between flex-col gap-2 border-b border-gray-200 pb-4 mb-6">
          <div className="flex items-center gap-2 text-gray-600 text-sm md:text-base">
            <span className="font-semibold text-primary">
              {currentLocale === "bn"
                ? article.author.nameBn
                : article.author.name}
            </span>
            <span>|</span>
            <span>
              {currentLocale === "bn"
                ? article.category.titleBn
                : article.category.title}
            </span>
          </div>
          <div className="text-gray-500 text-sm">
            {formatBdTime(article.date)}
          </div>
        </div>

        <div className="relative w-full aspect-video object-contain rounded-lg overflow-hidden mb-4 print:max-h-87.5">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-sm text-gray-500 mb-2 lg:mb-6">{article.coverImageCredit}</p>

        <hr className="print:block hidden print:mb-4" />

        <div className="print:hidden">
          <SocialShare title={article.title} />
        </div>

        <article
          className="prose article-body text-lg prose-lg max-w-none text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.details }}
        />

        <div className="no-print flex flex-wrap items-center gap-2 pt-3 lg:pt-6">
          {article.tags.map((tag, index) => (
            <Link
              href={`/topic/${tag}`}
              key={`${tag}-${index}`}
              className="text-sm font-semibold text-primary-foreground shrink-0 bg-primary px-3 py-1 rounded-md inline-block"
            >
              {tag}
            </Link>
          ))}
        </div>

        <div className="hidden print:flex justify-center py-2 border-y mt-10">
          <img src="/images/logo.png" alt="Daily Destiny" className="w-24 h-16 object-contain" />
        </div>
        <div className="hidden print:flex justify-between items-center py-2">
          <p className="text-sm text-gray-500">{currentLocale === "bn" ? article.author.nameBn : article.author.name}</p>
          <p className="text-sm text-gray-500">{tFooter("copyright", { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </div>
  );
}
