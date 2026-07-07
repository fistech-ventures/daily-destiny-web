/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { ApiError } from "./api-error";
import { ArticleQueryParams, CategoryQueryParam } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  paramsSerializer: {
    indexes: null,
  },
  proxy: false,
});

// Normalize API errors into standard ApiError objects
api.interceptors.response.use(
  response => response,
  error => {
    if (axios.isAxiosError(error) && error.response) {
      const statusCode = error.response.status;
      const message = error.response.data?.message || error.message;

      let retryAfter;
      if (statusCode === 429) {
        const retryAfterHeader = error.response.headers["retry-after"];
        if (retryAfterHeader) {
          retryAfter = parseInt(retryAfterHeader, 10);
        }
      }

      throw new ApiError(statusCode, message, retryAfter);
    }
    throw error;
  },
);

export interface VideoArticle {
  id: string;
  title: string;
  code: string;
  excerpt: string;
  coverImage?: string;
  slug: string;
  createdAt: string;
  date: string;
  views?: string;
  source: "youtube" | "facebook" | "do-space";
  url: string;
  key: string;
  mimetype: string;
  extension: string;
}

export interface imageArticle {
  id: string | number;
  title: string;
  slug: string;
  createdAt: string;
  date: string;
  description: string;
  code: string;
  coverImage?: string;
  category?: any;
  images: {
    id: string | number;
    url: string;
    caption: string;
  }[];
}

export interface EpaperPage {
  id: string;
  isActive: boolean;
  date: string; // "YYYY-MM-DD"
  pageNumber: number;
  imageUrl: string;
  imageKey: string;
  thumbnailUrl: string;
  thumbnailKey: string;
  publicationName: string;
  title: string;
  mimetype: string;
  extension: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
}

