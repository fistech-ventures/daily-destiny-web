import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getAllcategories, getArticles } from "@/lib/api";
import { Category, Article } from "@/lib/types";

interface Props {
    slug: string;
    fallbackTitle?: string;
    limit?: number;
}

export default async function SingleCategoryNewsGrid({
    slug,
    fallbackTitle,
    limit = 7, // ✅ FIX: must be 7
}: Props) {

    // Fetch categories
    const categoriesRes = await getAllcategories();
    const allCategories: Category[] = categoriesRes?.data || [];

    const currentCat = allCategories.find(
        (category) => category.slug === slug
    );

    if (!currentCat) return null;

    // Fetch articles
    const articlesRes = await getArticles({
        categoryId: currentCat.id,
        limit,
        status: "Published",
    });

    const articles: Article[] = articlesRes?.data || [];

    if (articles.length === 0) return null;

    const displayTitle =
        currentCat.titleBn || currentCat.title || fallbackTitle;

    // ✅ 1 + 3 + 3 layout
    const featuredArticle = articles[0];
    const middleArticles = articles.slice(1, 4); // 3 items
    const rightArticles = articles.slice(4, 7);  // 3 items

    return (
        <div className="w-full flex flex-col gap-4 select-none">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <Link
                    href={`/${currentCat.slug}`}
                    className="flex items-center gap-1.5 group cursor-pointer"
                >
                    <h2 className="text-xl font-bold text-gray-900 border-b-2 border-red-600 pb-2 -mb-[10px]">
                        {displayTitle}
                    </h2>

                    <ChevronRight className="h-5 w-5 text-red-600 mt-0.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>

            {/* Grid */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">

                {/* Featured */}
                {featuredArticle && (
                    <div className="lg:col-span-1 flex flex-col bg-white border border-gray-200 rounded-md p-4 pb-14 shadow-xs relative">
                        <Link
                            href={`/news/${featuredArticle.category.slug || featuredArticle.category.slugBn}/${featuredArticle.code}`}
                            className="group flex flex-col gap-3"
                        >
                            <div className="relative w-full aspect-video rounded overflow-hidden bg-gray-100">
                                <img
                                    src={featuredArticle.coverImage}
                                    alt={featuredArticle.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors">
                                {featuredArticle.title}
                            </h3>

                            {featuredArticle.excerpt && (
                                <p className="text-sm text-gray-600 line-clamp-3">
                                    {featuredArticle.excerpt}
                                </p>
                            )}
                        </Link>

                        <div className="absolute bottom-4 right-4">
                            <Link
                                href={`/news/${featuredArticle.category.slug || featuredArticle.category.slugBn}/${featuredArticle.code}`}
                                className="inline-flex items-center justify-center bg-primary hover:bg-primary/80 text-white text-xs font-medium px-4 py-1.5 rounded transition-colors shadow-xs"
                            >
                                বিস্তারিত
                            </Link>
                        </div>
                    </div>
                )}

                {/* Middle Column (3 items) */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    {middleArticles.map((article, idx) => (
                        <Link
                            key={article.id || article.code || idx}
                            href={`/news/${article.category.slug || article.category.slugBn}/${article.code}`}
                            className="group flex gap-4 bg-white border border-gray-200 rounded-md p-3 shadow-xs hover:border-gray-300 transition-all items-center"
                        >
                            <div className="relative w-28 sm:w-36 h-20 sm:h-24 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                                <img
                                    src={article.coverImage}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="text-base font-bold text-gray-800 leading-snug group-hover:text-primary transition-colors line-clamp-2 sm:line-clamp-3">
                                    {article.title}
                                </h4>

                                {article.excerpt && (
                                    <p className="hidden sm:block text-xs text-gray-500 mt-1 line-clamp-2">
                                        {article.excerpt}
                                    </p>
                                )}

                                <div className="mt-2.5">
                                    <span className="inline-flex items-center justify-center bg-primary text-white text-[11px] font-medium px-3 py-1 rounded">
                                        বিস্তারিত
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Right Column (3 items) */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    {rightArticles.map((article, idx) => (
                        <Link
                            key={article.id || article.code || idx}
                            href={`/news/${article.category.slug || article.category.slugBn}/${article.code}`}
                            className="group flex gap-4 bg-white border border-gray-200 rounded-md p-3 shadow-xs hover:border-gray-300 transition-all items-center"
                        >
                            <div className="relative w-28 sm:w-36 h-20 sm:h-24 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                                <img
                                    src={article.coverImage}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="text-base font-bold text-gray-800 leading-snug group-hover:text-primary transition-colors line-clamp-2 sm:line-clamp-3">
                                    {article.title}
                                </h4>

                                {article.excerpt && (
                                    <p className="hidden sm:block text-xs text-gray-500 mt-1 line-clamp-2">
                                        {article.excerpt}
                                    </p>
                                )}

                                <div className="mt-2.5">
                                    <span className="inline-flex items-center justify-center bg-primary text-white text-[11px] font-medium px-3 py-1 rounded">
                                        বিস্তারিত
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </div>
    );
}