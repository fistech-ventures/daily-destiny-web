import React from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { VideoArticle } from "@/lib/api";

interface VideoCardProps {
  article: VideoArticle;
}

const getThumbnail = (article: VideoArticle): string => {
  if (article.source === "youtube" && article.key) {
    return `https://img.youtube.com/vi/${article.key}/hqdefault.jpg`;
  }
  return article.coverImage || "/placeholder.jpg";
};

export default function VideoArticleCard({ article }: VideoCardProps) {
  const thumbnail = article.coverImage || getThumbnail(article);

  return (
    <Link href={`/video/${article.slug}`} className="group block w-full">
      <div className="flex flex-col gap-3">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-sm">
          <img
            src={thumbnail}
            alt={article.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-xl transition-all duration-300 group-hover:bg-white group-hover:scale-110">
              <Play className="ml-1 h-6 w-6 fill-amber-500 text-amber-500" />
            </div>
          </div>
        </div>

        <h3 className="md:text-base text-xs font-bold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-primary line-clamp-2">
          {article.title}
        </h3>
      </div>
    </Link>
  );
}
