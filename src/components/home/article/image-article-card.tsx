import React from "react";
import Link from "next/link";

// import { Images } from "lucide-react";
import { imageArticle } from "@/lib/api";

interface ImageGalleryCardProps {
  article: imageArticle;
}

export default function ImageGalleryCard({ article }: ImageGalleryCardProps) {
  // const imageCount = article.images?.length || 0;
  const mainImage = article.images?.[0]?.url || article.coverImage;

  return (
    <Link href={`/gallery/${article.code}`} className="group block w-full">
      <div className="flex flex-col gap-3">
        {/* Stacked Effect Container */}
        <div className="relative pt-2 px-1">
          {/* Background Stacks (Visual decoration) */}
          <div className="absolute top-0 left-4 right-4 h-full bg-gray-200 rounded-lg -translate-y-1 shadow-sm" />
          <div className="absolute top-0 left-2 right-2 h-full bg-gray-300 rounded-lg -translate-y-0.5 shadow-sm" />

          {/* Main img Container */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-md border border-gray-100">
            <img
              src={mainImage}
              alt={article.title}
              className="object-contain w-full transition-transform duration-500 group-hover:scale-105"
            />

            {/* Top Right Badge (img Count) */}
            {/* <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-primary text-gray-900 px-2 py-1 rounded-md shadow-lg">
              <Images size={12} className="text-primary-foreground" />
              <span className="text-xs text-primary-foreground font-bold uppercase">
                {imageCount} Image
              </span>
            </div> */}
          </div>
        </div>

        {/* Title */}
        <h3 className="md:text-base text-xs font-bold leading-snug text-gray-800 transition-colors duration-200 group-hover:text-primary px-1 line-clamp-2">
          {article.title}
        </h3>
      </div>
    </Link>
  );
}
