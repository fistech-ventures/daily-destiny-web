"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Camera, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import Link from "next/link";

interface GalleryItem {
  id: string | number;
  url: string;
  title: string;
  description?: string;
  timeAgo: string;
  photographer?: string;
  code?: string;
}

interface PhotoGallerySectionProps {
  items: GalleryItem[];
  title?: string;
}

export default function PhotoGallerySection({
  items = [],
  title = "ছবি",
}: PhotoGallerySectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 1. Wrap navigation handlers in useCallback to secure dependency safety
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  }, [items.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  }, [items.length]);

  // 2. Run the Autoplay Effect completely clear of conditional placements
  useEffect(() => {
    if (!isPlaying || items.length === 0) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isPlaying, items.length, handleNext]);

  // 3. Early escape clause can now be called safely down here!
  if (!items || items.length === 0) return null;

  const activeItem = items[activeIndex];
  const sidebarItems = items.filter((_, idx) => idx !== activeIndex).slice(0, 4);

  return (
    <div className="w-full bg-white p-4 rounded-md flex flex-col gap-5 select-none">
      
      {/* Top Section Header Row */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <Link href="/gallery" className="flex items-center gap-1.5 group cursor-pointer">
          <h2 className="text-xl font-bold text-gray-900 border-b-2 border-red-600 pb-2 -mb-[10px]">
            {title}
          </h2>
          <ChevronRight className="h-5 w-5 text-red-600 mt-0.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Core Split Dashboard Matrix Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Interactive Theater Block Frame */}
        <div className="lg:col-span-8 flex flex-col gap-3 w-full">
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group shadow-md">
            
            {/* Live Media Layer */}
            <img
              src={activeItem.url}
              alt={activeItem.title}
              className="w-full h-full object-contain mx-auto"
            />

            {/* Top-Left Index Counter Fragment */}
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded text-xs font-medium text-white tracking-wider">
              {activeIndex + 1} / {items.length}
            </div>

            {/* Top-Right Action Control Utility Palette */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handlePrev}
                className="p-1.5 bg-black/60 hover:bg-black/80 rounded text-white transition-colors"
                aria-label="Previous slide photo"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 bg-black/60 hover:bg-black/80 rounded text-white transition-colors"
                aria-label={isPlaying ? "Pause auto play loops" : "Start automatic playback sequence"}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 bg-black/60 hover:bg-black/80 rounded text-white transition-colors"
                aria-label="Next slide photo"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Bottom Descriptive Caption Layer Overlay */}
            {activeItem.description && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pt-12 text-gray-200 text-xs sm:text-sm leading-relaxed">
                <p className="line-clamp-2">{activeItem.description}</p>
                {activeItem.photographer && (
                  <span className="text-[11px] text-gray-400 mt-1 block">ছবি: {activeItem.photographer}</span>
                )}
              </div>
            )}
          </div>

          {/* Context Footer Metadata Stack */}
          <div className="flex flex-col gap-1 mt-1">
            <Link href={`/gallery/${activeItem.code || activeItem.id}`}>
              <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-snug hover:text-red-600 transition-colors cursor-pointer">
                {activeItem.title}
              </h3>
            </Link>
            <span className="text-xs text-gray-400 font-normal">{activeItem.timeAgo}</span>
          </div>
        </div>

        {/* Right Dynamic 2x2 Secondary Item Sidebar Deck Grid */}
        <div className="lg:col-span-4 w-full grid grid-cols-2 gap-4">
          {sidebarItems.map((item) => {
            const targetIndex = items.findIndex((i) => i.id === item.id);
            
            return (
              <div
                key={item.id}
                onClick={() => setActiveIndex(targetIndex)}
                className="flex flex-col gap-2 cursor-pointer group"
              >
                {/* Micro Thumbnail Wrapper Block */}
                <div className="relative w-full aspect-video rounded-md overflow-hidden bg-gray-50 shadow-sm border border-gray-100">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Absolute Red Camera Brand Floating Layout Badge */}
                  <div className="absolute bottom-2 left-2 h-5 w-5 rounded bg-red-600 flex items-center justify-center shadow-md shadow-black/20">
                    <Camera className="h-3 w-3 text-white" />
                  </div>
                </div>

                {/* Micro Title Context Text */}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-gray-400">{item.timeAgo}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}