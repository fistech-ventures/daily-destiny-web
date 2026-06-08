"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VideoArticle, getVideos } from "@/lib/api";
import VideoCard from "./video-card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

interface VideoListProps {
  initialVideos: VideoArticle[];
  initialMeta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function VideoList({
  initialVideos,
  initialMeta,
}: VideoListProps) {
  const t = useTranslations("recent");
  const tCommon = useTranslations("common");

  // layout splitting:
  // Top row displays 2 equal featured video cards.
  // Bottom row displays a 4-column grid for the rest of the videos.
  const topFeatureVideos = initialVideos.slice(0, 2);
  const initialGridVideos = initialVideos.slice(2);

  const [gridVideos, setGridVideos] =
    useState<VideoArticle[]>(initialGridVideos);
  const [page, setPage] = useState(initialMeta.page);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialMeta.page < initialMeta.totalPages,
  );

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const response = await getVideos({
        page: nextPage,
        limit: initialMeta.limit,
      });
      const newVideos = response?.data || [];

      setGridVideos(prev => [...prev, ...newVideos]);
      setPage(nextPage);
      setHasMore(nextPage < response.meta.totalPages);
    } catch (error) {
      console.error("Failed to load more videos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-transparent py-4 flex flex-col gap-6">
      {initialVideos.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500 font-medium">
            {tCommon("noDataAvailable")}
          </p>
        </div>
      ) : (
        <>
          {/* Top Row: Two Equal Column Features side-by-side */}
          {topFeatureVideos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
              {topFeatureVideos.map(video => (
                <Link
                  key={video.code}
                  href={`/video/${video.code}`}
                  className="block w-full"
                >
                  <VideoCard video={video} variant="featured" />
                </Link>
              ))}
            </div>
          )}

          {/* Bottom Row: Four Column Grid for standard/remaining items */}
          {gridVideos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {gridVideos.map(video => (
                <Link
                  key={video.code}
                  href={`/video/${video.code}`}
                  className="block w-full"
                >
                  {/* CHANGED variant="grid" to variant="default" to pass TypeScript validation */}
                  <VideoCard video={video} variant="default" />
                </Link>
              ))}
            </div>
          )}

          {/* Pagination Load More Trigger */}
          {hasMore && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleLoadMore}
                disabled={loading}
                variant="outline"
                className="group h-11 px-8 rounded-full bg-[#fde190] hover:bg-[#fbd360] border-none text-gray-900 font-bold text-base transition-all active:scale-95 shadow-sm"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <ChevronDown className="mr-2 h-5 w-5 transition-transform group-hover:translate-y-0.5" />
                )}
                {t("loadMore") || "আরও ভিডিও দেখুন"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
