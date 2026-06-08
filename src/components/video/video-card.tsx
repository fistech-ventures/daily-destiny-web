import React from "react";
import { VideoArticle } from "@/lib/api";

interface VideoCardProps {
  video: VideoArticle;
  variant?: "default" | "small" | "featured";
}

export default function VideoCard({
  video,
  variant = "default",
}: VideoCardProps) {
  return (
    // 1. Changed container layout to a flex column so text flows naturally below the image wrapper
    <div className="flex flex-col w-full h-full group cursor-pointer bg-transparent">
      {/* 2. Image Wrapper: Keeps the absolute overlays restricted only to the image segment */}
      <div className="relative w-full aspect-video rounded-md overflow-hidden shadow-xs">
        {/* Video Thumbnail */}
        <img
          src={video.coverImage || "/placeholder.jpg"}
          alt={video.title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-102 aspect-video"
        />

        {/* Center Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white/90 rounded-full flex items-center justify-center text-red-600 transition-transform group-hover:scale-110 shadow-md">
            {/* Play Icon Graphic */}
            <svg
              className="w-5 h-5 md:w-6 md:h-6 fill-current pl-0.5"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Text Content Container: Placed cleanly underneath the image box */}
      <div className="pt-3 pb-1 text-gray-900 flex flex-col gap-1">
        <h3
          className={`font-bold leading-snug transition-colors group-hover:text-primary ${
            variant === "featured" ? "text-base md:text-lg" : "text-sm"
          }`}
        >
          {video.title}
        </h3>

        {video.excerpt && (
          <p className="text-xs md:text-sm font-medium leading-normal text-gray-500 line-clamp-2">
            {video.excerpt}
          </p>
        )}
      </div>
    </div>
  );
}