// Get categories
export async function getAllcategories(query?: CategoryQueryParam) {
  try {
    const response = await api.get("/web/categories", {
      params: query,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

// Get trending topics/tags
export async function getTrendingTopics() {
  try {
    const response = await api.get("/web/tags");
    return response.data;
  } catch (error) {
    console.error("Error fetching trending topics:", error);
    throw error;
  }
}

// Get market price
export async function getMarketPrice(query?: {
  page?: number;
  limit?: number;
}) {
  try {
    const response = await api.get("/web/market-prices", {
      params: query,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching market price:", error);
    throw error;
  }
}

// Get articles
export async function getArticles(
  query?: ArticleQueryParams & { useLocationApi?: boolean },
) {
  try {
    const { useLocationApi, ...params } = query || {};

    // 1. Establish path roots without mixing string flags with object configurations
    const baseUrl = useLocationApi
      ? `${process.env.NEXT_PUBLIC_LOCATION_API_URL}/web/articles`
      : "/web/articles";

    // 2. Build the exact parameters object dynamically
    const finalParams: any = { ...params };

    // Only bind standard news types if we aren't routing to the remote locations instance
    if (!useLocationApi) {
      finalParams.type = "news";
    }

    // 3. Clean network execution passing variables inside the designated config scope
    const response = await api.get(baseUrl, {
      params: finalParams,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
}

// Get single article by slug
export async function getSingleArticle(slug: string) {
  try {
    const response = await api.get(`/web/articles/by-slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching single article:", error);
    throw error;
  }
}

// Get single article by code
export async function getArticleByCode(code: string) {
  try {
    const response = await api.get(`/web/articles/by-code/${code}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching single article by code:", error);
    throw error;
  }
}

// Get related articles by article code
export async function getRelatedArticles(code: string) {
  try {
    const response = await api.get(`/web/articles/${code}/related`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching related articles:", error);
    throw error;
  }
}

// Track article view event
export async function trackArticleView(
  articleId: string,
  sessionId?: string,
) {
  try {
    const response = await api.post(`/web/articles/${articleId}/events`, {
      eventType: "view",
      sessionId: sessionId || undefined,
    });
    return response.data;
  } catch (error) {
    // Silently fail — view tracking should never break the user experience
    console.error("Error tracking article view:", error);
  }
}

// Track article share event
export async function trackArticleShare(
  articleId: string,
  sessionId?: string,
){
   try {
    const response = await api.post(`/web/articles/${articleId}/events`, {
      eventType: "share",
      sessionId: sessionId || undefined,
    });
    return response.data;
  } catch (error) {
    // Silently fail — share tracking should never break the user experience
    console.error("Error tracking article share:", error);
  }
}

// Get videos
export async function getVideos(query?: { page?: number; limit?: number }) {
  try {
    const response = await api.get("/web/articles?type=video", {
      params: query,
    });

    const dataObj = response.data?.data || response.data || [];
    const items = Array.isArray(dataObj)
      ? dataObj
      : Array.isArray(dataObj.articles)
        ? dataObj.articles
        : [];

    const mappedData = items.map((article: any) => {
      const videoMedia = article.medias?.find(
        (m: any) =>
          m.source === "youtube" ||
          m.source === "facebook" ||
          m.mimetype?.includes("video"),
      );

      return {
        id: article.id,
        title: article.title || article.titleBn,
        excerpt: article.excerpt,
        coverImage: article.coverImage,
        slug: article.slug || article.code,
        code: article.code,
        category: article.category ?? article.categories?.[0] ?? null,
        date: article.date || article.createdAt,
        createdAt: article.createdAt,
        views: "0",
        // Media fields — pass directly, no re-mapping
        source: videoMedia?.source ?? "do-space",
        url: videoMedia?.url ?? "",
        key: videoMedia?.key ?? "",
        mimetype: videoMedia?.mimetype ?? "",
        extension: videoMedia?.extension ?? "",
      };
    });

    return {
      data: mappedData,
      meta: response.data?.meta || { total: mappedData.length },
    };
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
}

// Get single video by code (with full media details)
export async function getVideoByCode(
  code: string,
): Promise<VideoArticle | null> {
  try {
    const response = await getArticleByCode(code);
    const article = response?.data || response;

    if (!article) return null;

    const videoMedia = article.medias?.find(
      (m: any) =>
        m.source === "youtube" ||
        m.source === "facebook" ||
        m.mimetype?.includes("video"),
    );

    return {
      id: article.id,
      title: article.title || article.titleBn,
      excerpt: article.excerpt,
      coverImage: article.coverImage,
      slug: article.slug || article.code,
      code: article.code,
      date: article.date || article.createdAt,
      createdAt: article.createdAt,
      views: "0",
      source: videoMedia?.source ?? "do-space",
      url: videoMedia?.url ?? "",
      key: videoMedia?.key ?? "",
      mimetype: videoMedia?.mimetype ?? "",
      extension: videoMedia?.extension ?? "",
    };
  } catch (error) {
    console.error("Error fetching single video by code:", error);
    return null;
  }
}

// Get images
export async function getImages(query?: {
  page?: number;
  limit?: number;
}): Promise<{ data: imageArticle[]; meta: any }> {
  try {
    const response = await api.get("/web/articles?type=photo", {
      params: query,
    });

    const dataObj = response.data?.data || response.data || [];
    const items = Array.isArray(dataObj)
      ? dataObj
      : Array.isArray(dataObj.articles)
        ? dataObj.articles
        : [];

    const mapped = items.map((article: any) => ({
      id: article.id,
      title: article.titleBn || article.title,
      description: article.excerpt || article.details || "",
      slug: article.slug,
      date: article.date || article.createdAt,
      code: article.code,
      category: article.category ?? article.categories?.[0] ?? null,
      createdAt: article.createdAt,
      coverImage: article.coverImage,
      images: (article.medias || []).map((m: any, idx: number) => ({
        id: m.id || idx,
        url: m.url || article.coverImage,
        caption: m.caption || m.title || "",
      })),
    }));

    return {
      data: mapped,
      meta: response.data?.meta || { total: mapped.length },
    };
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
}

// Get single image
export async function getSingleImage(
  code: string,
): Promise<imageArticle | null> {
  try {
    const response = await api.get(`/web/articles/by-code/${code}`);
    const article = response.data?.data || response.data;

    if (!article) return null;

    return {
      id: article.id,
      title: article.titleBn || article.title,
      description: article.excerpt || article.details || "",
      slug: article.slug,
      code: article.code,
      category: article.category ?? article.categories?.[0] ?? null,
      createdAt: article.createdAt,
      date: article.date || article.createdAt,
      coverImage: article.coverImage,
      images: (article.medias || []).map((m: any, idx: number) => ({
        id: m.id || idx,
        url: m.url || article.coverImage,
        caption: m.caption || m.title || "",
      })),
    };
  } catch (error) {
    console.error("Error fetching single image:", error);
    throw error;
  }
}

// Get related images
export async function getRelatedImages(
  id: number | string,
): Promise<imageArticle[]> {
  try {
    const response = await api.get(`/web/articles/${id}/related`);
    const dataObj = response.data?.data || response.data || [];

    const items = Array.isArray(dataObj)
      ? dataObj
      : Array.isArray(dataObj.articles)
        ? dataObj.articles
        : [];

    return items.map((article: any) => ({
      id: article.id,
      title: article.titleBn || article.title,
      description: article.excerpt || article.details || "",
      slug: article.slug,
      code: article.code,
      date: article.date || article.createdAt,
      category: article.category ?? article.categories?.[0] ?? null,
      createdAt: article.createdAt,
      coverImage: article.coverImage,
      images: (article.medias || []).map((m: any, idx: number) => ({
        id: m.id || idx,
        url: m.url || article.coverImage,
        caption: m.caption || m.title || "",
      })),
    }));
  } catch (error) {
    console.error("Error fetching related images:", error);
    throw error;
  }
}

// Get global configs
export async function getGlobalConfigs() {
  try {
    const response = await api.get("/web/global-configs");
    return response.data;
  } catch (error) {
    console.error("Error fetching global configs:", error);
    throw error;
  }
}

// Get page status
export async function getPage(slug: string) {
  try {
    const response = await api.get(`/web/pages/by-slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching page:", error);
    throw error;
  }
}

// Submit contact form
export async function submitContactForm(data: {
  fullName: string;
  email: string;
  phoneNumber: string;
  purpose: string;
  message: string;
}) {
  try {
    const response = await api.post("/web/query", data);
    return response.data;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }
}

export async function getLocationTree(): Promise<any[]> {
  try {
    const locationBaseUrl = process.env.NEXT_PUBLIC_LOCATION_API_URL;
    const response = await api.get(`${locationBaseUrl}/web/locations/tree`);
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching location tree:", error);
    throw error;
  }
}



// Get all active e-papers with filters
export async function getEpapers(query?: {
  page?: number;
  limit?: number;
  publicationName?: string;
  date?: string;
}): Promise<{ data: EpaperPage[]; meta: any }> {
  try {
    const locationBaseUrl = process.env.NEXT_PUBLIC_LOCATION_API_URL;
    const response = await api.get(`${locationBaseUrl}/web/epapers`, { params: query });
    return {
      data: response.data?.data || [],
      meta: response.data?.meta || {},
    };
  } catch (error) {
    console.error("Error fetching e-papers:", error);
    throw error;
  }
}

// Get a single e-paper page by ID
export async function getEpaperById(id: string): Promise<EpaperPage | null> {
  try {
    const locationBaseUrl = process.env.NEXT_PUBLIC_LOCATION_API_URL;
    const response = await api.get(`${locationBaseUrl}/web/epapers/${id}`);
    return response.data?.data || null;
  } catch (error) {
    console.error("Error fetching e-paper by id:", error);
    throw error;
  }
}

// Get e-papers by date range
export async function getEpapersByDateRange(query: {
  dateFrom: string;
  dateTo: string;
  publicationName?: string;
}): Promise<EpaperPage[]> {
  try {
    const locationBaseUrl = process.env.NEXT_PUBLIC_LOCATION_API_URL;
    const response = await api.get(`${locationBaseUrl}/web/epapers/date-range`, {
      params: query,
    });
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching e-papers by date range:", error);
    throw error;
  }
}

// Get all available dates for e-papers (used to find the latest edition and
// to populate the date picker)
export async function getEpaperDates(
  publicationName?: string,
): Promise<string[]> {
  try {
    const locationBaseUrl = process.env.NEXT_PUBLIC_LOCATION_API_URL;
    const response = await api.get(`${locationBaseUrl}/web/epapers/dates`, {
      params: publicationName ? { publicationName } : undefined,
    });
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching e-paper dates:", error);
    throw error;
  }
}

// Get all pages for a specific date
export async function getEpaperPagesByDate(
  date: string,
  publicationName?: string,
): Promise<EpaperPage[]> {
  try {
    const locationBaseUrl = process.env.NEXT_PUBLIC_LOCATION_API_URL;
    const response = await api.get(`${locationBaseUrl}/web/epapers/pages/${date}`, {
      params: publicationName ? { publicationName } : undefined,
    });
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching e-paper pages by date:", error);
    throw error;
  }
}

// ─── Epaper Visual Edition (new layout with hotspots) ──────────────────────

export interface Hotspot {
  id: string;
  isActive: boolean;
  title: string | null;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface EpaperVisualPage {
  id: string;
  isActive: boolean;
  pageNumber: number;
  imageUrl: string;
  hotspots: Hotspot[];
}

export interface EpaperVisualEdition {
  id: string;
  isActive: boolean;
  publishDate: string;
  status: string;
  pages: any[]; // Replace with your complete EpaperVisualPage definition if necessary
}

// Helper to validate and safely parse date parameters
function sanitizeDateParam(date: string): string | null {
  if (!date || date.includes("NaN") || date === "undefined") {
    return null;
  }
  // Extracts only the pure YYYY-MM-DD segment from any localized or ISO timestamps
  return date.split("T")[0];
}

// Get latest visual edition
export async function getLatestVisualEdition(): Promise<EpaperVisualEdition | null> {
  try {
    const locationBaseUrl = process.env.NEXT_PUBLIC_LOCATION_API_URL;
    const response = await api.get(
      `${locationBaseUrl}/web/epaper-visual/editions/latest`,
    );
    return response.data?.data || null;
  } catch (error) {
    console.error("Error fetching latest visual edition:", error);
    return null;
  }
}

// Get visual edition by ID
export async function getVisualEditionById(
  id: string,
): Promise<EpaperVisualEdition | null> {
  try {
    const locationBaseUrl = process.env.NEXT_PUBLIC_LOCATION_API_URL;
    const response = await api.get(
      `${locationBaseUrl}/web/epaper-visual/editions/${id}`,
    );
    return response.data?.data || null;
  } catch (error) {
    console.error("Error fetching visual edition by id:", error);
    return null;
  }
}

// FIXED: Get visual edition by date (Matches Swagger schema /editions/{date})
export async function getVisualEditionByDate(
  date: string,
): Promise<EpaperVisualEdition | null> {
  try {
    const sanitizedDate = sanitizeDateParam(date);
    if (!sanitizedDate) {
      console.warn(
        "Invalid date parameter intercepted inside API layer. Falling back.",
      );
      return await getLatestVisualEdition();
    }

    const locationBaseUrl = process.env.NEXT_PUBLIC_LOCATION_API_URL;
    // Removed the redundant "/date" path segment to align with Swagger definition
    const response = await api.get(
      `${locationBaseUrl}/web/epaper-visual/editions/${sanitizedDate}`,
    );
    return response.data?.data || null;
  } catch (error) {
    console.error("Error fetching visual edition by date:", error);
    return null;
  }
}

// Get all visual edition dates
// Falls back to the latest edition's publishDate when the API endpoint is broken
export async function getVisualEditionDates(): Promise<string[]> {
  try {
    const locationBaseUrl = process.env.NEXT_PUBLIC_LOCATION_API_URL;
    const response = await api.get(
      `${locationBaseUrl}/web/epaper-visual/editions/dates`,
    );
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching visual edition dates:", error);
    // Fallback: derive dates from the latest edition
    try {
      const latest = await getLatestVisualEdition();
      if (latest?.publishDate) {
        return [latest.publishDate];
      }
    } catch {
      // ignore
    }
    return [];
  }
}

// Get all publication names
export async function getEpaperPublications(): Promise<string[]> {
  try {
    const locationBaseUrl = process.env.NEXT_PUBLIC_LOCATION_API_URL;
    const response = await api.get(`${locationBaseUrl}/web/epapers/publications`);
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching e-paper publications:", error);
    throw error;
  }
}


// Get Special Events
export async function getSpecialEvents(query?: {
  page?: number;
  limit?: number;
}) {
  try {
    const response = await api.get("/web/special-events", {
      params: query,
    });
    return response.data; // Returns { success, statusCode, message, meta, data: [...] }
  } catch (error) {
    console.error("Error fetching special events:", error);
    throw error;
  }
}