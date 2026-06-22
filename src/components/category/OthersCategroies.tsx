// "use client";
// import React from 'react'
// import FourCategoryGrid from './ThreeColumnCategoryFeatured'
// import { Category } from '@/lib/types';
// import { getAllcategories } from '@/lib/api';




// const OthersCategroies = () => {


//       const categoriesRes = await getAllcategories();
//       const categoriesList: Category[] = categoriesRes?.data || [];
    
//       const getCategoryData = async (slug: string) => {
//         const cat = categoriesList.find(c => c.slug === slug);
    
//         if (!cat) {
//           const fallbackTitles: Record<string, string> = {
//             international: "আন্তর্জাতিক",
//             sports: "ক্রীড়া",
//             economy: "অর্থনীতি",
//             business: "ব্যবসা",
//           };
//           return {
//             title: fallbackTitles[slug] || slug,
//             slug,
//             articles: [],
//           };
//         }
    
//         try {
//           const articlesRes = await getArticles({
//             categoryId: cat.id,
//             limit: 4,
//             status: "Published",
//           });
    
//           return {
//             title: cat.titleBn || cat.title,
//             slug: cat.slug,
//             articles: articlesRes?.data || [],
//           };
//         } catch (err) {
//           console.error(
//             `Failed to fetch production records for category slug: ${slug}`,
//             err,
//           );
//           return {
//             title: cat.titleBn || cat.title,
//             slug: cat.slug,
//             articles: [],
//           };
//         }
//       };
    
//       const categoriesData = await Promise.all([
//     getCategoryData("international"),
//     getCategoryData("sports"),
//     getCategoryData("economy"),
//     getCategoryData("business"),
//   ]);

//   return (
//     <div>
//             <FourCategoryGrid categories={categoriesData} sectionTitle="অন্যান্য" />

//     </div>
//   )
// }

// export default OthersCategroies


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

    // Filter out categories that don't have any articles (optional, but keeps UI clean)
    const activeCategoriesData = categoriesData.filter(cat => cat.articles.length > 0);

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