// src/lib/ads-types.ts
// Type definitions for the API-driven ad system

// ── Page Types (matches backend API) ──────────────────────
export const PAGE_TYPES = [
  "homePage",
  "recentPage",
  "videoPage",
  "epaperPage",
  "galleryDetailsPage",
  "categoryPage",
] as const;

export type PageType = (typeof PAGE_TYPES)[number];

// ── Ad Types (how the ad is rendered) ─────────────────────
export const AD_TYPES = ["IMAGE", "VIDEO", "EMBEDED", "ANIMATION"] as const;

export type AdType = (typeof AD_TYPES)[number];

// ── Positions by Page Type ────────────────────────────────

export const HOME_PAGE_POSITIONS = [
  "Home-TopBanner",
  "Lead-Right",
  "Area-Under",
  "Mid-Banner",
  "Footer-Up-Banner",
] as const;
export type HomePagePosition = (typeof HOME_PAGE_POSITIONS)[number];

export const RECENT_PAGE_POSITIONS = [
  "Right-Sidebar",
  "Footer-Up-Banner",
] as const;
export type RecentPagePosition = (typeof RECENT_PAGE_POSITIONS)[number];

export const VIDEO_PAGE_POSITIONS = ["Footer-Up-Banner"] as const;
export type VideoPagePosition = (typeof VIDEO_PAGE_POSITIONS)[number];

export const EPAPER_PAGE_POSITIONS = [
  "Right-sidebar-bottom",
  "Footer-Up-Banner",
] as const;
export type EpaperPagePosition = (typeof EPAPER_PAGE_POSITIONS)[number];

export const GALLERY_DETAILS_PAGE_POSITIONS = [
  "Footer-Up-Banner",
] as const;
export type GalleryDetailsPagePosition =
  (typeof GALLERY_DETAILS_PAGE_POSITIONS)[number];

export const CATEGORY_PAGE_POSITIONS = [
  "Right-Sidebar-top",
  "Footer-Up-Banner",
] as const;
export type CategoryPagePosition =
  (typeof CATEGORY_PAGE_POSITIONS)[number];

// ── Union of all valid positions ──────────────────────────
export type AdPosition =
  | HomePagePosition
  | RecentPagePosition
  | VideoPagePosition
  | EpaperPagePosition
  | GalleryDetailsPagePosition
  | CategoryPagePosition;

// ── Position lookup: given a pageType, what positions are valid? ──
export const POSITIONS_BY_PAGE: Record<PageType, readonly string[]> = {
  homePage: HOME_PAGE_POSITIONS,
  recentPage: RECENT_PAGE_POSITIONS,
  videoPage: VIDEO_PAGE_POSITIONS,
  epaperPage: EPAPER_PAGE_POSITIONS,
  galleryDetailsPage: GALLERY_DETAILS_PAGE_POSITIONS,
  categoryPage: CATEGORY_PAGE_POSITIONS,
};

// ── Ad status values (from backend API) ───────────────────
export type AdStatus = "Drafted" | "Published" | "Archived";

// ── Single ad entity (from API response data[]) ───────────
// Matches the real API response shape exactly.
export interface Ad {
  id: string;
  isActive: boolean;
  title?: string;
  type: AdType;
  pageType: PageType;
  position: string;
  /** Image URL for IMAGE / ANIMATION types */
  imageUrl?: string;
  /** Video URL for VIDEO type */
  videoUrl?: string | null;
  /** Embed code (iframe/script) for EMBEDED type */
  scriptEmbedCode?: string | null;
  /** Click-through destination */
  redirectUrl?: string | null;
  status: AdStatus;
  /** Ad campaign start date (ISO string) */
  startDate?: string | null;
  /** Ad campaign end date (ISO string) */
  endDate?: string | null;
  /** Category targeting (null = all categories) */
  categories?: unknown | null;
}

// ── API response shape ────────────────────────────────────
export interface AdsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    skip: number;
  };
  data: Ad[];
}

// ── Query params for the ads API ──────────────────────────
export interface AdsQueryParams {
  page?: number;
  limit?: number;
  pageType?: PageType;
  position?: string;
  /** Optional: filter by category ID (for category-specific ads) */
  categoryId?: string;
}
