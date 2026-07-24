import React from "react";
import Link from "next/link";
import { Monitor, TrendingUp } from "lucide-react";
import { getArticles } from "@/lib/api";
import { Article } from "@/lib/types";
import { getArticleCategory } from "@/lib/utils";
import AdBanner from "@/components/shared/ad-banner";
import ArticleTitle from "@/components/shared/article-title";

interface FeaturedSectionProps {
  article: Article;
}

interface GridCardProps {
  article: Article;
}

// Featured Section - 1 Big Image + Title & Description
const FeaturedSection: React.FC<FeaturedSectionProps> = ({ article }) => (
  <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
      {/* Left: 1 Big Image (col-span-2) */}
      <div className="col-span-2 p-3 bg-gray-50 flex justify-center">
        <Link
          href={`/news/${getArticleCategory(article)?.slug || "others"}/${article.code}`}
        >
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover rounded cursor-pointer hover:opacity-80"
          />
        </Link>
      </div>

      {/* Right: Title & Description (col-span-1) */}
      <div className="col-span-1 p-6 flex flex-col border-l border-gray-200">
        <Link
          href={`/news/${getArticleCategory(article)?.slug || "others"}/${article.code}`}
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-4 hover:text-blue-600">
            <ArticleTitle article={article} />
          </h1>
        </Link>
        <p
          className="text-sm md:text-base text-gray-600"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            width: "100%",
          }}
        >
          {article.excerpt}
        </p>
      </div>
    </div>
  </div>
);

// Grid Card - Image on top, Title below
const GridCard: React.FC<GridCardProps> = ({ article }) => (
  <Link
    href={`/news/${getArticleCategory(article)?.slug || "others"}/${article.code}`}
  >
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
      <img
        src={article.coverImage}
        alt={article.title}
        className="w-full aspect-video object-cover hover:opacity-90"
      />
      <div className="p-4">
        <h3
          className="text-sm md:text-base font-bold hover:text-blue-600"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            width: "100%",
          }}
        >
          <ArticleTitle article={article} />
        </h3>
      </div>
    </div>
  </Link>
);

// News list item for latest/popular sidebar
const NewsListItem: React.FC<{ article: Article }> = ({ article }) => (
  <Link
    href={`/news/${getArticleCategory(article)?.slug || "others"}/${article.code}`}
    className="group flex gap-3 bg-white border border-gray-100 rounded-lg overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all"
  >
    <div className="shrink-0 w-20 h-16 sm:w-24 sm:h-18">
      <img
        src={article.coverImage}
        alt={article.title}
        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
      />
    </div>
    <div className="flex-1 min-w-0 py-1.5 pr-2">
      <h4
        className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-[#1a66ca] transition-colors"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <ArticleTitle article={article} />
      </h4>
    </div>
  </Link>
);

export default async function ArticleSection(): Promise<React.ReactNode> {
  try {
    const exclusiveArticles = await getArticles({
      page: 1,
      limit: 7,
      sortBy: "position",
      sortOrder: "ASC",
      isExclusive: true,
    });

    // Fetch recent articles for sidebar
    const recentSidebarRes = await getArticles({
      page: 1,
      limit: 4,
      status: "Published",
      sortBy: "date",
      sortOrder: "DESC",
    });
    const recentSidebarArticles: Article[] = recentSidebarRes?.data || [];

    // Fetch popular 4 articles for sidebar
    const popularSidebarRes = await getArticles({
      page: 1,
      limit: 4,
      isPopular: true,
      status: "Published",
    });
    const popularSidebarArticles: Article[] = popularSidebarRes?.data || [];

    const exclusiveTop = exclusiveArticles.data[0];
    const gridArticles = exclusiveArticles.data.slice(1, 7);

    return (
      <section className="p-0!">
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="w-full lg:w-3/4 flex flex-col gap-5">
            {exclusiveTop ? (
              <FeaturedSection article={exclusiveTop} />
            ) : (
              <div className="bg-gray-100 h-48 rounded flex items-center justify-center text-gray-500">
                No exclusive articles
              </div>
            )}

            {gridArticles.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {gridArticles.map((article: Article) => (
                  <GridCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No articles available
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR - 1/4 width */}
          <div className="w-full lg:w-1/4 flex flex-col gap-5">
            {/* Advertisement Banner */}
            <AdBanner pageType="homePage" position="Lead-Right" keepSpace />

            {/* Recent / সর্বশেষ - 4 items */}
            <div>
              <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 border-b-2 border-blue-600 pb-2 mb-3">
                <Monitor className="h-4 w-4 text-blue-600" />
                <span>সর্বশেষ</span>
              </h3>
              <div className="flex flex-col gap-2.5">
                {recentSidebarArticles.length > 0 ? (
                  recentSidebarArticles
                    .slice(0, 4)
                    .map(article => (
                      <NewsListItem key={article.id} article={article} />
                    ))
                ) : (
                  <p className="text-gray-400 text-sm text-center py-4">
                    কোনো সংবাদ পাওয়া যায়নি
                  </p>
                )}
              </div>
            </div>

            {/* Popular News - 4 items */}
            <div>
              <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 border-b-2 border-blue-500 pb-2 mb-3">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span>জনপ্রিয় সংবাদ</span>
              </h3>
              <div className="flex flex-col gap-2.5">
                {popularSidebarArticles.length > 0 ? (
                  popularSidebarArticles
                    .slice(0, 4)
                    .map(article => (
                      <NewsListItem key={article.id} article={article} />
                    ))
                ) : (
                  <p className="text-gray-400 text-sm text-center py-4">
                    কোনো সংবাদ পাওয়া যায়নি
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    return (
      <section className="p-0!">
        <div className="text-center py-10">
          <p className="text-red-500">Error loading articles</p>
          <p className="text-gray-500 text-sm">{String(error)}</p>
        </div>
      </section>
    );
  }
}
