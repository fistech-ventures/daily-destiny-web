"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import type { EpaperVisualEdition, Hotspot } from "@/lib/api";
import { toBengaliNumber, formatBengaliDate } from "./bengali-utils";

// ─── Props ──────────────────────────────────────────────────────────────────
interface VisualEpaperSliderProps {
  edition: EpaperVisualEdition | null;
  availableDates: string[];
  currentDate: string | null;
}

// ─── Component ──────────────────────────────────────────────────────────────
const VisualEpaperSlider: React.FC<VisualEpaperSliderProps> = ({
  edition,
  availableDates,
  currentDate,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const pages = edition?.pages ?? [];
  const sortedPages = useMemo(
    () => [...pages].sort((a, b) => a.pageNumber - b.pageNumber),
    [pages],
  );

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const [mainImageError, setMainImageError] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const mainImageRef = useRef<HTMLImageElement>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const currentPage = sortedPages[activePageIndex];

  // Reset loading state when page changes (synchronous — runs before render)
  const navigateToPage = useCallback((newIndex: number) => {
    setMainImageLoaded(false);
    setMainImageError(false);
    setImageDimensions({ width: 0, height: 0 });
    setSelectedHotspot(null);
    setHoveredHotspotId(null);
    setActivePageIndex(newIndex);
  }, []);

  // Reset when edition changes
  useEffect(() => {
    setActivePageIndex(0);
    setSelectedHotspot(null);
    setHoveredHotspotId(null);
    setMainImageLoaded(false);
    setMainImageError(false);
    setImageDimensions({ width: 0, height: 0 });
  }, [edition?.id]);

  // Scroll active thumbnail into view
  useEffect(() => {
    const container = thumbnailContainerRef.current;
    if (!container) return;
    const thumb = container.children[activePageIndex] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activePageIndex]);

    useEffect(() => {
    if (!sortedPages.length) return;

    // Preload 1 page ahead and 1 page behind so navigation feels instant
    const indices = [activePageIndex - 1, activePageIndex + 1]
      .filter(idx => idx >= 0 && idx < sortedPages.length);

    indices.forEach(idx => {
      const img = new Image();
      img.src = sortedPages[idx].imageUrl;
    });
  }, [activePageIndex, sortedPages]);

  // ─── Date picker ──────────────────────────────────────────────────────────
  const handleDateChange = (newDate: string) => {
    if (!newDate || newDate === currentDate) return;
    router.push(`${pathname}?date=${newDate}`);
  };

  const DatePicker = () =>
    availableDates.length > 0 ? (
      <label className="flex items-center gap-1.5 text-xs text-gray-500">
        <Calendar size={14} className="text-gray-400" />
        <select
          value={currentDate ?? ""}
          onChange={e => handleDateChange(e.target.value)}
          className="bg-transparent text-gray-700 font-medium text-xs md:text-sm
                     border border-gray-200 rounded px-2 py-1 cursor-pointer
                     focus:outline-none focus:ring-1 focus:ring-red-400"
        >
          {availableDates.map(d => (
            <option key={d} value={d}>
              {formatBengaliDate(d)}
            </option>
          ))}
        </select>
      </label>
    ) : null;

  // ─── Empty state ─────────────────────────────────────────────────────────
  if (!edition || !sortedPages.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 bg-[#f5f5f5] px-4">
        <span className="text-4xl">📰</span>
        <p className="text-gray-500 text-sm text-center">
          এই তারিখের জন্য কোনো ই-পেপার পাওয়া যায়নি।
        </p>
        <DatePicker />
      </div>
    );
  }

  // ─── Preload adjacent images ────────────────────────────────────────────

  const handleHotspotClick = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot);
  };

  const handlePrev = () => {
    navigateToPage(Math.max(activePageIndex - 1, 0));
  };

  const handleNext = () => {
    navigateToPage(Math.min(activePageIndex + 1, sortedPages.length - 1));
  };

  const handleThumbnailClick = (index: number) => {
    navigateToPage(index);
  };

  const isFirst = activePageIndex === 0;
  const isLast = activePageIndex === sortedPages.length - 1;

  
  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] overflow-hidden">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between gap-3 px-5 py-2.5 bg-white border-b shadow-sm shrink-0 z-10">
        <span className="font-medium text-gray-700 text-sm md:text-base leading-tight truncate">
          ই-পেপার ভিজুয়াল
          <span className="mx-1.5 text-gray-300">•</span>
          পৃষ্ঠা {toBengaliNumber(currentPage.pageNumber)}
        </span>
        <div className="flex items-center gap-3 shrink-0">
          <DatePicker />
          <span className="text-xs text-gray-400 tabular-nums">
            {toBengaliNumber(activePageIndex + 1)} /{" "}
            {toBengaliNumber(sortedPages.length)}
          </span>
        </div>
      </header>

      {/* ── Main 5-column layout ───────────────────────────────────────────── */}
      <main className="flex-1 flex overflow-hidden">
        {/* ─── Column 1: Vertical Thumbnail Slider ──────────────────────────── */}
        <aside className="w-[120px] shrink-0 bg-[#1e1e1e] border-r border-[#111] flex flex-col overflow-hidden">
          <div className="text-xs text-gray-400 text-center py-2 border-b border-[#333] font-medium">
            পৃষ্ঠাসমূহ
          </div>
          <div
            ref={thumbnailContainerRef}
            className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-2"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#555 transparent" }}
          >
            {sortedPages.map((page: { id: string; pageNumber: number; imageUrl: string }, index: number) => (
              <button
                key={page.id}
                onClick={() => handleThumbnailClick(index)}
                className={`flex-none w-full rounded overflow-hidden border-2 transition-all duration-200 ${
                  index === activePageIndex
                    ? "border-red-500 shadow-md shadow-red-500/30 scale-105"
                    : "border-transparent opacity-60 hover:opacity-90"
                }`}
              >
                <img
                  src={page.imageUrl}
                  alt={`পৃষ্ঠা ${page.pageNumber}`}
                  className="w-full aspect-[2/3] object-cover"
                  loading={index < 4 ? "eager" : "lazy"}
                />
              </button>
            ))}
          </div>

          {/* Page navigation arrows */}
          <div className="flex items-center justify-between px-2 py-2 border-t border-[#333]">
            <button
              onClick={handlePrev}
              disabled={isFirst}
              className="p-1 rounded text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-[11px] text-gray-500 tabular-nums">
              {toBengaliNumber(activePageIndex + 1)}
            </span>
            <button
              onClick={handleNext}
              disabled={isLast}
              className="p-1 rounded text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </aside>

        {/* ─── Columns 2-3: Main Image ──────────────────────────────────────── */}
        <section className="flex-[2] flex flex-col overflow-hidden relative bg-gray-300 min-w-0">
          {/* Loading spinner */}
          {!mainImageLoaded && !mainImageError && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border-4 border-red-200 border-t-red-600 animate-spin" />
                <span className="text-sm text-gray-600 font-medium bg-white/70 px-3 py-1 rounded-full">
                  লোড হচ্ছে…
                </span>
              </div>
            </div>
          )}

          {/* Error state */}
          {mainImageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
              <span className="text-4xl">⚠️</span>
              <p className="text-gray-500 text-sm">ছবি লোড করা যায়নি।</p>
              <button
                onClick={() => {
                  setMainImageError(false);
                  setMainImageLoaded(false);
                }}
                className="mt-2 px-4 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                আবার চেষ্টা করুন
              </button>
            </div>
          )}

          {/* ── Image with hotspot click areas ───────────────────────────────── */}
          <div className="flex-1 flex items-center justify-center p-1 overflow-hidden">
            <div className="relative inline-block max-w-full max-h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />

              {/* Container that matches image aspect ratio once dimensions are known */}
              <div
                className="relative"
                style={
                  imageDimensions.width > 0
                    ? ({
                        aspectRatio: `${imageDimensions.width} / ${imageDimensions.height}`,
                        maxWidth: "100%",
                        maxHeight: "calc(100vh - 120px)",
                      } as React.CSSProperties)
                    : undefined
                }
              >
                <img
                  ref={mainImageRef}
                  src={currentPage.imageUrl}
                  alt={`পৃষ্ঠা ${currentPage.pageNumber}`}
                  className={`select-none transition-opacity duration-500 ${
                    imageDimensions.width > 0
                      ? "block w-full h-full"
                      : "relative max-w-full max-h-[calc(100vh-120px)] object-contain"
                  } ${mainImageLoaded ? "opacity-100" : "opacity-0"}`}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  draggable={false}
                  onLoad={e => {
                    setMainImageLoaded(true);
                    setMainImageError(false);
                    const img = e.currentTarget;
                    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
                  }}
                  onError={() => {
                    setMainImageLoaded(true);
                    setMainImageError(true);
                  }}
                />

                {/* Hotspot overlay — invisible by default, shows on hover/selection */}
                {imageDimensions.width > 0 && mainImageLoaded && currentPage.hotspots.length > 0 && (
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox={`0 0 ${imageDimensions.width} ${imageDimensions.height}`}
                    preserveAspectRatio="xMidYMid meet"
                    style={{ pointerEvents: "auto" }}
                  >
                    {currentPage.hotspots.map((hotspot: Hotspot) => {
                      const imgW = imageDimensions.width;
                      const imgH = imageDimensions.height;
                      return (
                        <g key={hotspot.id}>
                          <rect
                            x={hotspot.coordinates.x * imgW}
                            y={hotspot.coordinates.y * imgH}
                            width={hotspot.coordinates.width * imgW}
                            height={hotspot.coordinates.height * imgH}
                            fill={
                              selectedHotspot?.id === hotspot.id
                                ? "rgba(239, 68, 68, 0.25)"
                                : hoveredHotspotId === hotspot.id
                                  ? "rgba(59, 130, 246, 0.15)"
                                  : "transparent"
                            }
                            stroke={
                              selectedHotspot?.id === hotspot.id
                                ? "rgb(239, 68, 68)"
                                : hoveredHotspotId === hotspot.id
                                  ? "rgb(59, 130, 246)"
                                  : "transparent"
                            }
                            strokeWidth={
                              selectedHotspot?.id === hotspot.id ? 3 : hoveredHotspotId === hotspot.id ? 2 : 0
                            }
                            className="cursor-pointer transition-all duration-150"
                            rx="3"
                            onMouseEnter={() => setHoveredHotspotId(hotspot.id)}
                            onMouseLeave={() => setHoveredHotspotId(null)}
                            onClick={() => handleHotspotClick(hotspot)}
                          />
                          {selectedHotspot?.id === hotspot.id && (
                            <text
                              x={
                                (hotspot.coordinates.x +
                                  hotspot.coordinates.width / 2) *
                                imgW
                              }
                              y={
                                (hotspot.coordinates.y - 0.015) *
                                imgH
                              }
                              textAnchor="middle"
                              fill="rgb(239, 68, 68)"
                              fontSize="14"
                              fontWeight="600"
                              style={{ pointerEvents: "none", userSelect: "none" }}
                            >
                              {hotspot.title || "হটস্পট"}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Columns 4-5: Zoomed Hotspot View ──────────────────────────────── */}
        <aside className="flex-[2] flex flex-col overflow-hidden bg-white border-l border-gray-200 min-w-0">
          {/* Header */}
          <div className="shrink-0 px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700">
              {selectedHotspot
                ? selectedHotspot.title || "বিস্তারিত দৃশ্য"
                : "বিস্তারিত দৃশ্য"}
            </h3>
            {selectedHotspot && (
              <p className="text-xs text-gray-400 mt-0.5">
                হটস্পট এলাকা (জুম ভিউ)
              </p>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4 flex items-start justify-center">
            {selectedHotspot ? (
              <div className="w-full">
                {/* Zoomed image via background-image — crops precisely into the hotspot area */}
                <div
                  className="relative w-full object-contain overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-gray-100"
                  style={{
                    aspectRatio: `${selectedHotspot.coordinates.width} / ${selectedHotspot.coordinates.height}`,
                    minHeight: 280,
                    backgroundImage: `url(${currentPage.imageUrl})`,
                    backgroundSize: `${(1 / selectedHotspot.coordinates.width) * 100}% ${(1 / selectedHotspot.coordinates.height) * 100}%`,
                    backgroundPosition: `${(selectedHotspot.coordinates.x / (1 - selectedHotspot.coordinates.width || 1)) * 100}% ${(selectedHotspot.coordinates.y / (1 - selectedHotspot.coordinates.height || 1)) * 100}%`,
                    backgroundRepeat: "no-repeat",
                  }}
                />

                {/* Hotspot info card */}
                {/* <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">
                      অবস্থান
                    </span>
                    <span className="text-xs text-gray-400 tabular-nums">
                      X: {(selectedHotspot.coordinates.x * 100).toFixed(1)}% · Y:{" "}
                      {(selectedHotspot.coordinates.y * 100).toFixed(1)}%
                    </span>
                  </div>
                  {selectedHotspot.title && (
                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {selectedHotspot.title}
                    </p>
                  )}
                  <div className="mt-2 flex gap-3 text-xs text-gray-400">
                    <span>প্রস্থ: {(selectedHotspot.coordinates.width * 100).toFixed(1)}%</span>
                    <span>উচ্চতা: {(selectedHotspot.coordinates.height * 100).toFixed(1)}%</span>
                  </div>                
                  
                  </div> */}
              </div>
            ) : (
              /* Empty state — prompt user to click a hotspot */
              <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-12">
                <div className="w-14 h-14 rounded-full bg-blue-50 border-2 border-dashed border-blue-200 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-400 max-w-[200px]">
                  বাম পাশের ছবিতে একটি হটস্পট এলাকায় ক্লিক করে জুম করে দেখুন
                </p>
                {currentPage.hotspots.length > 0 && (
                  <p className="text-xs text-gray-300">
                    এই পৃষ্ঠায় {currentPage.hotspots.length} টি হটস্পট রয়েছে
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Hotspot list at bottom */}
          {/* {currentPage.hotspots.length > 0 && (
            <div className="shrink-0 border-t border-gray-200 px-4 py-3 bg-gray-50/50">
              <p className="text-[11px] text-gray-400 font-medium mb-2">
                হটস্পট তালিকা ({currentPage.hotspots.length})
              </p>
              <div
                className="flex gap-2 overflow-x-auto pb-1"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#ddd transparent" }}
              >
                {currentPage.hotspots.map((h: Hotspot, idx: number) => (
                  <button
                    key={h.id}
                    onClick={() => handleHotspotClick(h)}
                    className={`shrink-0 text-xs px-2.5 py-1 rounded-full border transition-all ${
                      selectedHotspot?.id === h.id
                        ? "bg-red-50 border-red-300 text-red-700 font-medium"
                        : "bg-white border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600"
                    }`}
                  >
                    {h.title || `হটস্পট ${toBengaliNumber(idx + 1)}`}
                  </button>
                ))}
              </div>
            </div>
          )} */}
        </aside>
      </main>
    </div>
  );
};

export default VisualEpaperSlider;
