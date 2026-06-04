import { imageArticle, VideoArticle,  } from "@/lib/api";
import Link from "next/link";
import React from "react";
import VideoArticleCard from "./video-article-card";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import ImageGalleryCard from "./image-article-card";

export default function VideoAndImage({
  videoArticles,
  imageArticles,
}: {
  videoArticles: VideoArticle[];
  imageArticles: imageArticle[];
}) {
  const tArticle = useTranslations("article");
  const tCommon = useTranslations("common");

  return (
    <div>
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* Video part */}
        <div className="w-full">
          <div className="flex justify-between items-center border-l-4 border-primary pl-3 my-3">
            <h2 className="text-2xl font-bold text-gray-800">
              {tArticle("video")}
            </h2>
            <Link
              href="/video"
              className="flex items-center gap-1 text-primary cursor-pointer hover:underline"
            >
              <span className="text-sm font-medium">{tArticle("more")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:gap-6 gap-3 bg-background p-3 rounded-md min-h-[200px]">
            {videoArticles.length === 0 ? (
              <div className="col-span-2 flex justify-center items-center">
                <p className="text-gray-500 font-medium">{tCommon("noDataAvailable")}</p>
              </div>
            ) : (
              videoArticles.map((video: VideoArticle) => (
                <VideoArticleCard key={video.id} article={video} />
              ))
            )}
          </div>
        </div>

        {/* img Part */}
        <div className="w-full">
          <div className="flex justify-between items-center border-l-4 border-primary pl-3 my-3">
            <h2 className="text-2xl font-bold text-gray-800">
              {tArticle("image")}
            </h2>
            <Link
              href="/gallery"
              className="flex items-center gap-1 text-primary cursor-pointer hover:underline"
            >
              <span className="text-sm font-medium">{tArticle("more")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:gap-6 gap-3 bg-background p-3 rounded-md min-h-[200px]">
            {imageArticles.length === 0 ? (
              <div className="col-span-2 flex justify-center items-center">
                <p className="text-gray-500 font-medium">{tCommon("noDataAvailable")}</p>
              </div>
            ) : (
              imageArticles.map((imageArticle: imageArticle) => (
                <ImageGalleryCard key={imageArticle.id} article={imageArticle} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
