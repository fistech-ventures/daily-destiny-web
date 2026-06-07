// "use client";

// import React, { useRef, useState, useEffect } from "react";
// import { VideoArticle } from "@/lib/api";
// import VideoCard from "./video-card";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// interface VideoSliderProps {
//   videos: VideoArticle[];
//   title?: string;
// }

// export default function VideoSlider({ videos, title = "ভিডিও" }: VideoSliderProps) {
//   const sliderRef = useRef<HTMLDivElement>(null);
//   const [scrollProgress, setScrollProgress] = useState(0);

//   // Handle manual arrow scrolling buttons
//   const scroll = (direction: "left" | "right") => {
//     if (sliderRef.current) {
//       const { scrollLeft, clientWidth } = sliderRef.current;
//       const scrollAmount = clientWidth * 0.75; // Scroll 75% of view area width
      
//       sliderRef.current.scrollTo({
//         left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
//         behavior: "smooth",
//       });
//     }
//   };

//   // Calculate slide active dots based on window horizontal positions
//   const handleScroll = () => {
//     if (sliderRef.current) {
//       const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
//       const totalScrollable = scrollWidth - clientWidth;
//       if (totalScrollable <= 0) return;
      
//       const percentage = scrollLeft / totalScrollable;
//       setScrollProgress(percentage);
//     }
//   };

//   useEffect(() => {
//     const slider = sliderRef.current;
//     if (slider) {
//       slider.addEventListener("scroll", handleScroll, { passive: true });
//     }
//     return () => slider?.removeEventListener("scroll", handleScroll);
//   }, []);

//   if (!videos || videos.length === 0) return null;

//   // Determine active dot (out of 5 matching your screenshot dots tracker)
//   const totalDots = 5;
//   const activeDotIndex = Math.min(
//     Math.floor(scrollProgress * totalDots),
//     totalDots - 1
//   );

//   return (
//     <div className="w-full flex flex-col gap-6 bg-white p-4 rounded-md select-none">
      
//       {/* Slider Header Line */}
//       <div className="flex items-center justify-between border-b border-gray-100 pb-2">
//         <div className="flex items-center gap-1.5 group cursor-pointer">
//           <h2 className="text-xl font-bold text-gray-900 border-b-2 border-red-600 pb-2 -mb-[10px]">
//             {title}
//           </h2>
//           <ChevronRight className="h-5 w-5 text-red-600 mt-0.5 transition-transform group-hover:translate-x-0.5" />
//         </div>

//         {/* Slider Actions Navigation Controls */}
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => scroll("left")}
//             className="flex items-center justify-center h-8 w-8 rounded border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
//             aria-label="Previous Slide"
//           >
//             <ChevronLeft className="h-4 w-4" />
//           </button>
//           <button
//             onClick={() => scroll("right")}
//             className="flex items-center justify-center h-8 w-8 rounded border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
//             aria-label="Next Slide"
//           >
//             <ChevronRight className="h-4 w-4" />
//           </button>
//         </div>
//       </div>

//       {/* Main Horizontal Row Slider viewport Container */}
//       <div
//         ref={sliderRef}
//         className="flex w-full gap-5 overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory scrollbar-none"
//         style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//       >
//         {videos.map((video) => (
//           <div
//             key={video.id || video.slug}
//             className="w-[260px] sm:w-[280px] shrink-0 snap-start bg-[#eef6fc] p-3 rounded-md transition-shadow hover:shadow-sm"
//           >
//             <VideoCard video={video} variant="slider" />
//           </div>
//         ))}
//       </div>

//       {/* Slider Visual Pagination Indicator Dots matching the UI exactly */}
//       <div className="flex items-center justify-center gap-2 mt-2">
//         {Array.from({ length: totalDots }).map((_, idx) => (
//           <span
//             key={idx}
//             className={`h-2 w-2 rounded-full transition-all duration-300 ${
//               idx === activeDotIndex ? "bg-gray-800 scale-110" : "bg-gray-300"
//             }`}
//           />
//         ))}
//       </div>

//     </div>
//   );
// }

"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { VideoArticle } from "@/lib/api";
import VideoCard from "./video-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface VideoSliderProps {
  videos: VideoArticle[];
  title?: string;
  autoPlayInterval?: number;
}

