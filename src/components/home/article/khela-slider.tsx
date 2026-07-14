"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Article } from "@/lib/types";
import { getArticleCategory } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface KhelaSliderProps {
  articles: Article[];
  title: string;
  categorySlug: string;
}

export default function KhelaSlider({
  articles = [],
  title,
  categorySlug,
}: KhelaSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const originalLength = articles.length;

  const getLayoutMetrics = useCallback(() => {
    if (!sliderRef.current || !sliderRef.current.firstElementChild) {
      return {
        cardWidth: 280,
        clientWidth: 1200,
        visibleCards: 3,
        pageWidth: 840,
      };
    }
    const card = sliderRef.current.firstElementChild as HTMLElement;
    const cardWidth = card.getBoundingClientRect().width + 20; // 20px gap
    const clientWidth = sliderRef.current.clientWidth;

    const isLargeDevice = window.matchMedia("(min-width: 1024px)").matches;
    const isMediumDevice = window.matchMedia("(min-width: 768px)").matches;
    const visibleCards = isLargeDevice ? 3 : isMediumDevice ? 2 : 1;
    const pageWidth = visibleCards * cardWidth;

    return { cardWidth, clientWidth, visibleCards, pageWidth };
  }, []);

  const updateLayoutStructure = useCallback(() => {
    if (originalLength === 0) return;
    const { visibleCards } = getLayoutMetrics();
    const pages = Math.ceil(originalLength / visibleCards);
    setTotalPages(pages || 1);
  }, [originalLength, getLayoutMetrics]);

  useEffect(() => {
    if (!sliderRef.current || originalLength === 0) return;
    updateLayoutStructure();

    const resizeObserver = new ResizeObserver(() => {
      updateLayoutStructure();
    });

    resizeObserver.observe(sliderRef.current);
    return () => resizeObserver.disconnect();
  }, [originalLength, updateLayoutStructure]);

  const goToPage = useCallback(
    (pageIndex: number) => {
      if (!sliderRef.current || originalLength === 0) return;
      const { pageWidth } = getLayoutMetrics();
      sliderRef.current.scrollTo({
        left: pageIndex * pageWidth,
        behavior: "smooth",
      });
    },
    [originalLength, getLayoutMetrics],
  );

  const handleStepScroll = (direction: "left" | "right") => {
    const nextTargetPage =
      direction === "left" ? activePage - 1 : activePage + 1;
    if (nextTargetPage >= 0 && nextTargetPage < totalPages) {
      goToPage(nextTargetPage);
    }
  };

  const handleScroll = () => {
    if (!sliderRef.current || originalLength === 0) return;
    const { scrollLeft } = sliderRef.current;
    const { pageWidth } = getLayoutMetrics();
    let computedPage = Math.round(scrollLeft / pageWidth);
    if (computedPage < 0) computedPage = 0;
    if (computedPage >= totalPages) computedPage = totalPages - 1;
    setActivePage(computedPage);
  };

  if (originalLength === 0) return null;

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <Link
          href={`/${categorySlug}`}
          className="flex items-center gap-1.5 group cursor-pointer"
        >
          <h2 className="text-xl font-bold text-gray-900 border-b-2 border-red-600 pb-2 -mb-[10px]">
            {title}
          </h2>
          <ChevronRight className="h-5 w-5 text-red-600 mt-0.5 transition-transform group-hover:translate-x-0.5" />
        </Link>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStepScroll("left")}
            disabled={activePage === 0}
            className="flex items-center justify-center h-8 w-8 rounded border cursor-pointer border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white active:scale-95 transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleStepScroll("right")}
            disabled={activePage === totalPages - 1}
            className="flex items-center justify-center h-8 w-8 rounded border cursor-pointer border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white active:scale-95 transition-all"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Slider */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="flex w-full gap-5 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {articles.map((article, idx) => (
          <Link
            key={article.id || article.code || idx}
            href={`/news/${getArticleCategory(article)?.slug || getArticleCategory(article)?.slugBn || "others"}/${article.code}`}
            className="w-[260px] sm:w-[280px] md:w-[calc(50%-10px)] lg:w-[calc((100%-40px)/3)] shrink-0 snap-start bg-white border border-gray-200 rounded-md overflow-hidden shadow-xs hover:shadow-sm hover:border-gray-300 transition-all group"
          >
            {/* Image */}
            <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="p-3 flex flex-col gap-1">
              <h3 className="text-base font-semibold text-gray-800 leading-snug group-hover:text-[#1a66ca] transition-colors"
                style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}>
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="text-sm text-gray-600"
                  style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}>
                  {article.excerpt}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Dots */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-1">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToPage(idx)}
              className="p-1 focus:outline-none rounded-full focus-visible:scale-125 transition-transform"
              aria-label={`Go to page ${idx + 1}`}
            >
              <span
                className={`block h-2 w-2 rounded-full transition-all duration-300 ${
                  idx === activePage
                    ? "bg-gray-800 scale-125 shadow-sm"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
