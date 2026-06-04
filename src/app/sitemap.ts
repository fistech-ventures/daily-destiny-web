import { routing } from "@/i18n/routing";
import {
  getAllcategories,
  getArticles,
  getImages,
  getTrendingTopics,
  getVideos,
  imageArticle,
  VideoArticle,
} from "@/lib/api";
import { Article, Category } from "@/lib/types";
import { MetadataRoute } from "next";

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const PAGE_LIMIT = 500;
const MAX_PAGES = 20;
const LOCALES = routing.locales;

function normalizeDate(input?: string): Date {
  if (!input) return new Date();
  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function buildLocalePath(locale: string, path: string): string {
  return `/${locale}${path === "/" ? "" : path}`;
}

function buildLocalizedEntry(
  path: string,
  lastModified: Date,
  changeFrequency: ChangeFrequency,
  priority: number,
): MetadataRoute.Sitemap[number] {
  const localizedUrls = Object.fromEntries(
    LOCALES.map((locale) => [
      locale,
      `${SITE_URL}${buildLocalePath(locale, path)}`,
    ]),
  );

  const defaultLocalePath = buildLocalePath(routing.defaultLocale, path);

  return {
    url: `${SITE_URL}${defaultLocalePath}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: localizedUrls,
    },
  };
}

async function fetchAllNewsEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const response = await getArticles({ page, limit: PAGE_LIMIT });
    const data = response?.data || [];
    const meta = response?.meta;

    if (!data.length) break;

    data.forEach((article: Article) => {
      if (!article?.category?.slug || !article?.code) return;
      entries.push(
        buildLocalizedEntry(
          `/news/${article.category.slug}/${article.code}`,
          normalizeDate(article.updatedAt),
          "hourly",
          0.9,
        ),
      );
    });

    if (
      !meta?.total ||
      !meta?.limit ||
      page >= Math.ceil(meta.total / meta.limit)
    ) {
      break;
    }
  }

  return entries;
}

async function fetchAllCategoryEntries(): Promise<MetadataRoute.Sitemap> {
  const response = await getAllcategories();
  const categories = response?.data || [];

  return categories
    .filter((category: Category) => Boolean(category?.slug))
    .map((category: Category) =>
      buildLocalizedEntry(
        `/${category.slug}`,
        normalizeDate(category.updatedAt),
        "hourly",
        0.8,
      ),
    );
}

async function fetchAllVideoEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const response = await getVideos({ page, limit: PAGE_LIMIT });
    const videos = response?.data || [];
    const meta = response?.meta;

    if (!videos.length) break;

    videos.forEach((video: VideoArticle) => {
      if (!video?.slug) return;
      entries.push(
        buildLocalizedEntry(
          `/video/${video.slug}`,
          normalizeDate(video.createdAt || video.date),
          "daily",
          0.7,
        ),
      );
    });

    if (
      !meta?.total ||
      !PAGE_LIMIT ||
      page >= Math.ceil(meta.total / PAGE_LIMIT)
    ) {
      break;
    }
  }

  return entries;
}

async function fetchAllGalleryEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const response = await getImages({ page, limit: PAGE_LIMIT });
    const galleries = response?.data || [];
    const meta = response?.meta;

    if (!galleries.length) break;

    galleries.forEach((gallery: imageArticle) => {
      const galleryKey = gallery?.code || gallery?.slug;
      if (!galleryKey) return;
      entries.push(
        buildLocalizedEntry(
          `/gallery/${galleryKey}`,
          normalizeDate(gallery.createdAt || gallery.date),
          "daily",
          0.7,
        ),
      );
    });

    if (
      !meta?.total ||
      !PAGE_LIMIT ||
      page >= Math.ceil(meta.total / PAGE_LIMIT)
    ) {
      break;
    }
  }

  return entries;
}

async function fetchTopicEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const response = await getTrendingTopics();
    const data = response?.data || response || [];

    if (!Array.isArray(data)) return [];

    return data
      .map((item) => {
        if (typeof item === "string") return item;
        return item?.slug || item?.name || item?.title || "";
      })
      .filter(Boolean)
      .map((topicSlug: string) =>
        buildLocalizedEntry(
          `/topic/${encodeURIComponent(topicSlug)}`,
          new Date(),
          "daily",
          0.6,
        ),
      );
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const staticPaths = [
      { path: "/", freq: "hourly" as const, priority: 1 },
      { path: "/recent", freq: "hourly" as const, priority: 0.9 },
      { path: "/video", freq: "hourly" as const, priority: 0.9 },
      { path: "/gallery", freq: "hourly" as const, priority: 0.8 },
      { path: "/search", freq: "daily" as const, priority: 0.6 },
      { path: "/pricing", freq: "weekly" as const, priority: 0.5 },
      { path: "/privacy", freq: "monthly" as const, priority: 0.3 },
      { path: "/terms", freq: "monthly" as const, priority: 0.3 },
    ];

    const staticEntries = staticPaths.map((entry) =>
      buildLocalizedEntry(entry.path, new Date(), entry.freq, entry.priority),
    );

    const [
      newsEntries,
      categoryEntries,
      videoEntries,
      galleryEntries,
      topicEntries,
    ] = await Promise.all([
      fetchAllNewsEntries(),
      fetchAllCategoryEntries(),
      fetchAllVideoEntries(),
      fetchAllGalleryEntries(),
      fetchTopicEntries(),
    ]);

    return [
      ...staticEntries,
      ...newsEntries,
      ...categoryEntries,
      ...videoEntries,
      ...galleryEntries,
      ...topicEntries,
    ];
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return [buildLocalizedEntry("/", new Date(), "daily", 1)];
  }
}
