"use client";

import React, { useState } from "react";
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

  const featuredVideo = initialVideos[0];
  const initialGridVideos = initialVideos.slice(1);

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

      setGridVideos((prev) => [...prev, ...newVideos]);
      setPage(nextPage);
      setHasMore(nextPage < response.meta.totalPages);
    } catch (error) {
      console.error("Failed to load more videos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 bg-background p-3 rounded-md">
      {initialVideos.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500 font-medium">
            {tCommon("noDataAvailable")}
          </p>
        </div>
      ) : (
        <>
          {/* Featured Video */}
          {featuredVideo && (
            <div className="w-full">
              <VideoCard video={featuredVideo} variant="featured" />
            </div>
          )}

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {gridVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <Button
                onClick={handleLoadMore}
                disabled={loading}
                variant="outline"
                className="group px-8 rounded-full bg-[#fde190] hover:bg-[#fbd360] border-none text-gray-900 font-bold text-lg transition-all active:scale-95 shadow-md"
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
