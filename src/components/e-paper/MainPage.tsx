"use client";

import React, { useState, useEffect, useRef } from "react";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import type { EpaperViewPage } from "./PaperSlider";

interface MainPageProps {
  pages: EpaperViewPage[];
  activeIndex: number;
}

const ZOOM_LEVELS = [75, 100, 125, 150, 200];

interface HotSpot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  url: string;
}

// ─── Hotspots by PAGE NUMBER (matches your API pageNumber) ──────────────────
const HOTSPOTS_BY_PAGE: Record<number, HotSpot[]> = {
  1: [
    // পাতা ১ (মুল পাতা)
    {
      id: "page1-article-1",
      x: 50,
      y: 100,
      width: 300,
      height: 200,
      title: "প্রধান খবর",
      url: "/news/main-story-1",
    },
    {
      id: "page1-article-2",
      x: 400,
      y: 100,
      width: 250,
      height: 150,
      title: "দ্বিতীয় খবর",
      url: "/news/article-2",
    },
  ],
  2: [
    // পাতা २
    {
      id: "page2-article-1",
      x: 30,
      y: 80,
      width: 400,
      height: 180,
      title: "পাতা २ এর খবর",
      url: "/news/page2-article-1",
    },
  ],
  3: [
    // পাতা ३
    {
      id: "page3-article-1",
      x: 50,
      y: 120,
      width: 350,
      height: 200,
      title: "পাতা ३ এর খবর",
      url: "/news/page3-article-1",
    },
  ],
  4: [
    // পাতা ४
    {
      id: "page4-article-1",
      x: 40,
      y: 100,
      width: 400,
      height: 180,
      title: "পাতা ४ এর খবর",
      url: "/news/page4-article-1",
    },
  ],
  5: [
    // পাতা ५
    {
      id: "page5-article-1",
      x: 60,
      y: 110,
      width: 380,
      height: 190,
      title: "পাতা ५ এর খবর",
      url: "/news/page5-article-1",
    },
  ],
  6: [
    // পাতা ६
    {
      id: "page6-article-1",
      x: 45,
      y: 95,
      width: 390,
      height: 200,
      title: "পাতা ६ এর খবর",
      url: "/news/page6-article-1",
    },
  ],
  7: [
    // पाता ७
    {
      id: "page7-article-1",
      x: 55,
      y: 105,
      width: 370,
      height: 185,
      title: "पाता ७ এর খবর",
      url: "/news/page7-article-1",
    },
  ],
  8: [
    // শেষ পাতা
    {
      id: "page8-article-1",
      x: 50,
      y: 100,
      width: 400,
      height: 200,
      title: "শেষ পাতার খবর",
      url: "/news/page8-article-1",
    },
  ],
};

const MainPage: React.FC<MainPageProps> = ({ pages, activeIndex }) => {
  const currentPage = pages[activeIndex];
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const prevIndexRef = useRef(activeIndex);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prevIndexRef.current !== activeIndex) {
      prevIndexRef.current = activeIndex;
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, left: 0 });
      }
    }

    if (imageRef.current) {
      if (imageRef.current.complete) {
        if (imageRef.current.naturalWidth === 0) {
          setError(true);
        } else {
          setError(false);
        }
        setLoaded(true);
      } else {
        setLoaded(false);
        setError(false);
      }
    } else {
      setLoaded(false);
      setError(false);
    }
  }, [activeIndex, currentPage?.fullImage]);

  if (!currentPage) return null;

  const zoom = ZOOM_LEVELS[zoomIndex];
  const canZoomIn = zoomIndex < ZOOM_LEVELS.length - 1;
  const canZoomOut = zoomIndex > 0;

  // ─── Get hotspots using the pageNumber from your API ──────────────────
  const pageNum = parseInt(currentPage.pageNumber) || activeIndex + 1;
  const hotspots = HOTSPOTS_BY_PAGE[pageNum] || [];

  const handleAreaClick = (url: string) => {
    window.location.href = url;
  };

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
          className="p-1.5 rounded-full hover-bg-brand disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
          className="p-1.5 rounded-full hover-bg-brand disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ZoomIn size={16} className="text-gray-700" />
        </button>

        <div className="w-px h-4 bg-gray-200 mx-0.5" />

        <button
          onClick={() => setZoomIndex(1)}
          title="রিসেট"
          className="p-1.5 rounded-full hover-bg-brand transition-colors"
        >
          <Maximize2 size={16} className="text-gray-700" />
        </button>
      </div>

      {/* ── Scroll container ──────────────────────────────────────────────── */}
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

        {/* ── Newspaper image with hotspots overlay ──────────────────────────── */}
        <div className="flex justify-center min-h-full py-4 px-4">
          <div
            ref={containerRef}
            style={{ width: `${zoom}%`, minWidth: "600px", maxWidth: "1400px" }}
            className="bg-white shadow-xl transition-[width] duration-200 relative overflow-hidden"
          >
            {/* Main image */}
            <img
              ref={imageRef}
              key={currentPage.fullImage}
              src={currentPage.fullImage}
              alt={`${currentPage.section}`}
              className={`w-full h-auto select-none block transition-opacity duration-300 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
              loading="eager"
              decoding="async"
              draggable={false}
              onLoad={e => {
                setLoaded(true);
                setError(false);
                const img = e.currentTarget;
                setImageSize({
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                });
              }}
              onError={() => {
                setLoaded(true);
                setError(true);
              }}
            />

            {/* SVG Overlay - Clickable hotspots */}
            {loaded &&
              imageSize.width > 0 &&
              hotspots.length > 0 &&
              containerRef.current && (
                <svg
                  className="absolute top-0 left-0 w-full h-full cursor-pointer"
                  viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
                  preserveAspectRatio="none"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    pointerEvents: "auto",
                  }}
                >
                  {hotspots.map(spot => (
                    <g key={spot.id} style={{ cursor: "pointer" }}>
                      <rect
                        x={spot.x}
                        y={spot.y}
                        width={spot.width}
                        height={spot.height}
                        fill={
                          hoveredId === spot.id
                            ? "rgba(239, 68, 68, 0.25)"
                            : "transparent"
                        }
                        stroke={
                          hoveredId === spot.id
                            ? "rgb(239, 68, 68)"
                            : "transparent"
                        }
                        strokeWidth="2"
                        rx="4"
                        onClick={() => handleAreaClick(spot.url)}
                        onMouseEnter={() => setHoveredId(spot.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                        }}
                      />

                      <title>{spot.title}</title>

                      {hoveredId === spot.id && (
                        <>
                          <rect
                            x={spot.x}
                            y={spot.y - 28}
                            width={Math.max(
                              spot.width,
                              spot.title.length * 6 + 12,
                            )}
                            height="24"
                            fill="rgb(239, 68, 68)"
                            rx="4"
                            opacity="0.9"
                            pointerEvents="none"
                          />
                          <text
                            x={spot.x + spot.width / 2}
                            y={spot.y - 10}
                            textAnchor="middle"
                            fill="white"
                            fontSize="12"
                            fontWeight="600"
                            style={{
                              pointerEvents: "none",
                              userSelect: "none",
                            }}
                          >
                            {spot.title}
                          </text>
                        </>
                      )}
                    </g>
                  ))}
                </svg>
              )}

            {/* Debug: Show page number and hotspot count */}
            {loaded && (
              <div className="absolute bottom-2 left-2 text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">
                Page {pageNum} • {hotspots.length} hotspot(s)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
