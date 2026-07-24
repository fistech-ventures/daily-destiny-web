import { getAllcategories, getArticles, getCategoryById } from "@/lib/api";
import {
  generateCategoryMetadata,
  generateFallbackMetadata,
} from "@/lib/metadata";
import { Category, ArticleQueryParams } from "@/lib/types";
import { Metadata } from "next";
import React from "react";
import Link from "next/link";
import NewsListClient from "@/components/news/news-list-client";
import LocationFilter from "@/components/category/categoryfilter";
import AdBanner from "@/components/shared/ad-banner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const metadataPath = `/${decodedSlug}`;

  try {
    const { data: categories } = await getAllcategories({ sortBy: "position", limit: 50 });
    let category = categories.find(
      (c: Category) => c.slug === decodedSlug || c.slugBn === decodedSlug,
    );
    let activeSubCategory: Category | undefined = undefined;

    if (!category) {
      for (const parent of categories) {
        const sub = parent.subCategories?.find(
          (s: Category) => s.slug === decodedSlug || s.slugBn === decodedSlug,
        );
        if (sub) {
          category = parent;
          activeSubCategory = sub;
          break;
        }
      }
    }

    if (!category) {
      return generateFallbackMetadata({
        locale,
        path: metadataPath,
        noIndex: true,
      });
    }
    return generateCategoryMetadata(activeSubCategory || category, {
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

// 1. Create a strict, explicit interface for the page query construction
interface CategoryPageArticlesQuery extends ArticleQueryParams {
  useLocationApi?: boolean;
  includeMultiCategory?: boolean;
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
  searchParams: Promise<{
    subCategoryId?: string;
    locationId?: string;
  }>;
}) {
  const { slug, locale } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // Fetch all categories with a sufficient limit so lower-positioned slugs are included
  const { data: categories } = await getAllcategories({ sortBy: "position", limit: 50 });

  let category = categories.find(
    (c: Category) => c.slug === decodedSlug || c.slugBn === decodedSlug,
  );
  let resolvedSubCategoryId: string | undefined = undefined;

  if (!category) {
    for (const parent of categories) {
      const sub = parent.subCategories?.find(
        (s: Category) => s.slug === decodedSlug || s.slugBn === decodedSlug,
      );
      if (sub) {
        category = parent;
        resolvedSubCategoryId = sub.id;
        break;
      }
    }
  }

  // Enrich category with richer data from the single-category endpoint
  if (category?.id) {
    try {
      const categoryRes = await getCategoryById(category.id);
      if (categoryRes?.data) {
        category = categoryRes.data;
      }
    } catch (err) {
      console.error("Failed to enrich category data, using list data:", err);
    }
  }

  const resolvedSearchParams = await searchParams;
  const subCategoryId =
    resolvedSubCategoryId || resolvedSearchParams.subCategoryId;
  const locationId = resolvedSearchParams.locationId;

  // 2. Initialize the query configuration with strict typing instead of 'any'
  const apiQuery: CategoryPageArticlesQuery = {
    limit: 16,
    status: "Published",
  };

  // 3. Populate filter values type-safely based on conditionals
  if (locationId) {
    apiQuery.locationId = locationId;
    apiQuery.useLocationApi = true; // Set flag explicitly
  } else {
    if (subCategoryId) {
      apiQuery.subCategoryId = subCategoryId;
    } else if (category?.id) {
      apiQuery.categoryId = category.id;
      apiQuery.includeMultiCategory = true;
    }
  }

  // 4. Request items passing down the safe object reference directly
  const response = await getArticles(apiQuery);

  const isBn = locale === "bn";
  const parentTitle = isBn ? category?.titleBn : category?.title;

  const subCategoryObj = category?.subCategories?.find(
    (subCategory: Category) => subCategory.id === subCategoryId,
  );
  const subTitle = subCategoryObj
    ? isBn
      ? subCategoryObj.titleBn
      : subCategoryObj.title
    : undefined;

  const targetHeading = locationId
    ? isBn
      ? "আমার এলাকার খবর"
      : "My Area News"
    : subTitle || parentTitle || "";

  const articlesList = response?.data || [];
  const meta = response?.meta;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Category header section */}
      <div className="border-b border-gray-100 pb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="lg:text-2xl text-xl font-bold text-[#1a66ca] flex items-center flex-wrap gap-2">
          {locationId ? (
            targetHeading
          ) : parentTitle && subTitle ? (
            <>
              <Link href={`/${category?.slug}`} className="hover:underline">
                {parentTitle}
              </Link>
              <span className="text-gray-400 font-normal">→</span>
              <span className="text-gray-600">{subTitle}</span>
            </>
          ) : (
            targetHeading
          )}
        </h1>

        {category?.subCategories && category.subCategories.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/${category.slug}`}
              className={`px-3 py-1 text-sm font-semibold rounded-full transition-all duration-200 border ${
                !subCategoryId
                  ? "bg-[#1a66ca] text-white border-[#1a66ca]"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {isBn ? "সব" : "All"}
            </Link>
            {category.subCategories.map((sub: Category) => {
              const isActive = sub.id === subCategoryId;
              return (
                <Link
                  key={sub.id}
                  href={`/${sub.slug}`}
                  className={`px-3 py-1 text-sm font-semibold rounded-full transition-all duration-200 border ${
                    isActive
                      ? "bg-[#1a66ca] text-white border-[#1a66ca]"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {isBn ? sub.titleBn || sub.title : sub.title}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 w-full pr-2 border-r border-gray-100">
          <NewsListClient
            key={`${category?.id}-${subCategoryId || "none"}-${locationId || "global"}`}
            initialData={articlesList}
            initialMeta={meta}
            fetchParams={apiQuery}
          />
        </div>

        <div className="w-full lg:w-80 shrink-0 sticky top-4 flex flex-col gap-4">
          <AdBanner pageType="categoryPage" position="Right-Sidebar-top" categoryId={category?.id} keepSpace />
          <LocationFilter initialLocationId={locationId} />
        </div>
      </div>
    </div>
  );
}
