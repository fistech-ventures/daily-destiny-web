import React from "react";
import { getVideos, getImages } from "@/lib/api";
import VideoList from "@/components/video/video-list";
import VideoSidebar from "@/components/video/video-sidebar";
import { getTranslations } from "next-intl/server";
import { generateHomeMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return generateHomeMetadata({
    path: "/video",
    locale,
  });
}

export default async function VideoPage() {
  const t = await getTranslations("article");
  const videoResponse = await getVideos({ page: 1, limit: 11 }); // 1 featured + 10 grid
  const images = await getImages();

  return (
    <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col">
          <div className="my-2">
            <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {t("videoPageTitle")}
              </h1>
            </div>
          </div>

          <VideoList
            initialVideos={videoResponse.data}
            initialMeta={videoResponse.meta}
          />
        </div>

        <div className="lg:col-span-4">
          <VideoSidebar images={images.data} t={t} />
        </div>
      </div>
    </div>
  );
}
