import { Category, Article } from "@/lib/types";
import { getArticles } from "@/lib/api";
import { getArticleCategory } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export default async function CategorySection({
  category,
}: {
  category: Category;
}) {
  // Get articles for this category
  const categoryArticlesRes = await getArticles({
    page: 1,
    limit: 4,
    categoryId: category.id,
    includeMultiCategory: true,
  });
  const categoryArticles = categoryArticlesRes?.data || [];

  if (!categoryArticles || categoryArticles.length === 0) {
    return null;
  }

  const isFirstArticle = categoryArticles[0];
  const restArticles = categoryArticles.slice(1);

  return (
    <div className="mb-6 bg-background rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold border-l-4 border-primary pl-3">
          {category.titleBn || category.title}
        </h2>
        <Link
          href={`/${category.slug}`}
          className="text-sm text-primary hover:underline font-medium"
        >
          View All
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* First article - larger */}
        <Link
          href={`/news/${getArticleCategory(isFirstArticle)?.slug || "others"}/${isFirstArticle.code}`}
          className="block group"
        >
          <img
            src={isFirstArticle.coverImage}
            alt={isFirstArticle.title}
            height={400}
            width={600}
            className="w-full aspect-3/2 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
          />
          <h3 className="text-lg font-semibold mt-2 group-hover:text-primary transition-colors"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}>
            {isFirstArticle.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}>
            {isFirstArticle.excerpt}
          </p>
        </Link>

        {/* Rest articles - smaller */}
        <div className="flex flex-col gap-3">
          {restArticles.map((article: Article) => (
            <Link
              key={article.id}
              href={`/news/${getArticleCategory(article)?.slug || "others"}/${article.code}`}
              className="flex gap-3 group"
            >
              <img
                src={article.coverImage}
                alt={article.title}
                height={120}
                width={160}
                className="w-32 aspect-4/3 object-cover rounded-lg shrink-0 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="flex-1">
                <h4 className="text-base font-semibold group-hover:text-primary transition-colors"
                  style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}>
                  {article.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1"
                  style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}>
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
