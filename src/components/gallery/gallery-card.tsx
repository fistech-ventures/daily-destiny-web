//src/components/gallery/gallery-card.tsx
import React from "react";
import Link from "next/link";

// import { Timer } from "lucide-react";
// import { formatRelativeTime } from "@/utils/date-formatter";
import { imageArticle } from "@/lib/api";

interface GallerycardProps {
  gallery: imageArticle;
  variant?: "default" | "small" | "featured";
  showdescription?: boolean;
}

export default function GalleryCard({
  gallery,
  variant = "default",
  showdescription = false,
}: GallerycardProps) {
  const thumbnail =
    gallery.images && gallery.images.length > 0
      ? gallery.images[0].url
      : gallery?.coverImage;
  const isFeatured = variant === "featured";

  return (
    <Link href={`/gallery/${gallery.code}`} className="group block w-full">
      <div
        className={`flex flex-col ${isFeatured ? "gap-4" : variant === "small" ? "gap-2" : "gap-3"}`}
      >
        <div
          className={`relative aspect-video w-full overflow-hidden rounded-2xl shadow-sm border border-gray-100 ${isFeatured ? "ring-1 ring-gray-100 shadow-md" : ""}`}
        >
          <img
            src={thumbnail}
            alt={gallery.title}
            className="w-full h- object-contain transition-transform duration-700 group-hover:scale-105"
            sizes={
              isFeatured
                ? "(max-width: 1024px) 100vw, 800px"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            }
          />
        </div>

        <div
          className={`flex flex-col gap-1.5 ${isFeatured ? "px-0" : "px-1"}`}
        >
          {/* <div className="flex items-center gap-1.5 opacity-80 mb-0.5">
            <Timer className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {formatRelativeTime(gallery.date)}
            </span>
          </div> */}

          <h3
            className={`font-bold leading-[1.3] text-gray-900 transition-colors duration-200 group-hover:text-primary ${isFeatured ? "text-lg lg:text-2xl" : variant === "small" ? "text-base" : "text-lg md:text-xl"}`}
          >
            {gallery.title}
          </h3>
          {showdescription && (
            <div
              dangerouslySetInnerHTML={{ __html: gallery.description }}
              className="line-clamp-2 text-sm font-normal text-muted-foreground"
            />
          )}
        </div>
      </div>
    </Link>
  );
}