export default function VideoSlider({ 
  videos = [], // Fallback to an empty array to prevent undefined runtime errors
  title = "ভিডিও", 
  autoPlayInterval = 4000 
}: VideoSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalDots = 5;

  // 1. Core definitions must be evaluated before any early returns or hooks
  const loopedVideos = [...videos, ...videos, ...videos];
  const originalLength = videos.length;

  // 2. All Hooks must stay unconditionally at the top level
  const getCardMetrics = useCallback(() => {
    if (!sliderRef.current || !sliderRef.current.firstElementChild) {
      return { cardWidth: 300, clientWidth: 1200 };
    }
    const card = sliderRef.current.firstElementChild as HTMLElement;
    const cardWidth = card.offsetWidth + 20; // card width + gap-5 (20px)
    return { cardWidth, clientWidth: sliderRef.current.clientWidth };
  }, []);

  useEffect(() => {
    if (sliderRef.current && originalLength > 0) {
      const { cardWidth } = getCardMetrics();
      sliderRef.current.scrollLeft = cardWidth * originalLength;
    }
  }, [originalLength, getCardMetrics]);

  const scroll = useCallback((direction: "left" | "right") => {
    if (sliderRef.current && originalLength > 0) {
      const { cardWidth, clientWidth } = getCardMetrics();
      const scrollAmount = Math.max(cardWidth, Math.floor(clientWidth / cardWidth) * cardWidth);

      sliderRef.current.scrollTo({
        left: direction === "left" ? sliderRef.current.scrollLeft - scrollAmount : sliderRef.current.scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  }, [getCardMetrics, originalLength]);

  const handleDotClick = (dotIndex: number) => {
    if (!sliderRef.current || originalLength === 0) return;
    
    const { cardWidth, clientWidth } = getCardMetrics();
    const totalBufferWidth = cardWidth * originalLength;
    const maxScrollableSegment = totalBufferWidth - clientWidth;
    
    if (maxScrollableSegment <= 0) return;

    const progressFactor = dotIndex / (totalDots - 1);
    const targetRelativeLeft = progressFactor * maxScrollableSegment;
    
    sliderRef.current.scrollTo({
      left: totalBufferWidth + targetRelativeLeft,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (isPaused || originalLength === 0) return;

    const interval = setInterval(() => {
      scroll("right");
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPaused, scroll, autoPlayInterval, originalLength]);

  const handleScroll = () => {
    if (!sliderRef.current || originalLength === 0) return;

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    const { cardWidth } = getCardMetrics();
    const totalBufferWidth = cardWidth * originalLength;

    if (scrollLeft <= cardWidth) {
      sliderRef.current.scrollLeft = scrollLeft + totalBufferWidth;
      return;
    }
    if (scrollLeft + clientWidth >= scrollWidth - cardWidth) {
      sliderRef.current.scrollLeft = scrollLeft - totalBufferWidth;
      return;
    }

    const relativeScrollLeft = (scrollLeft % totalBufferWidth);
    const maxScrollableSegment = totalBufferWidth - clientWidth;

    if (maxScrollableSegment > 0) {
      const progress = Math.min(Math.max(relativeScrollLeft / maxScrollableSegment, 0), 1);
      const dotIndex = Math.min(Math.floor(progress * totalDots), totalDots - 1);
      setActiveDotIndex(dotIndex);
    }
  };

  // 3. Early return moved completely BELOW the hook declarations
  if (originalLength === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-6 bg-white p-4 rounded-md select-none">
      
      {/* Slider Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex items-center gap-1.5 group cursor-pointer">
          <h2 className="text-xl font-bold text-gray-900 border-b-2 border-red-600 pb-2 -mb-[10px]">
            {title}
          </h2>
          <ChevronRight className="h-5 w-5 text-red-600 mt-0.5 transition-transform group-hover:translate-x-0.5" />
        </div>

        {/* Navigation Controls */}
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

      {/* Main Horizontal Row Slider */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex w-full gap-5 overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {loopedVideos.map((video, index) => (
          <div
            key={`${video.id || video.slug}-${index}`}
            className="w-[260px] sm:w-[280px] md:w-[300px] shrink-0 snap-start bg-[#eef6fc] p-3 rounded-md transition-shadow hover:shadow-sm"
          >
            <VideoCard video={video} variant="slider" />
          </div>
        ))}
      </div>

      {/* Clickable Pagination Tracker Dots */}
      <div className="flex items-center justify-center gap-2 mt-2">
        {Array.from({ length: totalDots }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className="p-1 focus:outline-none focus-visible:scale-125 transition-transform"
            aria-label={`Go to slide group ${idx + 1}`}
          >
            <span
              className={`block h-2 w-2 rounded-full transition-all duration-300 ${
                idx === activeDotIndex 
                  ? "bg-gray-800 scale-125 shadow-sm" 
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          </button>
        ))}
      </div>

    </div>
  );
}