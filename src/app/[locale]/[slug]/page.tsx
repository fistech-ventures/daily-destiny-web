import { getAllcategories, getArticles } from "@/lib/api";
import {
  generateCategoryMetadata,
  generateFallbackMetadata,
} from "@/lib/metadata";
import { Category } from "@/lib/types";
import { Metadata } from "next";
import React from "react";
import NewsListClient from "@/components/news/news-list-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const metadataPath = `/${decodedSlug}`;

  try {
    const { data: categories } = await getAllcategories();
    const category = categories.find((c: Category) => c.slug === decodedSlug);
    if (!category) {
      return generateFallbackMetadata({
        locale,
        path: metadataPath,
        noIndex: true,
      });
    }
    return generateCategoryMetadata(category, {
      locale,
      path: metadataPath,
    });
  } catch {
    return generateFallbackMetadata({
      locale,
      path: metadataPath,
      noIndex: true,
    });
  }
}

// Revalidate this page every 0 seconds to prevent caching
export const revalidate = 0;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
  searchParams: Promise<{
    subCategoryId: string;
  }>;
}) {
  const { slug } = await params;

  const decodedSlug = decodeURIComponent(slug);

  const { data: categories } = await getAllcategories();

  const category = categories.find(
    (category: Category) => category.slug === decodedSlug,
  );

  const subCategoryId = (await searchParams).subCategoryId;

  const response = await getArticles({
    categoryId: category?.id,
    subCategoryId,
    limit: 10,
  });

  const subCategoryTitle = category?.subCategories?.find(
    (subCategory: Category) => subCategory.id === subCategoryId,
  )?.titleBn;

  const articlesList = response?.data || [];
  const meta = response?.meta;

  return (
    <div className="">
      <h2 className="lg:text-2xl text-xl font-bold">
        {subCategoryTitle || category?.titleBn}
      </h2>

      <div className="mt-4">
        <NewsListClient
          initialData={articlesList}
          initialMeta={meta}
          fetchParams={{
            categoryId: category?.id,
            subCategoryId,
          }}
        />
      </div>
    </div>
  );
}
