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
  videos = [], 
  title = "ভিডিও", 
  autoPlayInterval = 4000 
}: VideoSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const originalLength = videos.length;
  // Triple the data array to create our infinite scrolling buffer wheels
  const loopedVideos = [...videos, ...videos, ...videos];

  // Extracts dynamic dimensions and layouts from the live DOM viewport
  const getLayoutMetrics = useCallback(() => {
    if (!sliderRef.current || !sliderRef.current.firstElementChild) {
      return { cardWidth: 300, clientWidth: 1200, visibleCards: 3, pageWidth: 900 };
    }
    const card = sliderRef.current.firstElementChild as HTMLElement;
    const cardWidth = card.offsetWidth + 20; // 20px corresponds to gap-5
    const clientWidth = sliderRef.current.clientWidth;
    
    // Calculate how many full or fractional cards fit on the screen
    const visibleCards = Math.max(1, Math.round(clientWidth / cardWidth));
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

  // Initial load alignment and structural observation setup
  useEffect(() => {
    if (!sliderRef.current || originalLength === 0) return;

    const { cardWidth } = getLayoutMetrics();
    // Center-align layout directly on the second identical set group index
    sliderRef.current.scrollLeft = cardWidth * originalLength;

    updateLayoutStructure();

    // Dynamically re-adjust whenever the window or container scales down or stretches out
    const resizeObserver = new ResizeObserver(() => {
      updateLayoutStructure();
    });
    
    resizeObserver.observe(sliderRef.current);
    return () => resizeObserver.disconnect();
  }, [originalLength, getLayoutMetrics, updateLayoutStructure]);

  // Discrete Page Navigation Engine
  const goToPage = useCallback((pageIndex: number, behavior: ScrollBehavior = "smooth") => {
    if (!sliderRef.current || originalLength === 0) return;

    const { cardWidth, pageWidth } = getLayoutMetrics();
    const totalBufferWidth = cardWidth * originalLength;

    // Direct scroll target alignment mapping page indexes against computed structural metrics
    const targetScrollLeft = totalBufferWidth + (pageIndex * pageWidth);

    sliderRef.current.scrollTo({
      left: targetScrollLeft,
      behavior,
    });
  }, [originalLength, getLayoutMetrics]);

  // Directional navigation arrows triggers
  const handleStepScroll = (direction: "left" | "right") => {
    const nextTargetPage = direction === "left" ? activePage - 1 : activePage + 1;
    goToPage(nextTargetPage);
  };

  // Continuous loop engine observer tracker
  useEffect(() => {
    if (isPaused || originalLength === 0) return;

    const interval = setInterval(() => {
      goToPage(activePage + 1);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPaused, activePage, autoPlayInterval, originalLength, goToPage]);

  // Real-time scrolling synchronization and wheel shifting
  const handleScroll = () => {
    if (!sliderRef.current || originalLength === 0) return;

    // 1. Get DOM properties directly from the element
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    
    // 2. Get your layout metrics from the helper
    const { cardWidth, pageWidth } = getLayoutMetrics();
    
    const totalBufferWidth = cardWidth * originalLength;

    // A. Left Edge Loop Trigger Reset
    if (scrollLeft <= cardWidth) {
      const offsetFix = scrollLeft + totalBufferWidth;
      sliderRef.current.scrollLeft = offsetFix;
      return;
    }

    // B. Right Edge Loop Trigger Reset
    if (scrollLeft + clientWidth >= scrollWidth - cardWidth) {
      const offsetFix = scrollLeft - totalBufferWidth;
      sliderRef.current.scrollLeft = offsetFix;
      return;
    }

    // C. Precise discrete active page tracking computation
    const relativeScrollLeft = scrollLeft - totalBufferWidth;
    
    // Using Math.round eliminates half-scrolled layout snapping indicator conflicts
    let computedPage = Math.round(relativeScrollLeft / pageWidth);
    
    // Correct variations down to match within a strictly bound zero-indexed array context
    if (computedPage < 0) computedPage = totalPages - 1;
    if (computedPage >= totalPages) computedPage = 0;

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
            className="flex items-center justify-center h-8 w-8 rounded border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
            aria-label="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleStepScroll("right")}
            className="flex items-center justify-center h-8 w-8 rounded border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
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

      {/* Precise Context-Aware Functional Indicator Action Dots */}
      <div className="flex items-center justify-center gap-2 mt-2">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToPage(idx)}
            className="p-1 focus:outline-none focus-visible:scale-125 transition-transform"
            aria-label={`Maps direct to video sequence row page group ${idx + 1}`}
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

    </div>
  );
}