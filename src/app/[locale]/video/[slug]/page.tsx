import React from "react";
import {
  getVideos,
  getVideoByCode,
  VideoArticle,
  getArticles,
} from "@/lib/api";
import { Article } from "@/lib/types";
import VideoPlayerDetails from "@/components/video/video-player-details";
import VideoCard from "@/components/video/video-card";
import RelatedNewsCard from "@/components/news/related-news-card";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("article");
  const tRecent = await getTranslations("recent");

  const [video, recentArticlesRes] = await Promise.all([
    getVideoByCode(slug),
    getArticles({ limit: 5 }),
  ]);

  const recentArticles: Article[] = recentArticlesRes?.data ?? [];

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-primary pl-4">
          ভিডিওটি পাওয়া যায়নি
        </h2>
      </div>
    );
  }

  const allVideosResponse = await getVideos({ page: 1, limit: 10 });
  const recommendations = allVideosResponse.data
    .filter((v: VideoArticle) => v.code !== video.code)
    .slice(0, 6);

  return (
    <div className="grid grid-cols-3 lg:gap-6 gap-3 items-start">
      {/* Left — Video Player + More Videos */}
      <div className="lg:col-span-2 col-span-3 bg-background p-3 rounded-md flex flex-col gap-4">
        <VideoPlayerDetails video={video} />

        {/* More Videos Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 border-l-4 border-primary pl-3">
            <h2 className="text-lg md:text-2xl font-bold text-gray-900">
              {t("more")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {recommendations.map((v: VideoArticle) => (
              <Link
                key={v.id}
                href={`/video/${v.code}`}
                className="block w-full"
              >
                <VideoCard video={v} variant="small" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Recent News Sidebar */}
      <div className="lg:col-span-1 col-span-3">
        <div className="bg-background rounded-md p-3">
          <div className="flex items-center gap-3 border-l-4 border-primary pl-3 my-2">
            <h2 className="text-xl font-bold text-gray-900">
              {tRecent("title")}
            </h2>
          </div>
          <div>
            {recentArticles.length > 0 ? (
              recentArticles.map((article: Article) => (
                <RelatedNewsCard key={article.id} article={article} />
              ))
            ) : (
              <p className="p-4 text-center text-sm text-gray-500">
                {t("noRelatedArticle")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
