"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Facebook,
  Twitter,
  Printer,
  Share2,
  X,
} from "lucide-react";
import AdBanner from "@/components/shared/ad-banner";

interface Hotspot {
  id: string;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  title: string | null;
}

interface Page {
  id: string;
  pageNumber: number;
  imageUrl: string;
  hotspots: Hotspot[];
}

interface Edition {
  id: string;
  publishDate: string;
  pages: Page[];
}

interface VisualEpaperSliderProps {
  edition: Edition | null;
  currentDate: string | null;
  availableDates: string[];
}

interface ImageDimensions {
  width: number;
  height: number;
}

export default function VisualEpaperSlider({
  edition,
  currentDate,
}: VisualEpaperSliderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  // Natural pixel dimensions of the currently loaded page image.
  // Needed to correct the crop wrapper's aspect ratio, since hotspot
  // coordinates are normalized (0-1) fractions of the image, not raw
  // pixel ratios. Without this correction, non-square page images
  // produce a distorted/stretched crop.
  const [imgDimensions, setImgDimensions] = useState<ImageDimensions | null>(
    null,
  );

  if (!edition || !edition.pages || edition.pages.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center text-gray-500 font-medium">
        No e-paper edition found for this date.
      </div>
    );
  }

  const currentPage = edition.pages[activePageIndex];
  const totalPages = edition.pages.length;

  const handlePageChange = (index: number) => {
    if (index >= 0 && index < totalPages) {
      setActivePageIndex(index);
      setSelectedHotspot(null);
      // Reset dimensions so the crop panel waits for the new page's
      // image to load before rendering (avoids using stale ratios).
      setImgDimensions(null);
    }
  };

  // Safely updates browser search query matching your sanitized API params layout
  const handleDateChange = (newDate: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newDate && !newDate.includes("NaN")) {
      params.set("date", newDate);
    } else {
      params.delete("date");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full p-2 md:p-4 flex flex-col gap-4 select-none">
      {/* 1. TOP NAVBAR / CONTROL BAR */}
      <div className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 h-fit">
        {/* Left Side: Date Picker & Edition Mode */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <input
            type="date"
            value={currentDate || ""}
            onChange={e => handleDateChange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white font-medium text-gray-700 outline-none cursor-pointer"
          />
        </div>

        {/* Center: Pagination controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => handlePageChange(activePageIndex - 1)}
            disabled={activePageIndex === 0}
            className="p-1.5 border rounded bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 max-w-[200px] overflow-x-auto py-1">
            {edition.pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx)}
                className={`w-7 h-7 shrink-0 flex items-center justify-center text-xs font-semibold rounded transition ${
                  activePageIndex === idx
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "border bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(activePageIndex + 1)}
            disabled={activePageIndex === totalPages - 1}
            className="p-1.5 border rounded bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-sm font-medium text-gray-600 ml-1">
            {currentPage.pageNumber}/{totalPages} পাতা
          </span>
          <button className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium text-xs rounded hover:bg-emerald-100 transition">
            সব পাতা
          </button>
        </div>

        {/* Right Side: Share Utilities */}
        <div className="flex items-center justify-center gap-3 text-gray-500 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0">
          <span className="text-xs font-medium">শেয়ার :</span>
          <button className="p-1 hover:text-blue-600 transition">
            <Facebook className="w-4 h-4" />
          </button>
          <button className="p-1 hover:text-green-500 transition">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-1 hover:text-sky-500 transition">
            <Twitter className="w-4 h-4" />
          </button>
          <button className="p-1 hover:text-gray-900 transition">
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. MAIN RESPONSIVE WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-12 gap-4 h-fit items-start">
        {/* COLUMN A: Left Page Thumbnail Strip (Clean background, auto-height fit) */}
        <div className="lg:col-span-1 xl:col-span-1 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto p-1 h-fit max-h-[20vh] lg:max-h-[85vh]">
          {edition.pages.map((page, idx) => (
            <div
              key={page.id}
              onClick={() => handlePageChange(idx)}
              className={`cursor-pointer rounded border p-1 shrink-0 w-24 lg:w-full transition flex flex-col items-center ${
                activePageIndex === idx
                  ? "border-emerald-500 bg-emerald-50/50 shadow-sm"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <div className="relative w-full aspect-[3/4] bg-gray-100 rounded overflow-hidden">
                <Image
                  src={page.imageUrl}
                  alt={`Thumbnail ${page.pageNumber}`}
                  fill
                  sizes="(max-width: 1024px) 100px, 200px"
                  className="object-cover"
                />
              </div>
              <span
                className={`text-[11px] mt-1 font-medium px-2 py-0.5 rounded-full ${
                  activePageIndex === idx
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                পাতা {page.pageNumber}
              </span>
            </div>
          ))}
        </div>

        {/* COLUMN B: Center Interactive Canvas Mapping */}
        <div className="lg:col-span-2 xl:col-span-5 bg-white border border-gray-200 rounded-lg p-2 md:p-4 flex justify-center items-start h-fit shadow-sm">
          <div className="relative w-full aspect-[3/4] border border-gray-100 bg-gray-50">
            <Image
              src={currentPage.imageUrl}
              alt={`Page ${currentPage.pageNumber}`}
              fill
              sizes="(max-width: 1280px) 100vw, 50vw"
              priority
              className="object-contain"
              onLoad={e => {
                const img = e.currentTarget;
                if (img.naturalWidth && img.naturalHeight) {
                  setImgDimensions({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                  });
                }
              }}
            />

            {/* Interactive Hotspot Matrix Layers */}
            {currentPage.hotspots?.map(hotspot => (
              <div
                key={hotspot.id}
                onClick={() => setSelectedHotspot(hotspot)}
                style={{
                  left: `${hotspot.coordinates.x * 100}%`,
                  top: `${hotspot.coordinates.y * 100}%`,
                  width: `${hotspot.coordinates.width * 100}%`,
                  height: `${hotspot.coordinates.height * 100}%`,
                }}
                className={`absolute cursor-pointer border transition-all duration-150 ${
                  selectedHotspot?.id === hotspot.id
                    ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20"
                    : "border-transparent hover:border-red-500 hover:bg-red-500/10"
                }`}
                title={hotspot.title || "সংবাদ দেখতে ক্লিক করুন"}
              />
            ))}
          </div>
        </div>

        {/* COLUMN C: Right-hand Isolated Full-Width Crisp Snippet Panel */}
        <div className="lg:col-span-1 xl:col-span-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col h-fit">
          <div className="p-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700 text-sm flex justify-between items-center">
            <span>বিস্তারিত সংবাদ ভিউ</span>
            {selectedHotspot && (
              <button
                onClick={() => setSelectedHotspot(null)}
                className="text-gray-400 hover:text-red-500 p-1 transition rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="p-2 md:p-4 flex flex-col items-center justify-start h-fit">
            {selectedHotspot && imgDimensions ? (
              <div className="w-full flex flex-col items-center gap-3">
                {/* Isolated Crop Space Wrapper
                    NOTE: hotspot.coordinates.width/height are normalized
                    (0-1) fractions of the source image, NOT raw pixel
                    aspect ratios. To get the crop's true visual aspect
                    ratio we must multiply by the image's actual natural
                    pixel dimensions, otherwise non-square source images
                    render a distorted/stretched crop. */}
                <div
                  className="relative w-full border border-gray-200 bg-white shadow-sm rounded overflow-hidden"
                  style={{
                    aspectRatio: `${
                      selectedHotspot.coordinates.width * imgDimensions.width
                    } / ${
                      selectedHotspot.coordinates.height * imgDimensions.height
                    }`,
                    width: "100%",
                  }}
                >
                  <div
                    className="absolute"
                    style={{
                      width: `${100 / selectedHotspot.coordinates.width}%`,
                      height: `${100 / selectedHotspot.coordinates.height}%`,
                      left: `${-selectedHotspot.coordinates.x * (100 / selectedHotspot.coordinates.width)}%`,
                      top: `${-selectedHotspot.coordinates.y * (100 / selectedHotspot.coordinates.height)}%`,
                    }}
                  >
                    {/* Do NOT add object-contain/object-cover here.
                        This image must stretch (default fill behavior)
                        to exactly fill the oversized, offset inner div
                        above — that's what produces the accurate crop.
                        The outer wrapper's corrected aspect ratio is
                        what prevents visible distortion. */}
                    <Image
                      src={currentPage.imageUrl}
                      alt="Crisp High-Res Isolated Snippet View"
                      fill
                      unoptimized
                      priority
                    />
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 font-medium">
                  * নির্বাচিত সংবাদটি আলাদাভাবে প্রদর্শিত হচ্ছে
                </p>
              </div>
            ) : selectedHotspot && !imgDimensions ? (
              // Hotspot picked but the main image hasn't reported its
              // natural dimensions yet (e.g. page just changed) — show
              // a lightweight loading state instead of a distorted crop.
              <div className="w-full aspect-[3/4] flex items-center justify-center text-gray-400 text-sm">
                লোড হচ্ছে...
              </div>
            ) : (
              <div className="my-auto py-20 flex flex-col items-center justify-center text-center text-gray-400">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3 text-gray-300">
                  <Share2 className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-gray-600">
                  কোনো সংবাদ নির্বাচন করা হয়নি
                </p>
                <p className="text-xs text-gray-400 mt-1 max-w-[220px]">
                  পড়তে বাম দিকের পত্রিকার যেকোনো খবরের উপর ক্লিক করুন।
                </p>
              </div>
            )}
          </div>

          {/* Advertisement at bottom of right column */}
          <div className="p-2 md:p-4 border-t border-gray-200">
            <AdBanner className="rounded-lg" altText="ই-পেপার বিজ্ঞাপন" />
          </div>
        </div>
      </div>
    </div>
  );
}
