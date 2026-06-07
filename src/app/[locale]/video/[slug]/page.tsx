import React from "react";
import { getVideos, getVideoByCode, VideoArticle } from "@/lib/api";
import VideoPlayerDetails from "@/components/video/video-player-details";
import VideoCard from "@/components/video/video-card";
import { getTranslations } from "next-intl/server";

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("article");

  // Fetch detailed video data by its code/slug
  const video = await getVideoByCode(slug);

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-primary pl-4">
          ভিডিওটি পাওয়া যায়নি
        </h2>
      </div>
    );
  }

  // Fetch recommendations list
  const allVideosResponse = await getVideos({ page: 1, limit: 10 });
  const recommendations = allVideosResponse.data
    .filter((v: VideoArticle) => v.code !== video.code)
    .slice(0, 8);

  return (
    <div className="bg-background p-3 rounded-md">
      <div className="">
        <div className="lg:col-span-8 flex flex-col gap-2">
          <VideoPlayerDetails video={video} />

          {/* More Videos Section */}
          <div className="flex flex-col gap-2 lg:gap-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2 lg:pb-4">
              <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
                <h2 className="text-lg md:text-2xl font-bold text-gray-900">
                  {t("more")}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {recommendations.map((v: VideoArticle) => (
                <VideoCard key={v.id} video={v} variant="small" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
