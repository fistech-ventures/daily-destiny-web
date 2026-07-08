import { Article } from '@/lib/types';
import { getArticleCategory } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

// Reused the Article interface provided
export interface Author {
    id: string;
    name: string;
    profileImage?: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface ArticleMedia {
    id: string;
    url: string;
    type: string;
}

export interface SeoMetaData {
    keywords?: string[];
    canonicalUrl?: string;
}

interface PoliticsSectionProps {
    articles: Article[];
}

const PoliticsSection: React.FC<PoliticsSectionProps> = ({ articles }) => {
    // Ensure we have at least one main article and fallback for missing items
    const mainArticle = articles[0];
    const sideArticles = articles.slice(1, 7); // Captures up to 6 articles for the remaining 3x2 grid

    if (!mainArticle) {
        return <div className="text-center py-10 text-gray-500">No articles available.</div>;
    }

    const categorySlug = mainArticle.category?.slug || "politics";
    const title = mainArticle.category?.titleBn || mainArticle.category?.title || "রাজনীতি";

    return (
        <div className="w-full flex flex-col gap-4 select-none font-sans mt-2">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <Link
                    href={`/${categorySlug}`}
                    className="flex items-center gap-1.5 group cursor-pointer"
                >
                    <h2 className="text-xl font-bold text-gray-900 border-b-2 border-red-600 pb-2 -mb-[10px]">
                        {title}
                    </h2>
                    <ChevronRight className="h-5 w-5 text-[#000058] mt-0.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>

            {/* 5-Column Grid Setup matching image_417bfd.jpg */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start mt-2">

                {/* Leftmost 2 Columns spanning across 2 Rows */}
                <div className="md:col-span-2 md:row-span-2 flex flex-col h-full border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0 md:pr-6">
                    <a href={`/news/${getArticleCategory(mainArticle)?.slug || "politics"}/${mainArticle.code}`} className="group block flex-col h-full justify-between">
                        <div>
                            <div className="overflow-hidden rounded-lg bg-gray-100 aspect-[16/10]">
                                <img
                                    src={mainArticle.coverImage}
                                    alt={mainArticle.title}
                                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-200"
                                />
                            </div>
                            <div className="mt-4">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors duration-200">
                                    {mainArticle.title}
                                </h2>
                                <p className="mt-3 text-sm text-gray-600 leading-relaxed"
                                    style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}>
                                    {mainArticle.excerpt}
                                </p>
                            </div>
                        </div>

                        {/* <div className="mt-4 flex items-center text-xs text-gray-400 gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{mainArticle.date || "কিছুক্ষণ আগে"}</span>
                        </div> */}
                    </a>
                </div>

                {/* 
                  Remaining 3 Columns across 2 Rows (6 cards total).
                  CSS Grid automatically flows sequential elements into the 3 empty columns 
                  of row 1, followed by row 2.
                */}
                {sideArticles.map((article, index) => {
                    const isRow1 = index < 3;
                    const isNotLastCol = (index + 1) % 3 !== 0;

                    return (
                        <div
                            key={article.id}
                            className={`md:col-span-1 flex flex-col h-full pb-4 md:pb-0
                                ${isRow1 ? 'md:border-b md:pb-6' : 'md:pt-2'}
                                ${isNotLastCol ? 'md:border-r md:pr-6' : ''} 
                                border-gray-100`}
                        >
                            <a href={`/news/${getArticleCategory(article)?.slug || "politics"}/${article.code}`} className="group block flex-col justify-between h-full">
                                <div>
                                    <div className="overflow-hidden rounded-lg bg-gray-100 aspect-[16/10]">
                                        <img
                                            src={article.coverImage}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-200"
                                        />
                                    </div>
                                    <h3 className="mt-3 text-sm font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors duration-200"
                                        style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}>
                                        {article.title}
                                    </h3>
                                </div>
                            </a>
                        </div>
                    );
                })}

            </div>
        </div>
    );
};

export default PoliticsSection;