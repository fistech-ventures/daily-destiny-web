import { ArrowRight } from "lucide-react";

import Link from "next/link";
import { Article, Category } from "@/lib/types";
import { getArticles } from "@/lib/api";
import { getTranslations } from "next-intl/server";
// import { formatRelativeTime } from "@/utils/date-formatter";

export default async function CategorySection({
  category,
  moreText,
}: {
  category: Category;
  moreText: string;
}) {
  const tCommon = await getTranslations("common");
  // Fetching first 4 articles for this category
  const response = await getArticles({
    categoryId: category.id,
    limit: 4,
    status: "Published",
  });

  const articles: Article[] = response?.data || [];
  const featuredArticle = articles[0];
  const listArticles = articles.slice(1) || [];

  return (
    <div className="flex flex-col bg-background p-3 rounded-md">
      {/* Header */}
      <div className="flex justify-between items-baseline border-b border-gray-300 pb-2 mb-4">
        <div className="flex items-center gap-3 border-l-4 border-primary pl-3">
          <h2 className="text-xl font-bold text-gray-900">
            {category.titleBn || category.title}
          </h2>
        </div>
        <Link
          href={`/${category.slug}`}
          className="flex items-center gap-1 text-orange-800 hover:text-primary transition-colors"
        >
          <span className="text-sm font-bold">{moreText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Article List Area */}
      {articles.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 text-sm font-medium">
            {tCommon("noDataAvailable")}
          </p>
        </div>
      ) : (
        <>
          {/* Featured Article */}
          {featuredArticle && (
            <Link
              href={`/news/${featuredArticle.category?.slug || "others"}/${featuredArticle.code}`}
            >
              <div className="group cursor-pointer">
                <div className="relative aspect-16/10 w-full overflow-hidden rounded-md mb-3">
                  <img
                    src={featuredArticle.coverImage}
                    alt={featuredArticle.title}
                    className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {/* <div className="flex items-center gap-1 pb-2">
                  <Timer className="text-primary h-3 w-3" />
                  <div className="text-primary">
                    <h5 className="text-primary text-xs">
                      {formatRelativeTime(featuredArticle.date)}
                    </h5>
                  </div>
                </div> */}
                <h3 className="text-base font-medium leading-snug text-gray-900 group-hover:underline transition-colors line-clamp-2">
                  {featuredArticle.title}
                </h3>
              </div>
            </Link>
          )}

          {/* List Articles */}
          <div className="mt-4">
            {listArticles.map((article) => (
              <div
                key={article.id}
                className="border-t border-gray-200 py-3 group"
              >
                {/* <div className="flex items-center gap-1">
                  <Timer className="text-primary h-3 w-3" />
                  <div className="text-primary">
                    <h5 className="text-primary text-xs">
                      {formatRelativeTime(article.date)}
                    </h5>
                  </div>
                </div> */}
                <Link
                  href={`/news/${article.category?.slug || "uncategorized"}/${article.code}`}
                >
                  <h4 className="text-base font-medium leading-relaxed text-gray-800 group-hover:underline transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
