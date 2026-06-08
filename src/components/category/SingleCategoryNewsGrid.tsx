import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getAllcategories, getArticles } from "@/lib/api";
import { Category, Article } from "@/lib/types";
import Image from "next/image";

interface Props {
    slug: string;           // e.g., "international", "sports"
    fallbackTitle?: string; // e.g., "আন্তর্জাতিক"
    limit?: number;         // Total news cards to show (default: 4)
}

export default async function SingleCategoryNewsGrid({
    slug,
    fallbackTitle,
    limit = 4
}: Props) {
    // 1. Fetch backend categories to get the true ID & Bengali title
    const categoriesRes = await getAllcategories();
    const allCategories: Category[] = categoriesRes?.data || [];
    const currentCat = allCategories.find((c) => c.slug === slug);

    if (!currentCat) return null;

    // 2. Fetch general news articles directly under this category ID
    const articlesRes = await getArticles({
        categoryId: currentCat.id,
        limit: limit,
        status: "Published",
    });

    const articles: Article[] = articlesRes?.data || [];

    if (articles.length === 0) return null;

    const displayTitle = currentCat.titleBn || currentCat.title || fallbackTitle;

    // Split articles: 1 main featured layout, the rest as secondary items
    const featuredArticle = articles[0];
    const secondaryArticles = articles.slice(1);

    return (
        <div className="w-full flex flex-col gap-4 select-none">
            {/* Category Section Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <Link href={`/${currentCat.slug}`} className="flex items-center gap-1.5 group cursor-pointer">
                    <h2 className="text-xl font-bold text-gray-900 border-b-2 border-red-600 pb-2 -mb-[10px]">
                        {displayTitle}
                    </h2>
                    <ChevronRight className="h-5 w-5 text-red-600 mt-0.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>

            {/* Main Content Layout Grid */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">

                {/* Left Side: Large Featured Article Card */}
                {featuredArticle && (
                    <div className="lg:col-span-1 flex flex-col bg-white border border-gray-200 rounded-md p-4 pb-14 shadow-xs relative">
                        <Link href={`/news/${featuredArticle.category.slug || featuredArticle.category.slugBn}/${featuredArticle.code}`} className="group flex flex-col gap-3">
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
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {featuredArticle.excerpt}
                                </p>
                            )}
                        </Link>

                        {/* Bottom Right Details Button */}
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

                {/* Right Side: Secondary News Items List with Images & Titles */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    {secondaryArticles.map((article: Article, idx: number) => (
                        <Link
                            key={article.id || article.code || idx}
                            href={`/news/${article.category.slug || article.category.slugBn}/${article.code}`}
                            className="group flex gap-4 bg-white border border-gray-150 rounded-md p-3 shadow-xs hover:border-gray-300 transition-all items-center justify-between"
                        >
                            {/* Left Container: Thumbnail & Text Details */}
                            <div className="flex gap-4 items-center min-w-0 flex-1">
                                {/* Mini Left Side Thumbnail Image */}
                                <div className="relative w-28 sm:w-36 h-20 sm:h-24 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                                    <img
                                        src={article.coverImage}
                                        alt={article.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Right Side News Title & Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-base font-bold text-gray-800 leading-snug group-hover:text-primary transition-colors line-clamp-2 sm:line-clamp-3">
                                        {article.title}
                                    </h4>
                                    {article.excerpt && (
                                        <p className="hidden sm:block text-xs text-gray-500 mt-1 line-clamp-1">
                                            {article.excerpt}
                                        </p>
                                    )}

                                    {/* Details Button rendered inline under the text content */}
                                    <div className="mt-2.5">
                                        <span className="inline-flex items-center justify-center bg-primary group-hover:bg-primary/80 text-white text-[11px] font-medium px-3 py-1 rounded transition-colors shadow-xs">
                                            বিস্তারিত
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </div>
    );
}