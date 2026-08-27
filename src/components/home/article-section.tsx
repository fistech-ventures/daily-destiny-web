import React from "react";
import Link from "next/link";
import { Clock, BarChart3, ChevronRight } from "lucide-react";
import { getArticles } from "@/lib/api";
import { Article } from "@/lib/types";
import { getArticleCategory } from "@/lib/utils";
import AdBanner from "@/components/shared/ad-banner";
import ArticleTitle from "@/components/shared/article-title";
import ArticleGridWithMore from "./article/article-grid-with-more";

interface FeaturedSectionProps {
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
          <h1 className="text-2xl md:text-3xl font-bold mb-4 hover:text-[#1a66ca]">
            <ArticleTitle article={article} />
          </h1>
        </Link>
        <p
          className="text-lg md:text-xl text-gray-600"
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
        className="text-lg md:text-xl font-bold text-gray-800 leading-snug group-hover:text-[#1a66ca] transition-colors"
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
    // Fetch 13 exclusive articles: 1 featured + up to 12 grid cards.
    // The grid initially shows 6 and reveals 3 more per "আরও" click.
    const exclusiveArticles = await getArticles({
      page: 1,
      limit: 16,
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

    // Fetch latest published articles for the popular slot — show the second batch (items 5-9)
    // so it doesn't duplicate the সর্বশেষ section (items 1-4). Temporary stand-in until the
    // isPopular API returns proper data from the backend.
    const popularSidebarRes = await getArticles({
      page: 1,
      limit: 11,
      status: "Published",
      sortBy: "date",
      sortOrder: "DESC",
    });
    const popularSidebarArticles: Article[] = popularSidebarRes?.data || [];

    const exclusiveTop = exclusiveArticles.data[0];
    const gridArticles = exclusiveArticles.data.slice(1, 16);

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
              <div className="group">
                <ArticleGridWithMore articles={gridArticles} />
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
              {/* Ribbon Header */}
              <div className="relative mb-3">
                {/* Ribbon shadow/fold */}
                <div className="absolute top-full left-0 w-[92%] h-2 bg-red-800/40 rounded-b-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)' }} />
                {/* Main ribbon body */}
                <div className="group relative bg-red-600 text-white pl-4 pr-14 py-3 transition-all duration-300 hover:bg-red-500" style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center justify-center w-7 h-7">
                        <div className="absolute inset-0 bg-white/10 rounded-full blur-md" />
                        <Clock className="relative h-6 w-6 text-white animate-clock-tick" />
                      </div>
                      <span className="font-extrabold uppercase tracking-wider text-base md:text-lg leading-none">সর্বশেষ</span>
                    </div>
                    <Link
                      href="/recent"
                      className="flex items-center gap-0.5 text-xs font-semibold text-white/70 group-hover:text-white! transition-colors shrink-0 pr-1"
                    >
                      আরো
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                {recentSidebarArticles.length > 0 ? (
                  recentSidebarArticles
                    .slice(0, 4)
                    .map(article => (
                      <NewsListItem key={article.id} article={article} />
                    ))
                ) : (
                  <p className="text-gray-400 text-lg md:text-xl text-center py-4">
                    কোনো সংবাদ পাওয়া যায়নি
                  </p>
                )}
              </div>
            </div>

            {/* Popular News - 4 items */}
            <div>
              {/* Ribbon Header */}
              <div className="relative mb-3">
                {/* Ribbon shadow/fold */}
                <div className="absolute top-full left-0 w-[92%] h-2 bg-[#000029]/40 rounded-b-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)' }} />
                {/* Main ribbon body */}
                <div className="group relative bg-[#000058] text-white pl-4 pr-14 py-3 transition-all duration-300 hover:bg-[#00004a]" style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center justify-center w-7 h-7">
                        <div className="absolute inset-0 bg-amber-400/15 rounded-full blur-md" />
                        <BarChart3 className="relative h-6 w-6 text-amber-400 animate-bar-growth" />
                      </div>
                      <span className="font-extrabold uppercase tracking-wider text-base md:text-lg leading-none">জনপ্রিয়</span>
                    </div>
                    <Link
                      href="/popular"
                      className="flex items-center gap-0.5 text-xs font-semibold text-white/70 group-hover:text-white! transition-colors shrink-0 pr-1"
                    >
                      আরো
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                {popularSidebarArticles.length > 4 ? (
                  popularSidebarArticles
                    .slice(4, 10)
                    .map(article => (
                      <NewsListItem key={article.id} article={article} />
                    ))
                ) : (
                  <p className="text-gray-400 text-lg md:text-xl text-center py-4">
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
