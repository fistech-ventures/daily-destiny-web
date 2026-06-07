// @/components/category/CategoryWithSubcategories.tsx
import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getAllcategories, getArticles } from "@/lib/api";
import { Category, Article } from "@/lib/types";
import ArticleCard from "./ArticleCard"; // Adjust this path if your ArticleCard is elsewhere

interface Props {
  slug: string;           // e.g., "international", "sports"
  fallbackTitle?: string; // e.g., "আন্তর্জাতিক"
}

export default async function CategoryWithSubcategories({ slug, fallbackTitle }: Props) {
  // 1. Fetch backend layout map structure
  const categoriesRes = await getAllcategories();
  const allCategories: Category[] = categoriesRes?.data || [];
  
  // Find the requested parent category (e.g., international)
  const parentCat = allCategories.find((c) => c.slug === slug);

  // If the main category doesn't exist, exit safely
  if (!parentCat) return null;

  // Compute subcategories data array
  let gridCategoriesData: {
    id: string;
    title: string;
    slug: string;
    articles: Article[];
  }[] = [];

  if (parentCat.subCategories && parentCat.subCategories.length > 0) {
    gridCategoriesData = await Promise.all(
      parentCat.subCategories.slice(0, 4).map(async (sub) => {
        // Fetch specific subcategory articles explicitly using sub.id
        const res = await getArticles({
          categoryId: sub.id, 
          limit: 4,
          status: "Published",
        });

        return {
          id: sub.id,
          title: sub.titleBn || sub.title,
          slug: `${parentCat.slug}/${sub.slug}`, // e.g., international/war
          articles: res?.data || [],
        };
      })
    );
  }

  // Filter out any subcategory columns that don't have news articles written yet
  const validGridData = gridCategoriesData.filter(cat => cat.articles.length > 0);

  // FALLBACK: If absolutely no subcategories have articles, show the parent's general articles
  if (validGridData.length === 0) {
    const generalRes = await getArticles({
      categoryId: parentCat.id,
      limit: 4,
      status: "Published",
    });

    if (!generalRes?.data || generalRes.data.length === 0) return null;

    validGridData.push({
      id: parentCat.id,
      title: parentCat.titleBn || parentCat.title || fallbackTitle || parentCat.slug,
      slug: parentCat.slug,
      articles: generalRes.data,
    });
  }

  // 2. Render the layout identical to your screenshot specification
  const sectionHeaderTitle = parentCat.titleBn || parentCat.title || fallbackTitle || parentCat.slug;

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* Main Section Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <Link href={`/${parentCat.slug}`} className="flex items-center gap-1.5 group cursor-pointer">
          <h2 className="text-xl font-bold text-gray-900 border-b-2 border-red-600 pb-2 -mb-[10px]">
            {sectionHeaderTitle}
          </h2>
          <ChevronRight className="h-5 w-5 text-red-600 mt-0.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* 4 Column Subcategory Grid Container */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 bg-transparent mt-2">
        {validGridData.map((subCat) => {
          const leadArticle = subCat.articles[0];
          const listArticles = subCat.articles.slice(1, 4);

          return (
            <div
              key={subCat.id}
              className="flex flex-col bg-white border border-gray-200 rounded-md p-4 shadow-xs justify-between"
            >
              <div>
                {/* Column Card Header Linking to Subcategory */}
                <div className="flex items-start mb-4">
                  <Link href={`/${subCat.slug}`} className="inline-block group">
                    <h3 className="text-base font-bold text-gray-800 border-b-2 border-red-700 pb-1 group-hover:text-red-700 transition-colors">
                      {subCat.title}
                    </h3>
                  </Link>
                </div>

                {/* Card News Stream Content */}
                <div className="flex-1 flex flex-col gap-4">
                  {/* Lead News Block Layout */}
                  {leadArticle && (
                    <div className="border-b border-gray-100 pb-3">
                      <ArticleCard
                        article={leadArticle}
                        variant="vertical-lead"
                      />
                    </div>
                  )}

                  {/* Sub-articles Text Links List */}
                  {listArticles.length > 0 && (
                    <div className="flex flex-col flex-1">
                      {listArticles.map((article: Article, idx: number) => (
                        <div
                          key={article.code || article.id || idx}
                          className="border-b border-gray-100 last:border-0 py-2.5 first:pt-0 last:pb-0"
                        >
                          <ArticleCard article={article} variant="text-only" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Centered "More" Button anchored at the bottom edge */}
              <div className="w-full flex justify-center mt-6 pt-2">
                <Link
                  href={`/${subCat.slug}`}
                  className="inline-flex items-center justify-center bg-[#0066da] hover:bg-[#0052b4] text-white text-xs font-medium px-5 py-2 rounded transition-colors shadow-xs min-w-[84px]"
                >
                  আরও
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}