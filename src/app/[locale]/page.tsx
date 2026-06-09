import MainLayout from "@/components/home/main-layout";
import VideoSlider from "@/components/video/video-slider"; 
import VideoGallery from "@/components/home/video-gallery";
import FourCategoryGrid from "@/components/category/ThreeColumnCategoryFeatured";
import CategoryWithSubcategories from "@/components/category/CategoryWithSubcategories";
import { generateHomeMetadata } from "@/lib/metadata";
import { setRequestLocale } from "next-intl/server";
import { getVideos, getArticles, getAllcategories, getImages } from "@/lib/api";
import { Category } from "@/lib/types";
import PhotoGallerySection from "@/components/gallery/PhotoGallerySection";
import { formatRelativeTime } from "@/utils/date-formatter";
import SingleCategoryNewsGrid from "@/components/category/SingleCategoryNewsGrid";

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

export const revalidate = 60;

// Create a safe, strict structure type interface for the incoming images response 
interface GalleryApiItem {
  id: string | number;
  coverImage?: string;
  title: string;
  description?: string;
  date?: string;
  code: string;
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

  // Fetch recent photo gallery articles
  const galleryRes = await getImages({ page: 1, limit: 5 });
  const galleryArticles: GalleryApiItem[] = galleryRes?.data || [];
  
  // Clean type assignment instead of using forbidden 'any'
  const galleryItems = galleryArticles.map((article: GalleryApiItem) => ({
    id: article.id,
    url: article.coverImage || "",
    title: article.title,
    description: article.description,
    timeAgo: article.date ? formatRelativeTime(article.date) : "",
    photographer: "নিজস্ব প্রতিবেদক", 
    code: article.code,
  }));

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-3 lg:gap-5">
      {/* Hero / Main News Grid section Layout */}
      <MainLayout />

      {/* Slider Carousel Block Layout (Uses dedicated payload sliderVideos) */}
      <VideoSlider videos={sliderVideos} title="ভিডিও গ্যালারি" />

      <SingleCategoryNewsGrid slug="international" limit={4} />
      {/* Asymmetric Gallery Layout (Passes data & pagination meta seamlessly) */}
      <PhotoGallerySection items={galleryItems} title="ছবিঘর" />
      <SingleCategoryNewsGrid slug="sports" limit={4} />
      <VideoGallery initialVideos={galleryVideos} initialMeta={galleryMeta} />

      {/* Category sections with subcategories grids */}

      {/* 4 Column Category Matrix Section Component Layout */}
      <FourCategoryGrid categories={categoriesData} sectionTitle="অন্যান্য" />

    </main>
  );
}
