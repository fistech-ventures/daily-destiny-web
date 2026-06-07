"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VideoArticle } from "@/lib/api";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";

interface VideoGalleryProps {
  initialVideos: VideoArticle[];
  initialMeta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function VideoGallery({
  initialVideos = [],
}: VideoGalleryProps) {
  const tCommon = useTranslations("common");

  const [videos] = useState<VideoArticle[]>(initialVideos);

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 bg-[#1e1e1e] rounded-md">
        <p className="text-gray-400 font-medium">
          {tCommon("noDataAvailable") || "কোনো তথ্য পাওয়া যায়নি"}
        </p>
      </div>
    );
  }

  // Segment layout to precisely mimic the asymmetric screenshot template
  const featuredVideo = videos[0];
  const gridVideos = videos.slice(1, 5);

  return (
    <div className="w-full bg-[#1e1e1e] p-4 md:p-6 rounded-md select-none text-white">
      {/* 1. Header Bar Section */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-5">
        <Link href="/videos" className="flex items-center gap-1.5 group">
          <h2 className="text-xl font-bold border-b-2 border-orange-500 pb-3 -mb-[14px]">
            ভিডিও
          </h2>
          <ChevronRight className="h-5 w-5 text-orange-500 mt-0.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* 2. Asymmetric Grid Workspace Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Large Featured Video Player Card Block */}
        {featuredVideo && (
          <div className="lg:col-span-7 flex flex-col bg-[#121212] rounded-md overflow-hidden group shadow-md border border-gray-900">
            <Link
              href={`/video/${featuredVideo.code}`}
              className="relative block w-full aspect-video overflow-hidden"
            >
              <img
                src={featuredVideo.coverImage || "/placeholder.jpg"}
                alt={featuredVideo.title}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-102"
              />
              {/* Play Overlay Anchor Icon Circle */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-lg">
                  <svg
                    className="w-7 h-7 fill-current pl-1"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Metadata Text Box Baseplate */}
            <div className="p-4 flex flex-col gap-1.5 bg-[#121212]">
              <Link
                href={`/video/${featuredVideo.code}`}
                className="hover:text-orange-400 transition-colors"
              >
                <h3 className="text-base md:text-xl font-bold leading-snug line-clamp-2">
                  {featuredVideo.title}
                </h3>
              </Link>
      
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: 2x2 Dense Grid Display Hub */}
        <div className="lg:col-span-5 grid grid-cols-1  gap-4">
          {gridVideos.map(video => (
            <div
              key={video.code}
              className="flex flex-col bg-[#121212] rounded-md overflow-hidden group border border-gray-900 shadow-sm" 
            >
              <Link
                href={`/video/${video.code}`}
                className="relative block w-full aspect-video overflow-hidden"
              >
                <img
                  src={video.coverImage || "/placeholder.jpg"}
                  alt={video.title}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-102"
                />
                {/* Embedded Mini Play Action Node */}
                <div className="absolute top-2 left-2">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white shadow-md">
                    <svg
                      className="w-3 h-3 fill-current pl-0.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Text Area Block */}
              <div className="p-3 flex flex-col gap-1 bg-[#121212] flex-1 justify-between">
                <Link
                  href={`/video/${video.code}`}
                  className="hover:text-orange-400 transition-colors"
                >
                  <h4 className="text-xs md:text-sm font-bold leading-snug line-clamp-2 text-gray-100">
                    {video.title}
                  </h4>
                </Link>
          
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
