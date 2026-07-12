import React from 'react';
import FourCategoryGrid from './ThreeColumnCategoryFeatured';
import { Category } from '@/lib/types';
import { getAllcategories, getArticles } from '@/lib/api';

const OthersCategories = async () => {
  try {
    // 1. Fetch all available categories from your API setup
    const categoriesRes = await getAllcategories();
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
          console.error(`Failed to fetch articles for category: ${cat.slug}`, err);
          return {
            title: cat.titleBn || cat.title,
            slug: cat.slug,
            articles: [],
          };
        }
      })
    );

    // Exclude categories that already have dedicated sections on the homepage
    const excludedSlugs = ["international", "binodon", "khela","National"];

    // Filter out categories without articles and those with dedicated sections
    const activeCategoriesData = categoriesData.filter(
      cat => cat.articles.length > 0 && !excludedSlugs.includes(cat.slug),
    );

    return (
      <div>
        <FourCategoryGrid categories={activeCategoriesData} sectionTitle="অন্যান্য" />
      </div>
    );
  } catch (error) {
    console.error("Error loading categories wrapper:", error);
    return <div>Error loading sections</div>;
  }
};

export default OthersCategories;