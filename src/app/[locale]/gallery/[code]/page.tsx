// src/[locale]/gallery/[code]/page.tsx
import ImageCard from "@/components/gallery/related-image";
import SocialShare from "@/components/shared/social-share";
import RelatedNewsCard from "@/components/news/related-news-card";
import {
  getSingleImage,
  getImages,
  imageArticle,
  getArticles,
} from "@/lib/api";
import { generateArticleMetadata } from "@/lib/metadata";
import { Article } from "@/lib/types";
import { formatRelativeTime } from "@/utils/date-formatter";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string; locale: string }>;
}) {
  const { code, locale } = await params;
  const decodedCode = decodeURIComponent(code);

  const gallery = await getSingleImage(decodedCode);

  if (!gallery) return {};

  return generateArticleMetadata(
    {
      ...gallery,
      excerpt: gallery.description,
      medias: gallery.images,
    } as unknown as Article,
    {
      path: `/gallery/${decodedCode}`,
      locale,
    },
  );
}

export default async function GalleryCodePage({
  params,
}: {
  params: Promise<{ code: string; locale: string }>;
}) {
  const param = await params;
  const decodedCode = decodeURIComponent(param.code);

  const t = await getTranslations("gallery");
  const tRecent = await getTranslations("recent");
  const tArticle = await getTranslations("article");

  const [gallery, recentArticlesRes, relatedImagesRes] = await Promise.all([
    getSingleImage(decodedCode),
    getArticles({ limit: 5 }),
    getImages({ limit: 8 }),
  ]);

  const recentArticles: Article[] = recentArticlesRes?.data ?? [];
  const relatedImageArticles: imageArticle[] = (relatedImagesRes?.data ?? [])
    .filter((img: imageArticle) => img.code !== decodedCode)
    .slice(0, 6);

  if (!gallery) {
    return (
      <div className="p-4 md:p-6 text-center text-gray-500">
        {t("no_image_found")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 lg:gap-6 gap-3 items-start">
      {/* Left — Gallery Detail */}
      <div className="lg:col-span-2 col-span-3 bg-background rounded-md p-3 space-y-3 md:space-y-4">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold">
          {gallery.title}
        </h2>

        {gallery.date && (
          <p className="text-sm text-gray-500">
            {formatRelativeTime(gallery.date)}
          </p>
        )}

        <SocialShare title={gallery.title} />

        <div className="flex flex-col gap-2">
          {gallery.images.map((image, index) => (
            <div key={index} className="space-y-2">
              <img
                src={image.url}
                alt={image.caption}
                className="rounded-md w-full object-contain max-h-[70vh] mx-auto"
              />
              <p className="text-sm md:text-base text-gray-800">
                {image.caption}
              </p>
            </div>
          ))}
        </div>

        {/* Related Gallery Grid */}
        {relatedImageArticles.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center gap-3 border-l-4 border-primary pl-3 mb-4">
              <h2 className="text-xl font-bold text-gray-900">{t("more")}</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {relatedImageArticles.map((image: imageArticle) => (
                <Link key={image.id} href={`/gallery/${image.code}`}>
                  <ImageCard item={image} />
                </Link>
              ))}
            </div>
          </div>
        )}
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
                {tArticle("noRelatedArticle")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
