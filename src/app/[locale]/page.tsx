import MainLayout from "@/components/home/main-layout";
import VideoGallery from "@/components/home/video-gallery";
import { generateHomeMetadata } from "@/lib/metadata";
import { setRequestLocale } from "next-intl/server";
import { getVideos, getArticles, getAllcategories, getImages, getSpecialEvents } from "@/lib/api";
import { Category, Article } from "@/lib/types";
import { imageArticle } from "@/lib/api";
import PhotoGallerySection from "@/components/gallery/PhotoGallerySection";
import ArchiveSection from "@/components/archive/archive-section";
import { formatRelativeTime } from "@/utils/date-formatter";
import SingleCategoryNewsGrid from "@/components/category/SingleCategoryNewsGrid";
import NewsListClient from "@/components/news/news-list-client";
import LocationFilter from "@/components/category/categoryfilter";
import OthersCategories from "@/components/category/OthersCategroies";
import FeatureBanner from "@/components/feature-banner/FeatureBanner";
import BinodonSection from "@/components/home/article/binodon-section";
import KhelaSlider from "@/components/home/article/khela-slider";
import PoliticsSection from "@/components/home/article/polititcs-section";
import EconomySection from "@/components/home/article/economy-section";

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

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ locationId?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const resolvedSearchParams = await searchParams;
  const locationId = resolvedSearchParams.locationId;

  if (locationId) {
    const response = await getArticles({
      locationId,
      limit: 10,
      useLocationApi: true,
    });

    const articlesList = response?.data || [];
    const meta = response?.meta;

    return (
      <main className="max-w-7xl mx-auto px-4 ">
        <div className="container mx-auto">
          <h2 className="lg:text-2xl text-xl font-bold border-b pb-2 border-gray-100 text-[#1a66ca]">
            আমার এলাকার খবর
          </h2>

          <div className="mt-6 flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1 w-full pr-2 border-r border-gray-100">
              <NewsListClient
                key={`location-global-${locationId}`}
                initialData={articlesList}
                initialMeta={meta}
                fetchParams={{
                  locationId,
                  limit: 10,
                  useLocationApi: true,
                }}
              />
            </div>

            <div className="w-full lg:w-80 shrink-0 sticky top-4">
              <LocationFilter initialLocationId={locationId} />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Combined standard fetching to fix 'sliderResponse' unused warning
  const videosResponse = await getVideos({ page: 1, limit: 9 });

  const galleryVideos = videosResponse?.data || [];
  const galleryMeta = videosResponse?.meta || {
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1,
  };

  const categoriesRes = await getAllcategories();
  const categoriesList: Category[] = categoriesRes?.data || [];

  // Fetch national (জাতীয়) category articles
  const nationalCategory = categoriesList.find(c => c.slug === "national");
  let recentArticles: Article[] = [];
  if (nationalCategory) {
    const nationalRes = await getArticles({
      categoryId: nationalCategory.id,
      limit: 4,
      status: "Published",
    });
    recentArticles = nationalRes?.data || [];
  }

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

  const categoriesData = await Promise.all([
    getCategoryData("international"),
    getCategoryData("sports"),
    getCategoryData("economy"),
    getCategoryData("business"),
  ]);

  // Fetch Khela/Sports category for the slider
  const khelaCat = categoriesList.find(
    (c) => c.slug === "kheladula" || c.slug === "sports",
  );
  let khelaArticles: Article[] = [];
  let khelaTitle = "খেলাধুলা";
  let khelaSlug = "kheladula";

  let politicsArticles: Article[] = [];
  let politicsTitle = "রাজনীতি";
  let politicsSlug = "politics";

  if (khelaCat) {
    try {
      const khelaRes = await getArticles({
        categoryId: khelaCat.id,
        limit: 8,
        status: "Published",
      });
      khelaArticles = khelaRes?.data || [];
      khelaTitle = khelaCat.titleBn || khelaCat.title || "খেলাধুলা";
      khelaSlug = khelaCat.slug;
    } catch (err) {
      console.error("Failed to fetch khela articles:", err);
    }
  }

  // Fetch politics (রাজনীতি) category articles — 1 hero + up to 6 side cards
  const politicsCat = categoriesList.find(
    (c) => c.slug === "politics" || c.slug === "rajneeti" || c.slug === "রাজনীতি",
  );
  if (politicsCat) {
    try {
      const politicsRes = await getArticles({
        categoryId: politicsCat.id,
        limit: 7,
        status: "Published",
      });
      politicsArticles = politicsRes?.data || [];
      politicsTitle = politicsCat.titleBn || politicsCat.title || "রাজনীতি";
      politicsSlug = politicsCat.slug;
    } catch (err) {
      console.error("Failed to fetch politics articles:", err);
    }
  }

  // Fetch economy (অর্থনীতি) category articles — up to 8 cards for the slider
  const economyCat = categoriesList.find(
    (c) => c.slug === "economy" || c.slug === "orthoniti" || c.slug === "অর্থনীতি",
  );
  let economyArticles: Article[] = [];
  let economyTitle = "অর্থনীতি";
  let economySlug = "economy";

  if (economyCat) {
    try {
      const economyRes = await getArticles({
        categoryId: economyCat.id,
        limit: 8,
        status: "Published",
      });
      economyArticles = economyRes?.data || [];
      economyTitle = economyCat.titleBn || economyCat.title || "অর্থনীতি";
      economySlug = economyCat.slug;
    } catch (err) {
      console.error("Failed to fetch economy articles:", err);
    }
  }

  const galleryRes = await getImages({ page: 1, limit: 5 });
  const galleryArticles = galleryRes?.data || [];

  // Fetch the first active special event for the FeatureBanner
  let specialEvent = null;
  try {
    const specialEventsRes = await getSpecialEvents({ page: 1, limit: 1 });
    specialEvent = specialEventsRes?.data?.[0] ?? null;
  } catch (err) {
    console.error("Failed to fetch special events:", err);
  }

  const galleryItems = galleryArticles.map((article: imageArticle) => ({
    id: article.id,
    url: article.coverImage || "",
    title: article.title,
    description: article.description || "",
    timeAgo: article.date ? formatRelativeTime(article.date) : "",
    photographer: "নিজস্ব প্রতিবেদক",
    code: article.code,
  }));

  return (
    <main className="container mx-auto px-1.5 py-0 pb-2 flex flex-col gap-3 lg:gap-5">
      <FeatureBanner eventData={specialEvent} />
      <MainLayout />

      {/* Location Filter + Recent News Section */}
      <section className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Location Filter */}
          <div className="lg:col-span-4 h-fit">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 lg:p-6 shadow-sm border border-blue-100 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-brand text-white shadow-sm shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    আপনার এলাকার খবর
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    বিভাগ ও জেলা নির্বাচন করুন
                  </p>
                </div>
              </div>
              <LocationFilter />
            </div>
          </div>

          {/* Right: Recent News */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl p-5 lg:p-6 shadow-sm border border-gray-100 h-full">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                  <h3 className="text-lg font-bold text-gray-900">
                    জাতীয় খবর
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentArticles.length > 0 ? (
                  recentArticles.map((article: Article, idx: number) => (
                    <a
                      key={article.id || article.code || idx}
                      href={`/news/${article.category?.slug || article.category?.slugBn || ""}/${article.code}`}
                      className="group flex flex-col rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 bg-white shadow-xs hover:shadow-sm transition-all duration-200"
                    >
                      {/* Thumbnail */}
                      {article.coverImage && (
                        <div className="relative w-full h-36 sm:h-40 overflow-hidden bg-gray-100">
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 p-3">
                        <h4 className="text-base font-semibold text-gray-800 leading-snug group-hover:text-[#1a66ca] transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          {article.category?.titleBn && (
                            <span className="text-sm font-medium text-brand bg-blue-50 px-1.5 py-0.5 rounded-full">
                              {article.category.titleBn}
                            </span>
                          )}
                          {article.date && (
                            <span className="text-sm text-gray-400">
                              {new Date(article.date).toLocaleDateString(
                                "bn-BD",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="col-span-full py-10 text-center text-gray-400 text-sm">
                    কোনো সংবাদ পাওয়া যায়নি
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {politicsArticles.length > 0 && (
        <PoliticsSection articles={politicsArticles} />
      )}
      <SingleCategoryNewsGrid slug="national" limit={7} />
      {economyArticles.length > 0 && (
        <EconomySection
          articles={economyArticles}
          title={economyTitle}
          categorySlug={economySlug}
        />
      )}
      <SingleCategoryNewsGrid slug="international" limit={7} />
      <BinodonSection />
      <KhelaSlider
        articles={khelaArticles}
        title={khelaTitle}
        categorySlug={khelaSlug}
      />
      <SingleCategoryNewsGrid slug="education" limit={7} />

      <OthersCategories />
      <VideoGallery initialVideos={galleryVideos} initialMeta={galleryMeta} />
      <PhotoGallerySection items={galleryItems} title="ছবিঘর" />
      <ArchiveSection />
    </main>
  );
}
