import { getAllcategories, getArticles } from "@/lib/api";
import {
  generateCategoryMetadata,
  generateFallbackMetadata,
} from "@/lib/metadata";
import { Category, ArticleQueryParams } from "@/lib/types";
import { Metadata } from "next";
import React from "react";
import NewsListClient from "@/components/news/news-list-client";
import LocationFilter from "@/components/category/categoryfilter";

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

// 1. Create a strict, explicit interface for the page query construction
interface CategoryPageArticlesQuery extends ArticleQueryParams {
  useLocationApi?: boolean;
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
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const { data: categories } = await getAllcategories();

  const category = categories.find(
    (category: Category) => category.slug === decodedSlug,
  );

  const resolvedSearchParams = await searchParams;
  const subCategoryId = resolvedSearchParams.subCategoryId;
  const locationId = resolvedSearchParams.locationId;

  // 2. Initialize the query configuration with strict typing instead of 'any'
  const apiQuery: CategoryPageArticlesQuery = {
    limit: 10,
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
    }
  }

  // 4. Request items passing down the safe object reference directly
  const response = await getArticles(apiQuery);

  const subCategoryTitle = category?.subCategories?.find(
    (subCategory: Category) => subCategory.id === subCategoryId,
  )?.titleBn;

  const defaultHeading = subCategoryTitle || category?.titleBn;
  const targetHeading = locationId ? "আমার এলাকার খবর" : defaultHeading;

  const articlesList = response?.data || [];
  const meta = response?.meta;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="lg:text-2xl text-xl font-bold border-b pb-2 border-gray-100 text-[#1a66ca]">
        {targetHeading}
      </h2>

      <div className="mt-6 flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 w-full pr-2 border-r border-gray-100">
          <NewsListClient
            key={`${category?.id}-${subCategoryId || "none"}-${locationId || "global"}`}
            initialData={articlesList}
            initialMeta={meta}
            fetchParams={apiQuery} // 👈 5. Directly forward clean parameters object
          />
        </div>

        <div className="w-full lg:w-80 shrink-0 sticky top-4">
          <LocationFilter />
        </div>
      </div>
    </div>
  );
}
