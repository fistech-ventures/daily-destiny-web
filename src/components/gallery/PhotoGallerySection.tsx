"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface GalleryItem {
  id: string | number;
  url: string;
  title: string;
  description?: string;
  timeAgo: string;
  photographer?: string;
  code: string;
}

interface PhotoGallerySectionProps {
  items: GalleryItem[];
  title?: string;
}

export default function PhotoGallerySection({
  items = [],
  title = "ফটো গ্যালারি",
}: PhotoGallerySectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const { locale } = useParams();

  // 1. Move ALL Hooks to the top level (before any conditional returns)
  useEffect(() => {
    if (!isAutoPlay || items.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex(prev => (prev === items.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay, items.length]);

  const handlePrev = useCallback(() => {
    if (items.length === 0) return;
    setActiveIndex(prev => (prev === 0 ? items.length - 1 : prev - 1));
    setIsAutoPlay(false);
  }, [items.length]);

  const handleNext = useCallback(() => {
    if (items.length === 0) return;
    setActiveIndex(prev => (prev === items.length - 1 ? 0 : prev + 1));
    setIsAutoPlay(false);
  }, [items.length]);

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
    setIsAutoPlay(false);
  };



  // 2. NOW you can safely perform your early return check
  if (!items || items.length === 0) return null;

  const activeItem = items[activeIndex];

  return (
    <div className="w-full bg-white rounded-lg overflow-hidden">
      {/* Title Section */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <Link
          href={`/${locale}/gallery/${activeItem.code}`}
          className="flex items-center gap-2 group"
        >
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-red-600 pb-1">
            {title}
          </h2>
          <ChevronRight className="h-5 w-5 text-red-600 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Main Content: 3/4 Image + 1/4 Thumbnails */}
      <div className="flex gap-4 p-6">
        {/* LEFT SIDE: Main Image (75%) */}
        <div className="w-3/4 flex flex-col gap-4">
          <Link href={`/gallery/${activeItem.code}`}>
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group shadow-lg">
              <img
                src={activeItem.url}
                alt={activeItem.title}
                className="w-full h-full object-cover transition-all duration-500"
              />

              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded text-xs font-semibold text-white">
                {activeIndex + 1} / {items.length}
              </div>

              <button
                onClick={e => {
                  e.preventDefault();
                  handlePrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                aria-label="Previous"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={e => {
                  e.preventDefault();
                  handleNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                aria-label="Next"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded text-xs text-white font-semibold">
                {isAutoPlay ? "▶ Auto" : "⏸ Manual"}
              </div>
            </div>
          </Link>

          <div>
            <Link href={`/articles/by-code/${activeItem.code}`}>
              <h3 className="text-lg font-bold text-gray-900 hover:text-red-600 transition-colors cursor-pointer line-clamp-2">
                {activeItem.title}
              </h3>
            </Link>
            <p className="text-xs text-gray-400 mt-1">{activeItem.timeAgo}</p>
          </div>
        </div>

        {/* RIGHT SIDE: Thumbnails (25%) */}
        <div className="w-1/4 flex flex-col gap-3">
          <div
            className="flex flex-col gap-3 max-h-[500px] overflow-y-auto scroll-smooth"
          >
            {items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleThumbnailClick(index)}
                className={`relative rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 aspect-video group ${
                  activeIndex === index
                    ? "border-red-600 "
                    : "border-gray-300 opacity-70 hover:opacity-100 hover:border-red-400"
                }`}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {activeIndex === index && (
                  <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                    <ChevronRight className="h-6 w-6 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
