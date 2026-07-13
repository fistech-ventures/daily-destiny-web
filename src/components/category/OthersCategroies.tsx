import React from "react";
import FourCategoryGrid from "./ThreeColumnCategoryFeatured";
import { Category } from "@/lib/types";
import { getAllcategories, getArticles } from "@/lib/api";

const OthersCategories = async () => {
  try {
    // 1. Fetch all available categories from your API setup
    // Must request enough to leave a pool after excluding dedicated-section categories
    const categoriesRes = await getAllcategories({
      sortBy: "position",
      page: 1,
      limit: 50,
    });
    const categoriesList: Category[] = categoriesRes?.data || [];

    // 2. Map through every category dynamically to fetch its respective articles
    const categoriesData = await Promise.all(
      categoriesList.map(async (cat: Category) => {
        try {
          const articlesRes = await getArticles({
            categoryId: cat.id,
            limit: 4,
            status: "Published",
            includeMultiCategory: true,
          });

          return {
            title: cat.titleBn || cat.title,
            slug: cat.slug,
            articles: articlesRes?.data || [],
          };
        } catch (err) {
          console.error(
            `Failed to fetch articles for category: ${cat.slug}`,
            err,
          );
          return {
            title: cat.titleBn || cat.title,
            slug: cat.slug,
            articles: [],
          };
        }
      }),
    );

    // Exclude categories that already have dedicated sections on the homepage
    const excludedSlugs = [
      "international",
      "binodon",
      "entertainment",
      "kheladula",
      "sports",
      "national",
      "education",
      "economy",
      "politics",
      "religion",
      "dhormo",
      "information-technology",
      "technology",
      "tech",
      "health",
      "lifestyle",
      "campus",
      "law-order",
      "law",
      "opinion",
    ];

    // Filter out categories without articles and those with dedicated sections
    const activeCategoriesData = categoriesData.filter(
      cat => cat.articles.length > 0 && !excludedSlugs.includes(cat.slug),
    );

    // Shuffle the remaining categories so a different set shows each time
    const shuffled = [...activeCategoriesData];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selectedCategories = shuffled.slice(0, 8);

    return (
      <div>
        <FourCategoryGrid categories={selectedCategories} sectionTitle="অন্যান্য" />
      </div>
    );
  } catch (error) {
    console.error("Error loading categories wrapper:", error);
    return <div>Error loading sections</div>;
  }
};

export default OthersCategories;
