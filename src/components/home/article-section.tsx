import React from "react";
import Link from "next/link";
import { getArticles } from "@/lib/api";
import { Article } from "@/lib/types";

const FeaturedNewsCard = ({ article }: { article: Article }) => (
  <div className="col-span-8">
    <Link href={`/news/${article.category?.slug || "others"}/${article.code}`}>
      <div className="bg-white grid grid-cols-1 md:grid-cols-2">
        <div className="">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full aspect-video object-cover"
          />
          <p className="text-base text-gray-500 p-2">
            {article.coverImageCredit}
          </p>
        </div>
        <div className="p-4">
          <h1 className="text-lg md:text-2xl font-bold mb-2">
            {article.title}
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            {article.excerpt}
          </p>
        </div>
      </div>
    </Link>
  </div>
);

const SideNewsCard = ({ article }: { article: Article }) => (
  <div className="flex flex-col md:flex-row items-start border-b border-gray-200 py-2">
    <div className="flex-1">
      <Link
        href={`/news/${article.category?.slug || "others"}/${article.code}`}
      >
        <div className="grid grid-cols-3 items-start">
          <h2 className="col-span-2 lg:col-span-3 text-xs md:text-base font-semibold line-clamp-2">
            {article.title}
          </h2>
          <img
            src={article.coverImage}
            alt={article.title}
            className="col-span-1 w-full aspect-video object-contain lg:hidden md:w-20 md:h-16"
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">{article.excerpt}</p>
      </Link>
    </div>
    <img
      src={article.coverImage}
      alt={article.title}
      className="w-full aspect-video object-contain hidden lg:block md:w-20 md:h-16 mt-2 md:mt-0 md:ml-4"
    />
  </div>
);

const NewsGrid = ({ articles }: { articles: Article[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 col-span-12 border-b border-gray-300">
    {articles.map((article, index: number) => (
      <Link
        key={article.id}
        href={`/news/${article.category?.slug || "others"}/${article.code}`}
      >
        <div
          className={`${
            index === 0 ? "md:pr-2 md:border-r md:border-gray-300" : "md:pl-2"
          }`}
        >
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full aspect-video object-contain"
          />
          <div className="p-4">
            <h3 className="text-sm md:text-md font-semibold mb-1">
              {article.title}
            </h3>
            <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
              {article.excerpt}
            </p>
          </div>
        </div>
      </Link>
    ))}
  </div>
);

export default async function ArticleSection() {
  // Get featured news
  const { data: articles } = await getArticles({
    page: 1,
    limit: 16,
    isFeatured: true,
    sortBy: "position",
    sortOrder: "ASC",
  });

  // Get exclusive articles
  const { data: exclusiveArticles } = await getArticles({
    page: 1,
    limit: 7,
    isExclusive: true,
    sortBy: "position",
    sortOrder: "ASC",
  });

  return (
    <section className="py-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Sidebar - Moves to 2nd position on mobile, resets on desktop */}
        <div className="col-span-12 md:col-span-3 md:pr-4 order-2 md:order-1">
          {articles.slice(0, 8).map((article: Article) => (
            <SideNewsCard key={article.id} article={article} />
          ))}
        </div>

        {/* Center Main Column - Jumps to the top on mobile, sits 2nd on desktop */}
        <div className="col-span-12 md:col-span-6 md:px-4 md:border-x-2 md:border-gray-300 order-1 md:order-2">
          {articles[0] && (
            <div className="pb-4 border-b border-gray-300">
              <FeaturedNewsCard article={exclusiveArticles[0]} />
            </div>
          )}
          <div className="pt-4">
            <NewsGrid articles={exclusiveArticles.slice(1, 3)} />
          </div>
          <div className="pt-4">
            <NewsGrid articles={exclusiveArticles.slice(3, 5)} />
          </div>
          <div className="pt-4">
            <NewsGrid articles={exclusiveArticles.slice(5, 7)} />
          </div>
        </div>

        {/* Right Sidebar - Stays at the bottom on mobile, sits 3rd on desktop */}
        <div className="col-span-12 md:col-span-3 md:pl-4 order-3">
          {articles.slice(8, 18).map((article: Article) => (
            <SideNewsCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
