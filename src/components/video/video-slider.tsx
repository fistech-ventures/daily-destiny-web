"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { VideoArticle } from "@/lib/api";
import VideoCard from "./video-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface VideoSliderProps {
  videos: VideoArticle[];
  title?: string;
}

export default function VideoSlider({
  videos = [],
  title = "ভিডিও",
}: VideoSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const originalLength = videos.length;

  // Extracts dynamic dimensions and layouts from the live DOM viewport
  const getLayoutMetrics = useCallback(() => {
    if (!sliderRef.current || !sliderRef.current.firstElementChild) {
      return {
        cardWidth: 300,
        clientWidth: 1200,
        visibleCards: 3,
        pageWidth: 900,
      };
    }
    const card = sliderRef.current.firstElementChild as HTMLElement;
    const cardWidth = card.getBoundingClientRect().width + 20; // 20px corresponds to gap-5
    const clientWidth = sliderRef.current.clientWidth;

    const isLargeDevice = window.matchMedia("(min-width: 1024px)").matches;
    const visibleCards = isLargeDevice
      ? 3
      : Math.max(1, Math.round(clientWidth / cardWidth));
    const pageWidth = visibleCards * cardWidth;

    return { cardWidth, clientWidth, visibleCards, pageWidth };
  }, []);

  // Recalculates total layout pages responsively based on active browser layout
  const updateLayoutStructure = useCallback(() => {
    if (originalLength === 0) return;
    const { visibleCards } = getLayoutMetrics();
    const pages = Math.ceil(originalLength / visibleCards);
    setTotalPages(pages || 1);
  }, [originalLength, getLayoutMetrics]);

  // Set up resize observer to keep structural page dots accurate
  useEffect(() => {
    if (!sliderRef.current || originalLength === 0) return;

    updateLayoutStructure();

    const resizeObserver = new ResizeObserver(() => {
      updateLayoutStructure();
    });

    resizeObserver.observe(sliderRef.current);
    return () => resizeObserver.disconnect();
  }, [originalLength, updateLayoutStructure]);

  // Discrete Page Navigation Engine
  const goToPage = useCallback(
    (pageIndex: number) => {
      if (!sliderRef.current || originalLength === 0) return;

      const { pageWidth } = getLayoutMetrics();
      const targetScrollLeft = pageIndex * pageWidth;

      sliderRef.current.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      });
    },
    [originalLength, getLayoutMetrics],
  );

  // Directional navigation arrows triggers
  const handleStepScroll = (direction: "left" | "right") => {
    const nextTargetPage =
      direction === "left" ? activePage - 1 : activePage + 1;
    if (nextTargetPage >= 0 && nextTargetPage < totalPages) {
      goToPage(nextTargetPage);
    }
  };

  // Tracking page state based on direct scroll location
  const handleScroll = () => {
    if (!sliderRef.current || originalLength === 0) return;

    const { scrollLeft } = sliderRef.current;
    const { pageWidth } = getLayoutMetrics();

    let computedPage = Math.round(scrollLeft / pageWidth);

    // Keep page index bounded cleanly
    if (computedPage < 0) computedPage = 0;
    if (computedPage >= totalPages) computedPage = totalPages - 1;

    setActivePage(computedPage);
  };

  if (originalLength === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-6 bg-white p-4 rounded-md select-none">
      {/* Slider Header Line Block */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex items-center gap-1.5 group cursor-pointer">
          <h2 className="text-xl font-bold text-gray-900 border-b-2 border-red-600 pb-2 -mb-[10px]">
            {title}
          </h2>
          <ChevronRight className="h-5 w-5 text-red-600 mt-0.5 transition-transform group-hover:translate-x-0.5" />
        </div>

        {/* Dynamic Action Buttons Layout */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStepScroll("left")}
            disabled={activePage === 0}
            className="flex items-center justify-center h-8 w-8 rounded border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white active:scale-95 transition-all"
            aria-label="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleStepScroll("right")}
            disabled={activePage === totalPages - 1}
            className="flex items-center justify-center h-8 w-8 rounded border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white active:scale-95 transition-all"
            aria-label="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Horizontal Carousel Layer Area */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="flex w-full gap-5 overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {videos.map(video => (
          <Link
            key={video.id || video.slug}
            href={`/video/${video.code}`}
            className="w-[260px] sm:w-[280px] md:w-[300px] lg:w-[calc((100%-40px)/3)] shrink-0 snap-start bg-[#eef6fc] p-3 rounded-md transition-shadow hover:shadow-sm block"
          >
            <VideoCard video={video} variant="default" />
          </Link>
        ))}
      </div>

      {/* Precise Action Dots */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToPage(idx)}
              className="p-1 focus:outline-none focus-visible:scale-125 transition-transform"
              aria-label={`Go to page row group ${idx + 1}`}
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
