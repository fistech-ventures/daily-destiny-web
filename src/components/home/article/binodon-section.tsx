import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getAllcategories, getArticles } from "@/lib/api";
import { Category, Article } from "@/lib/types";
import { getArticleCategory } from "@/lib/utils";
import ArticleTitle from "@/components/shared/article-title";

export default async function BinodonSection() {
  // Fetch categories
  const categoriesRes = await getAllcategories();
  const allCategories: Category[] = categoriesRes?.data || [];

  const binodonCat = allCategories.find(
    (cat) => cat.slug === "binodon" || cat.slug === "entertainment",
  );

  if (!binodonCat) return null;

  // Fetch 7 articles (1 hero + 6 side cards) to match Politics layout
  const articlesRes = await getArticles({
    categoryId: binodonCat.id,
    limit: 7,
    status: "Published",
    includeMultiCategory: true,
  });

  const articles: Article[] = articlesRes?.data || [];

  if (articles.length === 0) return null;

  const displayTitle = binodonCat.titleBn || binodonCat.title || "বিনোদন";
  const binodonSlug = binodonCat.slug;

  // Politics-style layout: 1 main article (left 2 cols) + 6 side cards (right 3 cols, 2 rows)
  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 7);

  return (
    <div className="w-full flex flex-col gap-4 select-none font-sans mt-2">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <Link
          href={`/${binodonSlug}`}
          className="flex items-center gap-1.5 group cursor-pointer"
        >
          <h2 className="text-xl font-bold text-gray-900 border-b-2 border-red-600 pb-2 -mb-[10px]">
            {displayTitle}
          </h2>
          <ChevronRight className="h-5 w-5 text-[#000058] mt-0.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* প্যারেন্ট গ্রিড পরিবর্তন:
        - মোবাইলে ২টি কলাম (grid-cols-2)
        - ডেস্কটপে ৫টি কলাম (md:grid-cols-5)
      */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 items-start mt-2">
        {/* বড় কার্ড (Main Hero Card):
          - মোবাইলে col-span-2 (ফুল উইডথ)
          - ডেস্কটপে md:col-span-2 
        */}
        <div className="col-span-2 md:col-span-2 md:row-span-2 flex flex-col h-full border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0 md:pr-6">
          <a
            href={`/news/${getArticleCategory(mainArticle)?.slug || binodonSlug}/${mainArticle.code}`}
            className="group block flex-col h-full justify-between"
          >
            <div>
              <div className="overflow-hidden rounded-lg bg-gray-100 aspect-[16/10]">
                <img
                  src={mainArticle.coverImage}
                  alt={mainArticle.title}
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-200"
                />
              </div>
              <div className="mt-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug group-hover:text-[#1a66ca] transition-colors duration-200">
                  <ArticleTitle article={mainArticle} />
                </h2>
                <p className="mt-3 text-lg md:text-xl text-gray-600 leading-relaxed"
                  style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}>
                  {mainArticle.excerpt}
                </p>
              </div>
            </div>
          </a>
        </div>

        {/* ছোট কার্ডগুলো (Side Articles):
          - মোবাইলে col-span-1 (১ সারিতে ২টি করে)
          - ডেস্কটপে md:col-span-1 
        */}
        {sideArticles.map((article, index) => {
          const isRow1 = index < 3;
          const isNotLastCol = (index + 1) % 3 !== 0;

          return (
            <div
              key={article.id}
              className={`col-span-1 flex flex-col h-full pb-4 md:pb-0 border-gray-100
                ${isRow1 ? "md:border-b md:pb-6" : "md:pt-2"}
                ${isNotLastCol ? "md:border-r md:pr-6" : ""}`}
            >
              <a
                href={`/news/${getArticleCategory(article)?.slug || binodonSlug}/${article.code}`}
                className="group block flex-col justify-between h-full"
              >
                <div>
                  <div className="overflow-hidden rounded-lg bg-gray-100 aspect-[16/10]">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-200"
                    />
                  </div>
                  <h3 className="mt-3 text-lg md:text-xl font-bold text-gray-900 leading-snug group-hover:text-[#1a66ca] transition-colors duration-200"
                    style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}>
                    <ArticleTitle article={article} />
                  </h3>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}