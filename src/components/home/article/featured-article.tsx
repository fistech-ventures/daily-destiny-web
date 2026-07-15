import { Article } from "@/lib/types";
import { getArticleCategory } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import ArticleTitle from "@/components/shared/article-title";

export default function FeaturedArticle({
  article,
}: {
  article: Article;
}) {
  if (!article) {
    return null;
  }

  return (
    <div className="mb-6">
      <Link
        href={`/news/${getArticleCategory(article)?.slug || "others"}/${article.code}`}
        className="block group"
      >
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={article.coverImage}
            alt={article.title}
            height={800}
            width={1200}
            className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="inline-block px-3 py-1 bg-primary text-white text-sm font-semibold rounded mb-3">
              {getArticleCategory(article)?.titleBn || getArticleCategory(article)?.title}
            </span>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 group-hover:text-primary-foreground transition-colors"
              style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}>
              <ArticleTitle article={article} />
            </h1>
            <p className="text-white/90 text-base"
              style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}>
              {article.excerpt}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
