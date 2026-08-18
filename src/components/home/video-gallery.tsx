"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VideoArticle } from "@/lib/api";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";

const getThumbnail = (video: VideoArticle): string => {
  if (video.source === "youtube" && video.key) {
    return `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`;
  }
  return video.coverImage || "/placeholder.jpg";
};

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
      <div className="flex items-center justify-center py-20 bg-accent rounded-md">
        <p className="text-gray-400 text-lg md:text-xl font-medium">
          {tCommon("noDataAvailable") || "কোনো তথ্য পাওয়া যায়নি"}
        </p>
      </div>
    );
  }

  // Take only the first 3 videos
  const displayVideos = videos.slice(0, 3);

  return (
    <div className="w-full bg-[#000058] p-4 md:p-6 rounded-md select-none text-white">
      {/* Header Bar Section */}
      <div className="flex items-center justify-between border-b border-[#1a1a7a] pb-3 mb-5">
        <Link href="/video" className="flex items-center gap-1.5 group">
          <h2 className="text-xl font-bold border-b-2 border-cyan-400  hover:text-cyan-400 pb-3 -mb-[14px]">
            ভিডিও
          </h2>
          <ChevronRight className="h-5 w-5 text-cyan-400 mt-0.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* 3-Column Grid with 16:9 Thumbnails */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {displayVideos.map(video => {
          const thumbnail = video.coverImage || getThumbnail(video);
          return (
            <div
              key={video.code}
              className="flex flex-col bg-[#0a0a4a] rounded-md overflow-hidden group shadow-md border border-[#1a1a7a]"
            >
              <Link
                href={`/video/${video.code}`}
                className="relative block w-full aspect-video overflow-hidden"
              >
                <img
                  src={thumbnail}
                  alt={video.title}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-102"
                />
                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-lg">
                    <svg
                      className="w-6 h-6 fill-current pl-1"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Title */}
              <div className="p-3 md:p-4 flex flex-col gap-1.5 bg-[#0a0a4a]">
                <Link
                  href={`/video/${video.code}`}
                  className="hover:text-cyan-400 transition-colors"
                >
                  <h3 className="text-sm md:text-base font-bold leading-snug text-gray-100"
                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}>
                    {video.title}
                  </h3>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
