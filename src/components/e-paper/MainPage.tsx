"use client";

import React, { useState, useEffect, useRef } from "react";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import type { EpaperViewPage } from "./PaperSlider";

interface MainPageProps {
  pages: EpaperViewPage[];
  activeIndex: number;
}

// Zoom steps the user can cycle through
const ZOOM_LEVELS = [75, 100, 125, 150, 200];

const MainPage: React.FC<MainPageProps> = ({ pages, activeIndex }) => {
  const currentPage = pages[activeIndex];
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(1); // default = 100%
  const prevIndexRef = useRef(activeIndex);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset state on page change
  useEffect(() => {
    if (prevIndexRef.current !== activeIndex) {
      prevIndexRef.current = activeIndex;
      setLoaded(false);
      setError(false);
      // Scroll back to top-left on page change
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, left: 0 });
      }
    }
  }, [activeIndex]);

  if (!currentPage) return null;

  const zoom = ZOOM_LEVELS[zoomIndex];
  const canZoomIn = zoomIndex < ZOOM_LEVELS.length - 1;
  const canZoomOut = zoomIndex > 0;

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* ── Zoom toolbar ───────────────────────────────────────────────────── */}
      <div
        className="absolute top-3 right-3 z-30 flex items-center gap-1
                      bg-white/90 backdrop-blur-sm border border-gray-200
                      rounded-full shadow-md px-2 py-1"
      >
        <button
          onClick={() => setZoomIndex(i => Math.max(i - 1, 0))}
          disabled={!canZoomOut}
          title="জুম কমান"
          className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ZoomOut size={16} className="text-gray-700" />
        </button>

        <span className="text-xs font-semibold text-gray-600 tabular-nums w-10 text-center">
          {zoom}%
        </span>

        <button
          onClick={() =>
            setZoomIndex(i => Math.min(i + 1, ZOOM_LEVELS.length - 1))
          }
          disabled={!canZoomIn}
          title="জুম বাড়ান"
          className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ZoomIn size={16} className="text-gray-700" />
        </button>

        <div className="w-px h-4 bg-gray-200 mx-0.5" />

        <button
          onClick={() => setZoomIndex(1)}
          title="রিসেট"
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Maximize2 size={16} className="text-gray-700" />
        </button>
      </div>

      {/* ── Scroll container — both axes ───────────────────────────────────── 
          overflow-auto on BOTH axes means the image can be wider than the
          viewport and users can pan left/right as well as scroll up/down.
          This is exactly how real e-paper readers (Daily Star, Prothom Alo)
          work at high zoom levels.
      */}
      <div
        ref={scrollContainerRef}
        className="flex-1 h-full overflow-auto bg-gray-300
                   [scrollbar-width:thin] [scrollbar-color:#aaa_transparent]"
      >
        {/* ── Loading skeleton ─────────────────────────────────────────────── */}
        {!loaded && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            <img
              src={currentPage.thumbnail}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-contain blur-sm opacity-30 select-none"
            />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-4 border-red-200 border-t-red-600 animate-spin" />
              <span className="text-sm text-gray-600 font-medium bg-white/70 px-3 py-1 rounded-full">
                লোড হচ্ছে…
              </span>
            </div>
          </div>
        )}

        {/* ── Error state ──────────────────────────────────────────────────── */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
            <span className="text-4xl">⚠️</span>
            <p className="text-gray-500 text-sm">ছবি লোড করা যায়নি।</p>
            <button
              onClick={() => {
                setError(false);
                setLoaded(false);
              }}
              className="mt-2 px-4 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        )}

        {/* ── Newspaper image ───────────────────────────────────────────────
            The outer div width is driven by the zoom level.
            At 100% → fills the scroll container width (readable).
            At 150% → wider than the container → horizontal scrollbar appears.
            min-w-[600px] ensures it's never too squished on small screens.

            We wrap in a centering div so at small zoom levels (75%) the
            image stays centred rather than left-aligned.
        */}
        <div className="flex justify-center min-h-full py-4 px-4">
          <div
            style={{ width: `${zoom}%`, minWidth: "600px", maxWidth: "1400px" }}
            className="bg-white shadow-xl transition-[width] duration-200"
          >
            <img
              key={currentPage.fullImage}
              src={currentPage.fullImage}
              alt={`পৃষ্ঠা ${currentPage.pageNumber}`}
              className={`w-full h-auto select-none block transition-opacity duration-300 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
              loading="eager"
              decoding="async"
              draggable={false}
              onLoad={() => setLoaded(true)}
              onError={() => {
                setLoaded(true);
                setError(true);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;