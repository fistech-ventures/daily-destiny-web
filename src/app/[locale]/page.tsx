// import MainLayout from "@/components/home/main-layout";
// import VideoList from "@/components/video/video-list";
// // import ShareMarket from "@/components/shared/share-market";
// import { generateHomeMetadata } from "@/lib/metadata"; // adjust path
// import { setRequestLocale } from "next-intl/server";

// export const revalidate = 60;

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ locale: string }>;
// }) {
//   const { locale } = await params;

//   return generateHomeMetadata({
//     path: "/",
//     locale,
//   });
// }

// export default async function Home({
//   params,
// }: {
//   params: Promise<{ locale: string }>;
// }) {
//   const { locale } = await params;
//   setRequestLocale(locale);

//   return (
//     <main>
//       {/* <ShareMarket /> */}
//       <MainLayout />
//       <VideoList initialVideos={initialVideos} initialMeta={initialMeta} />
//     </main>
//   );
// }

import MainLayout from "@/components/home/main-layout";
import VideoSlider from "@/components/video/video-slider"; // Import the Slider
import { generateHomeMetadata } from "@/lib/metadata";
import { setRequestLocale } from "next-intl/server";
import { getVideos, getArticles, getAllcategories } from "@/lib/api";
import { Category } from "@/lib/types";
import FourCategoryGrid from "@/components/category/ThreeColumnCategoryFeatured";

export const revalidate = 60;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch standard data array
  const response = await getVideos({ page: 1, limit: 12 });
  const initialVideos = response?.data || [];

  // Fetch all categories to map slugs to IDs
  const categoriesRes = await getAllcategories();
  const categoriesList: Category[] = categoriesRes?.data || [];

  const getCategoryData = async (slug: string) => {
    const cat = categoriesList.find((c) => c.slug === slug);
    if (!cat) {
      return {
        title: slug === "national" ? "জাতীয়" : slug === "international" ? "আন্তর্জাতিক" : slug === "politics" ? "রাজনীতি" : slug === "Sports" ? "ক্রীড়া" : slug,
        slug,
        articles: [],
      };
    }
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
  };

  const categoriesData = await Promise.all([
    getCategoryData("national"),
    getCategoryData("international"),
    getCategoryData("politics"),
    getCategoryData("economy"),
  ]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-8">
      <MainLayout />
      <VideoSlider videos={initialVideos} title="ভিডিও" /> 
      <FourCategoryGrid categories={categoriesData} />
    </main>
  );
}