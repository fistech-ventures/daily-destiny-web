import React from "react";

import { VideoArticle } from "@/lib/api";
// import { formatRelativeTime } from "@/utils/date-formatter";

interface VideoCardProps {
  video: VideoArticle;
  variant?: "default" | "small" | "featured";
}

const getThumbnail = (video: VideoArticle): string => {
  if (video.source === "youtube" && video.key) {
    return `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`;
  }
  return video.coverImage || "/placeholder.jpg";
};

export default function VideoCard({
  video,
  variant = "default",
}: VideoCardProps) {

return (
  <div className="relative w-full h-full group cursor-pointer">
    {/* Video Thumbnail */}
    <img
      src={video.coverImage}
      alt={video.title}
      className="object-cover w-full h-full"
    />

    {/* Center Play Button Overlay */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-red-600 transition-transform group-hover:scale-110 shadow-md">
        {/* Play Icon Graphic */}
        <svg className="w-6 h-6 fill-current pl-0.5" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>

    {/* Bottom Dark Gradient Backplate Overlay to mimic screenshot */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

    {/* Title Content container anchored at bottom */}
    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
      <h3
        className={`font-bold leading-snug line-clamp-2 ${
          variant === "featured" ? "text-base md:text-lg" : "text-xs md:text-sm"
        }`}
      >
        {video.title}
      </h3>
    </div>
  </div>
);
}
