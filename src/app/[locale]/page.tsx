import MainLayout from "@/components/home/main-layout";
import VideoSlider from "@/components/video/video-slider";
import VideoGallery from "@/components/home/video-gallery";
import FourCategoryGrid from "@/components/category/ThreeColumnCategoryFeatured";
import { generateHomeMetadata } from "@/lib/metadata";
import { setRequestLocale } from "next-intl/server";
import { getVideos, getArticles, getAllcategories } from "@/lib/api";
import { Category } from "@/lib/types";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return generateHomeMetadata({
    path: "/",
    locale,
  });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // 1. Fetch data allocations for both video components in parallel
  const [sliderResponse, galleryResponse] = await Promise.all([
    getVideos({ page: 1, limit: 9 }), // Fetch 9 items for a clean 3-page non-looping slider layout
    getVideos({ page: 1, limit: 5 }), // Fetch 5 items strictly for the Asymmetric Gallery
  ]);

  const sliderVideos = sliderResponse?.data || [];
  const galleryVideos = galleryResponse?.data || [];
  const galleryMeta = galleryResponse?.meta || {
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1,
  };

  // 2. Fetch active production categories matrix from the database
  const categoriesRes = await getAllcategories();
  const categoriesList: Category[] = categoriesRes?.data || [];

  // Reusable optimized data-fetching method block
  const getCategoryData = async (slug: string) => {
    const cat = categoriesList.find(c => c.slug === slug);

    if (!cat) {
      const fallbackTitles: Record<string, string> = {
        international: "আন্তর্জাতিক",
        sports: "ক্রীড়া",
        economy: "অর্থনীতি",
        business: "ব্যবসা",
      };
      return {
        title: fallbackTitles[slug] || slug,
        slug,
        articles: [],
      };
    }

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
      console.error(
        `Failed to fetch production records for category slug: ${slug}`,
        err,
      );
      return {
        title: cat.titleBn || cat.title,
        slug: cat.slug,
        articles: [],
      };
    }
  };

  // 3. Query the 4 valid production data categories from your payload list
  const categoriesData = await Promise.all([
    getCategoryData("international"),
    getCategoryData("sports"),
    getCategoryData("economy"),
    getCategoryData("business"),
  ]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-8">
      {/* Hero / Main News Grid section Layout */}
      <MainLayout />

      {/* Slider Carousel Block Layout (Uses dedicated payload sliderVideos) */}
      <VideoSlider videos={sliderVideos} title="ভিডিও গ্যালারি" />

      {/* Asymmetric Gallery Layout (Passes data & pagination meta seamlessly) */}
      <VideoGallery initialVideos={galleryVideos} initialMeta={galleryMeta} />

      {/* 4 Column Category Matrix Section Component Layout */}
      <FourCategoryGrid categories={categoriesData} sectionTitle="অন্যান্য" />
    </main>
  );
}
