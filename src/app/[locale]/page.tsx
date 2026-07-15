import MainLayout from "@/components/home/main-layout";
import VideoGallery from "@/components/home/video-gallery";
import { generateHomeMetadata } from "@/lib/metadata";
import { setRequestLocale } from "next-intl/server";
import {
  getVideos,
  getArticles,
  getAllcategories,
  getImages,
  getSpecialEvents,
} from "@/lib/api";
import { Category, Article } from "@/lib/types";
import { imageArticle } from "@/lib/api";
import { getArticleCategory } from "@/lib/utils";
import PhotoGallerySection from "@/components/gallery/PhotoGallerySection";
import ArchiveSection from "@/components/archive/archive-section";
import { formatRelativeTime } from "@/utils/date-formatter";
import SingleCategoryNewsGrid from "@/components/category/SingleCategoryNewsGrid";
import NewsListClient from "@/components/news/news-list-client";
import LocationFilter from "@/components/category/categoryfilter";
import OthersCategories from "@/components/category/OthersCategroies";
import FeatureBanner from "@/components/feature-banner/FeatureBanner";
import AdBanner from "@/components/shared/ad-banner";
import BinodonSection from "@/components/home/article/binodon-section";
import KhelaSlider from "@/components/home/article/khela-slider";
import PoliticsSection from "@/components/home/article/polititcs-section";
import EconomySection from "@/components/home/article/economy-section";
import LatestNewsSection from "@/components/news/latest-news-section";
import Link from "next/link";
import ArticleTitle from "@/components/shared/article-title";

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

            <div className="w-full lg:w-80 shrink-0 sticky top-4"></div>
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
      limit: 5,
      status: "Published",
      includeMultiCategory: true,
    });
    recentArticles = nationalRes?.data || [];
  }

  // Fetch Khela/Sports category for the slider
  const khelaCat = categoriesList.find(
    c => c.slug === "kheladula" || c.slug === "sports",
  );
  let khelaArticles: Article[] = [];
  let khelaTitle = "খেলাধুলা";
  let khelaSlug = "kheladula";

  let politicsArticles: Article[] = [];
  // const politicsTitle = "রাজনীতি";
  // const politicsSlug = "politics";

  if (khelaCat) {
    try {
      const khelaRes = await getArticles({
        categoryId: khelaCat.id,
        limit: 8,
        status: "Published",
        includeMultiCategory: true,
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
    c => c.slug === "politics" || c.slug === "rajneeti" || c.slug === "রাজনীতি",
  );
  if (politicsCat) {
    try {
      const politicsRes = await getArticles({
        categoryId: politicsCat.id,
        limit: 7,
        status: "Published",
        includeMultiCategory: true,
      });
      politicsArticles = politicsRes?.data || [];
      // politicsTitle = politicsCat.titleBn || politicsCat.title || "রাজনীতি";
      // politicsSlug = politicsCat.slug;
    } catch (err) {
      console.error("Failed to fetch politics articles:", err);
    }
  }

  // Fetch religion (ধর্ম) category articles — 1 hero + up to 6 side cards (Politics pattern)
  const religionCat = categoriesList.find(
    c => c.slug === "religion" || c.slug === "dhormo" || c.slug === "islam",
  );
  let religionArticles: Article[] = [];
  if (religionCat) {
    try {
      const religionRes = await getArticles({
        categoryId: religionCat.id,
        limit: 7,
        status: "Published",
        includeMultiCategory: true,
      });
      religionArticles = religionRes?.data || [];
    } catch (err) {
      console.error("Failed to fetch religion articles:", err);
    }
  }

  // Fetch law-order (আইন-আদালত) category articles — 1 hero + up to 6 side cards (Politics pattern)
  const lawCat = categoriesList.find(
    c => c.slug === "law-order" || c.slug === "law",
  );
  let lawArticles: Article[] = [];
  if (lawCat) {
    try {
      const lawRes = await getArticles({
        categoryId: lawCat.id,
        limit: 7,
        status: "Published",
        includeMultiCategory: true,
      });
      lawArticles = lawRes?.data || [];
    } catch (err) {
      console.error("Failed to fetch law articles:", err);
    }
  }

  // Fetch technology (তথ্যপ্রযুক্তি) category articles — up to 8 cards for the slider
  const techCat = categoriesList.find(
    c => c.slug === "information-technology" || c.slug === "technology" || c.slug === "tech",
  );
  let techArticles: Article[] = [];
  let techTitle = "প্রযুক্তি";
  let techSlug = "technology";
  if (techCat) {
    try {
      const techRes = await getArticles({
        categoryId: techCat.id,
        limit: 8,
        status: "Published",
        includeMultiCategory: true,
      });
      techArticles = techRes?.data || [];
      techTitle = techCat.titleBn || techCat.title || "প্রযুক্তি";
      techSlug = techCat.slug;
    } catch (err) {
      console.error("Failed to fetch tech articles:", err);
    }
  }

  // Fetch economy (অর্থনীতি) category articles — up to 8 cards for the slider
  const economyCat = categoriesList.find(
    c =>
      c.slug === "economy" || c.slug === "orthoniti" || c.slug === "অর্থনীতি",
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
        includeMultiCategory: true,
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
    <main className="container mx-auto px-1.5 py-0 pb-2 flex flex-col">
      {/* ── TOP BANNER ── */}
      <div className="mb-3 lg:mb-5">
        <AdBanner className="rounded-lg" altText="হোমপেজ বিজ্ঞাপন" />
      </div>

      <div className="mb-3 lg:mb-5">
        <FeatureBanner eventData={specialEvent} />
      </div>

      <div className="mb-3 lg:mb-5">
        <MainLayout />
      </div>

      <section className="w-full mb-3 lg:mb-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Location Filter (50%) + Advertisement (50%) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex-[1_1_0%] bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 lg:p-6 shadow-sm border border-blue-100">
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
            <div className="flex-[1_1_0%]">
              <AdBanner
                className="rounded-lg h-full"
                altText="এলাকার সংবাদ বিজ্ঞাপন"
              />
            </div>
          </div>

          {/* Right: National News — Top row: 2 cards | Bottom row: 2 cards */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl p-5 lg:p-6 shadow-sm border border-gray-100 h-full">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                  <Link href="/national">
                    <h3 className="text-lg font-bold text-gray-900 cursor-pointer hover:text-[#1a66ca] transition-colors">
                      জাতীয়
                    </h3>
                  </Link>
                </div>
              </div>

              {recentArticles.length > 0 ? (
                <div className="flex flex-col gap-5">
                  {/* Top row: 2 cards side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recentArticles
                      .slice(0, 2)
                      .map((article: Article, idx: number) => (
                        <a
                          key={article.id || article.code || idx}
                          href={`/news/${getArticleCategory(article)?.slug || getArticleCategory(article)?.slugBn || ""}/${article.code}`}
                          className="group flex flex-col rounded-xl overflow-hidden border border-gray-100 hover:border-gray-300 bg-white shadow-sm hover:shadow-lg transition-all duration-200"
                        >
                          {/* Thumbnail */}
                          {article.coverImage && (
                            <div className="relative w-full h-48 sm:h-52 lg:h-60 overflow-hidden bg-gray-100">
                              <img
                                src={article.coverImage}
                                alt={article.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                              {/* Gradient overlay for better text readability */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                              {/* Category badge */}
                              {getArticleCategory(article)?.titleBn && (
                                <span className="absolute top-3 left-3 text-xs font-semibold text-white bg-red-600 px-2.5 py-1 rounded-full shadow-sm">
                                  {getArticleCategory(article)?.titleBn}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Content */}
                          <div className="p-4 flex flex-col">
                            <h4
                              className="text-lg font-bold text-gray-900 leading-snug group-hover:text-[#1a66ca] transition-colors"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                width: "100%",
                              }}
                            >
                              {article.title}
                            </h4>
                            {article.excerpt && (
                              <p
                                className="text-sm text-gray-500 mt-2"
                                style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  width: "100%",
                                }}
                              >
                                {article.excerpt}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-2 pt-2">
                              {article.date && (
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  {new Date(article.date).toLocaleDateString(
                                    "bn-BD",
                                    {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    },
                                  )}
                                </span>
                              )}
                              {/* <span className="text-xs font-medium text-[#1a66ca] group-hover:underline">
                                বিস্তারিত →
                              </span> */}
                            </div>
                          </div>
                        </a>
                      ))}
                  </div>

                  {/* Bottom row: 3 small cards — 2-col on mobile, 3-col on tablet+ */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {recentArticles
                      .slice(2, 5)
                      .map((article: Article, idx: number) => (
                        <a
                          key={article.id || article.code || idx}
                          href={`/news/${getArticleCategory(article)?.slug || getArticleCategory(article)?.slugBn || ""}/${article.code}`}
                          className={`group flex flex-col bg-white border border-gray-100 rounded-lg overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all ${idx === 2 ? "col-span-2 sm:col-span-1" : ""}`}
                        >
                          {/* Thumbnail */}
                          {article.coverImage && (
                            <div className="relative w-full h-32 sm:h-36 overflow-hidden bg-gray-100">
                              <img
                                src={article.coverImage}
                                alt={article.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                              />
                            </div>
                          )}

                          {/* Content */}
                          <div className="p-3">
                            <h4
                              className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-[#1a66ca] transition-colors"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                width: "100%",
                              }}
                            >
                              {article.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-2">
                              {getArticleCategory(article)?.titleBn && (
                                <span className="text-[10px] font-medium text-brand bg-blue-50 px-1.5 py-0.5 rounded-full">
                                  {getArticleCategory(article)?.titleBn}
                                </span>
                              )}
                            </div>
                          </div>
                        </a>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center text-gray-400 text-sm">
                  কোনো সংবাদ পাওয়া যায়নি
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── POLITICS, RELIGION & LAW — Hero + Side Cards Group ── */}
      <div className="space-y-6 lg:space-y-8 mb-3 lg:mb-5">
        {politicsArticles.length > 0 && (
          <PoliticsSection articles={politicsArticles} />
        )}

      </div>

      {/* ── DIVIDER ── */}
      <div className="border-t border-gray-100 my-3 lg:my-5" />

      {/* ── LATEST, INTERNATIONAL & ECONOMY ── */}
      <div className="space-y-6 lg:space-y-8 mb-3 lg:mb-5">
        <LatestNewsSection />
        <SingleCategoryNewsGrid slug="international" limit={7} />
        {economyArticles.length > 0 && (
          <EconomySection
            articles={economyArticles}
            title={economyTitle}
            categorySlug={economySlug}
          />
        )}
      </div>

      {/* ── DIVIDER ── */}
      <div className="border-t border-gray-100 my-3 lg:my-5" />

      {/* ── ADVERTISEMENT ── */}
      <div className="mb-3 lg:mb-5">
        <AdBanner className="rounded-lg" altText="মাঝপাতার বিজ্ঞাপন" />
      </div>

      {/* ── ENTERTAINMENT, SPORTS & EDUCATION ── */}
      <div className="space-y-6 lg:space-y-8 mb-3 lg:mb-5">
        <BinodonSection />
        <KhelaSlider
          articles={khelaArticles}
          title={khelaTitle}
          categorySlug={khelaSlug}
        />
        <SingleCategoryNewsGrid slug="education" limit={7} />

        {techArticles.length > 0 && (
          <KhelaSlider
            articles={techArticles}
            title={techTitle}
            categorySlug={techSlug}
          />
        )}
      </div>
      <div className="space-y-6 lg:space-y-8 mb-3 lg:mb-5">

        {religionArticles.length > 0 && (
          <PoliticsSection articles={religionArticles} />
        )}

        {lawArticles.length > 0 && (
          <PoliticsSection articles={lawArticles} />
        )}
      </div>

      {/* ── DIVIDER ── */}
      <div className="border-t border-gray-100 my-3 lg:my-5" />

      {/* ── OPINION, HEALTH, LIFESTYLE & CAMPUS — 1+3+3 Grid Group ── */}
      <div className="space-y-6 lg:space-y-8 mb-3 lg:mb-5">
        <SingleCategoryNewsGrid slug="opinion" limit={7} />
        <SingleCategoryNewsGrid slug="health" limit={7} />
        <SingleCategoryNewsGrid slug="lifestyle" limit={7} />
        <SingleCategoryNewsGrid slug="campus" limit={7} />
      </div>

      {/* ── DIVIDER ── */}
      <div className="border-t border-gray-100 my-3 lg:my-5" />

      {/* ── OTHERS, GALLERY & ARCHIVE ── */}
      <div className="space-y-6 lg:space-y-8 mb-3 lg:mb-5">
        <OthersCategories />
        <VideoGallery initialVideos={galleryVideos} initialMeta={galleryMeta} />
        <PhotoGallerySection items={galleryItems} title="ছবিঘর" />
        <ArchiveSection />
      </div>

    </main>
  );
}
