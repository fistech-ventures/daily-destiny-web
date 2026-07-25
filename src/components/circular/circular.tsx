// src/components/circular/circular.tsx
// Circular/Recruitment notice component — displays a circular image
// alongside recent news articles in a two-column layout.

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { getArticleCategory } from "@/lib/utils";
import { FileText } from "lucide-react";

interface CircularProps {
  /** Recent articles to display alongside the circular image */
  articles: Article[];
  /** Optional override for the image path */
  imageUrl?: string;
  /** Optional alt text */
  altText?: string;
  /** Optional className override */
  className?: string;
}

const CIRCULAR_IMAGE = "/advertise/circular.jpeg";
const DEFAULT_ALT = "বিজ্ঞপ্তি";

const Circular = ({
  articles,
  imageUrl = CIRCULAR_IMAGE,
  altText = DEFAULT_ALT,
  className = "",
}: CircularProps) => {
  const displayArticles = articles.slice(0, 4);

  return (
    <div
      className={`w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* ── LEFT: Circular Image (8 cols on desktop) ── */}
        <div className="lg:col-span-8 relative">
          <Link
            href="/circular"
            className="group block relative w-full h-full min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] overflow-hidden bg-gray-100"
            aria-label={altText}
          >
            <Image
              src={imageUrl}
              alt={altText}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-105 bg-gray-50"
              sizes="(max-width: 768px) 100vw, 66vw"
              priority={false}
            />

            {/* Badge overlay */}
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-full shadow-sm">
                <FileText className="h-3.5 w-3.5" />
                বিজ্ঞপ্তি
              </span>
            </div>

            {/* Hover hint */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>

        {/* ── RIGHT: News Articles (4 cols on desktop) ── */}
        <div className="lg:col-span-4 flex flex-col border-t lg:border-t-0 lg:border-l border-gray-100">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-red-500 rounded-full" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                সর্বশেষ সংবাদ
              </h3>
            </div>
          </div>

          {/* Articles list */}
          <div className="flex-1 divide-y divide-gray-100">
            {displayArticles.length > 0 ? (
              displayArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${getArticleCategory(article)?.slug || "others"}/${article.code}`}
                  className="group flex items-start gap-3 px-4 py-3 hover:bg-gray-50/80 transition-colors duration-150"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-14 shrink-0 rounded-md overflow-hidden bg-gray-100 shadow-xs">
                    {article.coverImage ? (
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <FileText className="h-5 w-5" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-[#1a66ca] transition-colors"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {article.title}
                    </h4>
                    {getArticleCategory(article)?.titleBn && (
                      <span className="inline-block mt-1 text-[10px] font-medium text-brand bg-blue-50 px-1.5 py-0.5 rounded-full">
                        {getArticleCategory(article)?.titleBn}
                      </span>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex items-center justify-center h-full py-8 text-sm text-gray-400">
                কোনো সংবাদ পাওয়া যায়নি
              </div>
            )}
          </div>

          {/* Footer link */}
          <Link
            href="/recent"
            className="block px-4 py-2.5 text-center text-xs font-semibold text-[#1a66ca] hover:text-red-600 border-t border-gray-100 bg-gray-50/30 hover:bg-gray-100/50 transition-colors"
          >
            আরও সংবাদ দেখুন →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Circular;
