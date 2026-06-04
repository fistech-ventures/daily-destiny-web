import React from "react";
import Link from "next/link";
import { Play } from "lucide-react";
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
  const thumbnail = video.coverImage || getThumbnail(video);
  const isFeatured = variant === "featured";

  return (
    <Link href={`/video/${video.slug}`} className="group block w-full">
      <div
        className={`flex flex-col ${isFeatured ? "gap-4" : variant === "small" ? "gap-2" : "gap-3"}`}
      >
        <div
          className={`relative aspect-video w-full overflow-hidden rounded-md shadow-sm border border-gray-100 ${isFeatured ? "ring-1 ring-gray-100 shadow-md" : ""}`}
        >
          <img
            src={thumbnail}
            alt={video.title}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            sizes={
              isFeatured
                ? "(max-width: 1024px) 100vw, 800px"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            }
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`flex items-center justify-center rounded-full bg-white/90 shadow-xl transition-all duration-300 group-hover:bg-white group-hover:scale-110 ${variant === "small" ? "h-10 w-10" : isFeatured ? "h-16 w-16" : "h-12 w-12"}`}
            >
              <Play
                className={`fill-primary text-primary ${variant === "small" ? "h-5 w-5 ml-0.5" : isFeatured ? "h-8 w-8 ml-1.5" : "h-6 w-6 ml-1"}`}
              />
            </div>
          </div>
        </div>

        <div
          className={`flex flex-col gap-1.5 ${isFeatured ? "px-0" : "px-1"}`}
        >
          {/* <div className="flex items-center gap-1.5 opacity-80 mb-0.5">
            <Timer className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {formatRelativeTime(video.date)}
            </span>
          </div> */}
          <h3
            className={`font-bold leading-[1.3] text-gray-900 transition-colors duration-200 group-hover:text-primary ${isFeatured ? "text-lg lg:text-2xl" : variant === "small" ? "text-base" : "text-lg md:text-xl"}`}
          >
            {video.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
