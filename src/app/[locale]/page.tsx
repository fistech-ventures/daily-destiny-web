import MainLayout from "@/components/home/main-layout";
import VideoSlider from "@/components/video/video-slider"; 
import { generateHomeMetadata } from "@/lib/metadata";
import { setRequestLocale } from "next-intl/server";
import { getVideos, getArticles, getAllcategories, getImages } from "@/lib/api";
import { Category } from "@/lib/types";
import FourCategoryGrid from "@/components/category/ThreeColumnCategoryFeatured";
import PhotoGallerySection from "@/components/gallery/PhotoGallerySection";
import { formatRelativeTime } from "@/utils/date-formatter";

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
  code?: string;
}

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
    <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-8">
      <MainLayout />
      <VideoSlider videos={initialVideos} title="ভিডিও" /> 
      <FourCategoryGrid categories={categoriesData} />
      {/* Photo Gallery Section */}
      <PhotoGallerySection items={galleryItems} title="ছবিঘর" />
    </main>
  );
}