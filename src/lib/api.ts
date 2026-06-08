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
  (response) => response,
  (error) => {
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
export async function getArticles(query?: ArticleQueryParams) {
  try {
    const response = await api.get("/web/articles?type=news", {
      params: query,
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

// Get related articles
export async function getRelatedArticles(id: string) {
  try {
    const response = await api.get(`/web/articles/${id}/related`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching related articles:", error);
    throw error;
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
        category: article.category,
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
export async function getVideoByCode(code: string): Promise<VideoArticle | null> {
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
export async function getImages(query?: { page?: number; limit?: number }): Promise<{ data: imageArticle[]; meta: any }> {
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
      category: article.category,
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
export async function getSingleImage(code: string): Promise<imageArticle | null> {
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
      category: article.category,
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
export async function getRelatedImages(id: number | string): Promise<imageArticle[]> {
  try {
    const response = await api.get(`/web/articles/${id}/related`);
    const dataObj = response.data?.data || response.data || [];

    // The API might return an object with an 'articles' array instead of a direct array
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
      category: article.category,
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
}) {
  try {
    const response = await api.post("/web/query", data);
    return response.data;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }
}
