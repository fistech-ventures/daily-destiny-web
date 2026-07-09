// src/components/feature-banner/FeatureBanner.tsx

import React from "react";
import Link from "next/link";
import Image from "next/image";

// ── TYPE DEFINITIONS MATCHING THE API RESPONSE ────────────────────────────────
export interface APIArticle {
  id: string;
  title: string;
  slug: string;
  code: string;
  coverImage: string;
  isActive: boolean;
  type?: string; // e.g. "news"
  excerpt?: string;
}

export interface APISpecialEvent {
  id: string;
  title: string;
  slug: string;
  bannerImage: string;
  isActive: boolean;
  articles: APIArticle[];
}

interface FeatureBannerProps {
  eventData?: APISpecialEvent | null;
}
// ─────────────────────────────────────────────────────────────────────────────

const FeatureBanner = ({ eventData }: FeatureBannerProps) => {
  // Root Visibility Guard: hide entirely when data is missing or event is inactive
  if (!eventData || !eventData.isActive) {
    return null;
  }

  const {
    title: heroTitle,
    bannerImage: heroBgImage,
    articles = [],
  } = eventData;

  // Filter out inactive articles, then cap at 4 to keep the grid layout intact
  const activeArticles = articles
    .filter(article => article.isActive)
    .slice(0, 4);

  return (
    <section className="w-full bg-[#cbd5e1] p-1 font-sans">
      {/* ── TOP ROW: Banner Image ── */}
      <div className=" relative w-full h-[140px] sm:h-[180px]  md:h-[240px] mb-1 overflow-hidden">
        {heroBgImage && (
          <Image
            src={heroBgImage}
            alt={heroTitle || "Special Event Banner"}
            fill
            className="object-cover object-right md:object-contain"
            priority
          />
        )}

        {/* Banner Title - Positioned at bottom-left */}
        {heroTitle && (
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 via-black/40 to-transparent p-3 sm:p-4 md:p-6 z-10">
            <h2 className="text-white text-base sm:text-lg md:text-2xl font-bold leading-tight">
              {heroTitle}
            </h2>
          </div>
        )}

        {/* Screen-reader only title */}
        <h2 className="sr-only">{heroTitle}</h2>
      </div>

      {/* ── BOTTOM ROW: Article Grid ── */}
      {activeArticles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white p-2">
          {activeArticles.map(article => (
            <Link
              key={article.id}
              href={`/news/${article.type || "news"}/${article.code}`}
              className="group flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                  {article.coverImage && (
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  )}
                </div>

                {/* Title */}
                <h3 className="text-[#1e293b] text-xs sm:text-sm font-semibold mt-2 leading-relaxed group-hover:text-blue-700 transition-colors"
                style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}>
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeatureBanner;
