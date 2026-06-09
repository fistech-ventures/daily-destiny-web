// src/[locale]/gallery/[code]/page.tsx
import ImageCard from "@/components/gallery/related-image";
import SocialShare from "@/components/shared/social-share";
import { getSingleImage, imageArticle } from "@/lib/api";
import { generateArticleMetadata } from "@/lib/metadata";
import { Article } from "@/lib/types";
import { formatRelativeTime } from "@/utils/date-formatter";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string; locale: string }>;
}) {
  const { code, locale } = await params;
  const decodedCode = decodeURIComponent(code);

  const gallery = await getSingleImage(decodedCode);

  if (!gallery) return {}; // fallback to layout metadata

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

  const gallery = await getSingleImage(decodedCode);
  const t = await getTranslations("gallery");

  if (!gallery) {
    return (
      <div className="p-4 md:p-6 text-center text-gray-500">
        {t("no_image_found")}
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
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

{/* Related Gallery Part */}
      {/* <div className="lg:col-span-1 col-span-3 bg-background rounded-md p-3 no-print">
        <div className="flex items-center gap-3 border-l-4 border-primary pl-3 m-4">
          <h2 className="text-xl font-bold text-gray-900">{t("more")}</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {relatedImageArticles?.map((image: imageArticle) => (
            <ImageCard key={image.id} item={image} />
          ))}
        </div>
      </div> */}
    </div>
  );
}
