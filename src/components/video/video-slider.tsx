"use client";

import React, { useRef, useState, useEffect } from "react";
import { VideoArticle } from "@/lib/api";
import VideoCard from "./video-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface VideoSliderProps {
  videos: VideoArticle[];
  title?: string;
}

export default function VideoSlider({ videos, title = "ভিডিও" }: VideoSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle manual arrow scrolling buttons
  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollAmount = clientWidth * 0.75; // Scroll 75% of view area width
      
      sliderRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Calculate slide active dots based on window horizontal positions
  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const totalScrollable = scrollWidth - clientWidth;
      if (totalScrollable <= 0) return;
      
      const percentage = scrollLeft / totalScrollable;
      setScrollProgress(percentage);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", handleScroll, { passive: true });
    }
    return () => slider?.removeEventListener("scroll", handleScroll);
  }, []);

  if (!videos || videos.length === 0) return null;

  // Determine active dot (out of 5 matching your screenshot dots tracker)
  const totalDots = 5;
  const activeDotIndex = Math.min(
    Math.floor(scrollProgress * totalDots),
    totalDots - 1
  );

  return (
    <div className="w-full flex flex-col gap-6 bg-white p-4 rounded-md select-none">
      
      {/* Slider Header Line */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex items-center gap-1.5 group cursor-pointer">
          <h2 className="text-xl font-bold text-gray-900 border-b-2 border-red-600 pb-2 -mb-[10px]">
            {title}
          </h2>
          <ChevronRight className="h-5 w-5 text-red-600 mt-0.5 transition-transform group-hover:translate-x-0.5" />
        </div>

        {/* Slider Actions Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="flex items-center justify-center h-8 w-8 rounded border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex items-center justify-center h-8 w-8 rounded border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Horizontal Row Slider viewport Container */}
      <div
        ref={sliderRef}
        className="flex w-full gap-5 overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {videos.map((video) => (
          <div
            key={video.id || video.slug}
            className="w-[260px] sm:w-[280px] shrink-0 snap-start bg-[#eef6fc] p-3 rounded-md transition-shadow hover:shadow-sm"
          >
            <VideoCard video={video} variant="slider" />
          </div>
        ))}
      </div>

      {/* Slider Visual Pagination Indicator Dots matching the UI exactly */}
      <div className="flex items-center justify-center gap-2 mt-2">
        {Array.from({ length: totalDots }).map((_, idx) => (
          <span
            key={idx}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              idx === activeDotIndex ? "bg-gray-800 scale-110" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

    </div>
  );
}