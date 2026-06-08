//src/app/[locale]/gallery/page.tsx
import GalleryList from "@/components/gallery/gallery-list";
import ArticleSidebar from "@/components/home/article/article-sidebar";
import { getImages } from "@/lib/api";
import { generateHomeMetadata } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return generateHomeMetadata({
    path: "/gallery",
    locale,
  });
}

export default async function GalleryPage() {
  const t = await getTranslations("gallery");

  const galleryResponse = await getImages();


  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div className="lg:col-span-8 flex flex-col">
        <div className="pb-4">
          <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {t("title")}
            </h1>
          </div>
        </div>
        <GalleryList
          initialGallery={galleryResponse.data}
          initialMeta={galleryResponse.meta}
        />
      </div>

      <div className="lg:col-span-4">
        <ArticleSidebar />
      </div>
    </div>
  );
}
