//src/app/[locale]/gallery/[slug]/page.tsx
import ImageCard from "@/components/gallery/related-image";
import SocialShare from "@/components/shared/social-share";
import { getRelatedImages, getSingleImage, imageArticle } from "@/lib/api";
import { generateArticleMetadata } from "@/lib/metadata";
import { Article } from "@/lib/types";
import { formatRelativeTime } from "@/utils/date-formatter";
import { getTranslations } from "next-intl/server";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const gallery = await getSingleImage(decodedSlug);

  if (!gallery) return {}; // fallback to layout metadata

  return generateArticleMetadata(
    {
      ...gallery,
      excerpt: gallery.description,
      medias: gallery.images,
    } as unknown as Article,
    {
      path: `/gallery/${decodedSlug}`,
      locale,
    },
  );
}

export default async function GalleryDetails({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const param = await params;
  const decodedSlug = decodeURIComponent(param.slug);

  const gallery = await getSingleImage(decodedSlug);
  if (!gallery) return null;

  const relatedImageArticles = await getRelatedImages(gallery.id);
  const t = await getTranslations("gallery");

  return (
    <div className="grid grid-cols-3 lg:gap-6 gap-3 items-start">
      <div className="lg:space-y-3 space-y-2 lg:col-span-2 col-span-3">
        <h2 className="text-base md:text-xl lg:text-2xl">{gallery.title}</h2>
        {gallery.date && <p>{formatRelativeTime(gallery.date)}</p>}
        <SocialShare title={gallery.title} />
        <div className="p-3 bg-background rounded-md space-y-3 lg:space-y-6 relative w-full">
          {gallery.images.map((image, index) => (
            <div key={index} className="space-y-2">
              <img
                src={image.url}
                alt={image.caption}
                className="rounded-md w-full aspect-video object-contain"
              />
              <h3 className="text-sm md:text-base lg:text-lg">
                {image.caption}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Related Gallery Part */}
      <div className="lg:col-span-1 col-span-3 bg-background rounded-md p-3 no-print">
        <div className="flex items-center gap-3 border-l-4 border-primary pl-3 m-4">
          <h2 className="text-xl font-bold text-gray-900">{t("more")}</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {relatedImageArticles?.map((image: imageArticle) => (
            <ImageCard key={image.id} item={image} />
          ))}
        </div>
      </div>
    </div>
  );
}
