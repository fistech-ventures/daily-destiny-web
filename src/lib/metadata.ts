import { Metadata } from "next";
import { Article, Category } from "@/lib/types";

const SITE_NAME =
  "Daily Destiny - Bangla News Portal, Breaking News, Bd News and Videos";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dailydestiny.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || "";
const FALLBACK_IMAGE = "/images/logo.png";
const DEFAULT_DESCRIPTION =
  "Read today's breaking news of bangladesh on politics, sports, business, entertainment, weather, lifestyle, education and bd news from popular bangla news portal Daily Destiny";
const SUPPORTED_LOCALES = ["en", "bn"] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
const MAX_META_TITLE_LENGTH = 70;
const MAX_META_DESCRIPTION_LENGTH = 160;

interface MetadataOptions {
  path?: string;
  locale?: string;
  noIndex?: boolean;
}

const baseMetadata = {
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: SITE_NAME,
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image" as const,
  },
};

function safeOrigin(value: string): string | null {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function pickImage(article: Article): string {
  if (article.seoMetaData?.image) {
    return article.seoMetaData.image;
  } else if (article.coverImage) {
    return article.coverImage;
  }
  const mediaImage = article.medias?.find((media) => Boolean(media?.url))?.url;
  return mediaImage || FALLBACK_IMAGE;
}

function toMetadataImageUrl(image: string): string {
  const normalizedImage = image.trim();
  if (!normalizedImage) return FALLBACK_IMAGE;

  if (
    normalizedImage.startsWith("http://") ||
    normalizedImage.startsWith("https://")
  ) {
    return normalizedImage;
  }

  if (normalizedImage.startsWith("//")) {
    return `https:${normalizedImage}`;
  }

  if (normalizedImage.startsWith("/images/")) {
    return normalizedImage;
  }

  const mediaOrigin = safeOrigin(MEDIA_URL) || safeOrigin(API_URL);
  if (!mediaOrigin) {
    return normalizedImage;
  }

  try {
    return new URL(normalizedImage, mediaOrigin).toString();
  } catch {
    return normalizedImage;
  }
}

function getNormalizedPath(path?: string): string {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function resolveLocale(locale?: string): SupportedLocale {
  if (locale === "bn") return "bn";
  return "en";
}

function getOpenGraphLocale(locale?: string): string {
  return resolveLocale(locale) === "bn" ? "bn_BD" : "en_US";
}

function sanitizeMetaValue(
  value: string | undefined,
  fallback: string,
  maxLength: number,
): string {
  const normalized = (value || "").replace(/\s+/g, " ").trim();
  const base = normalized || fallback;
  if (base.length <= maxLength) return base;
  return `${base.slice(0, maxLength - 1).trimEnd()}…`;
}

function buildCanonicalUrl(options?: MetadataOptions): string {
  const normalizedPath = getNormalizedPath(options?.path);
  const locale = resolveLocale(options?.locale);
  const pagePath = `/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;
  return `${SITE_URL}${pagePath}`;
}

function buildRobots(noIndex?: boolean): Metadata["robots"] {
  if (noIndex) {
    return {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    };
  }

  return {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

function getPageMetadataOptions(
  options?: MetadataOptions,
): Pick<Metadata, "alternates" | "robots"> {
  const normalizedPath = getNormalizedPath(options?.path);
  const currentLocale = resolveLocale(options?.locale);

  const languageAlternates = SUPPORTED_LOCALES.reduce<Record<string, string>>(
    (acc, locale) => {
      acc[locale] = `/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;
      return acc;
    },
    {},
  );

  return {
    alternates: {
      canonical: `/${currentLocale}${normalizedPath === "/" ? "" : normalizedPath}`,
      languages: languageAlternates,
    },
    robots: buildRobots(options?.noIndex),
  };
}

export function generateArticleMetadata(
  article: Article,
  options?: MetadataOptions,
): Metadata {
  const title = sanitizeMetaValue(
    article.seoMetaData?.title || article.title,
    SITE_NAME,
    MAX_META_TITLE_LENGTH,
  );
  const description = sanitizeMetaValue(
    article.seoMetaData?.description || article.excerpt,
    DEFAULT_DESCRIPTION,
    MAX_META_DESCRIPTION_LENGTH,
  );
  const keywords = article.seoMetaData?.keywords || [];
  const image = toMetadataImageUrl(pickImage(article));
  const openGraphLocale = getOpenGraphLocale(options?.locale);

  return {
    ...baseMetadata,
    title,
    description,
    keywords,
    openGraph: {
      ...baseMetadata.openGraph,
      locale: openGraphLocale,
      title,
      url: buildCanonicalUrl(options),
      description,
      type: "article",
      publishedTime: article.date,
      modifiedTime: article.updatedAt,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
      images: [image],
    },
    other: {
      "fb:app_id": "894441286946544",
    },
    ...getPageMetadataOptions(options),
  };
}

export function generateCategoryMetadata(
  category: Category,
  options?: MetadataOptions,
): Metadata {
  const locale = resolveLocale(options?.locale);
  const localizedTitle = locale === "bn" ? category.titleBn : category.title;
  const title = sanitizeMetaValue(
    category.seoMetaData?.title || localizedTitle,
    SITE_NAME,
    MAX_META_TITLE_LENGTH,
  );
  const description = sanitizeMetaValue(
    category.seoMetaData?.description ||
      `${localizedTitle} - ${DEFAULT_DESCRIPTION}`,
    DEFAULT_DESCRIPTION,
    MAX_META_DESCRIPTION_LENGTH,
  );
  const keywords = category.seoMetaData?.keywords || [];
  const openGraphLocale = getOpenGraphLocale(options?.locale);

  return {
    ...baseMetadata,
    title,
    description,
    keywords,
    openGraph: {
      ...baseMetadata.openGraph,
      locale: openGraphLocale,
      url: buildCanonicalUrl(options),
      title,
      description,
      type: "website",
      images: [{ url: FALLBACK_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
      images: [FALLBACK_IMAGE],
    },
    ...getPageMetadataOptions(options),
  };
}

export function generateHomeMetadata(options?: MetadataOptions): Metadata {
  const title = sanitizeMetaValue(SITE_NAME, SITE_NAME, MAX_META_TITLE_LENGTH);
  const description = sanitizeMetaValue(
    DEFAULT_DESCRIPTION,
    DEFAULT_DESCRIPTION,
    MAX_META_DESCRIPTION_LENGTH,
  );
  const openGraphLocale = getOpenGraphLocale(options?.locale);

  return {
    ...baseMetadata,
    title,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      locale: openGraphLocale,
      url: buildCanonicalUrl(options),
      title,
      description,
      type: "website",
      images: [
        { url: FALLBACK_IMAGE, width: 1200, height: 630, alt: SITE_NAME },
      ],
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
      images: [FALLBACK_IMAGE],
    },
    ...getPageMetadataOptions(options),
  };
}

export function generateFallbackMetadata(options?: MetadataOptions): Metadata {
  const title = sanitizeMetaValue(SITE_NAME, SITE_NAME, MAX_META_TITLE_LENGTH);
  const description = sanitizeMetaValue(
    DEFAULT_DESCRIPTION,
    DEFAULT_DESCRIPTION,
    MAX_META_DESCRIPTION_LENGTH,
  );
  const image = toMetadataImageUrl(FALLBACK_IMAGE);
  const openGraphLocale = getOpenGraphLocale(options?.locale);
  return {
    ...baseMetadata,
    title,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      locale: openGraphLocale,
      url: buildCanonicalUrl(options),
      title,
      description,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
      images: [image],
    },
    ...getPageMetadataOptions(options),
  };
}
