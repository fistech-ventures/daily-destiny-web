// src/lib/resolve-page-type.ts
// Maps URL pathnames to the PageType enum used by the ads API.
//
// This is used by the AppProvider (via usePathname()) to determine
// which pageType to pass when fetching global ad positions like
// Footer-Up-Banner.

import type { PageType } from "@/lib/ads-types";

/**
 * Route mapping: pathname patterns → PageType.
 *
 * Patterns are checked in order. The first match wins.
 * The key is a regex-like string (see matchRoute for details).
 */
const ROUTE_MAP: Array<{ pattern: string; pageType: PageType }> = [
  // Homepage
  { pattern: "/", pageType: "homePage" },
  { pattern: "/bn", pageType: "homePage" },
  { pattern: "/en", pageType: "homePage" },

  // Recent news
  { pattern: "/recent", pageType: "recentPage" },

  // Video pages
  { pattern: "/video", pageType: "videoPage" },
  { pattern: "/video/live", pageType: "videoPage" },

  // E-Paper pages
  { pattern: "/e-paper", pageType: "epaperPage" },
  { pattern: "/e-papers", pageType: "epaperPage" },

  // Gallery / Photo details
  { pattern: "/gallery", pageType: "galleryDetailsPage" },

  // Archive (treated as category-like listing until backend adds archivePage)
  { pattern: "/archive", pageType: "categoryPage" },

  // News details pages are treated as category context
  { pattern: "/news", pageType: "categoryPage" },
];

/**
 * Simple pathname matcher.
 * The `pattern` is the prefix of the pathname. A pattern like "/video"
 * matches "/video", "/video/live", "/video/abc-123", etc.
 * Exact match "/" is a special case (only matches root).
 */
function matchRoute(pathname: string, pattern: string): boolean {
  if (pattern === "/") {
    return pathname === "/" || pathname === "/bn" || pathname === "/en";
  }
  // Normalize: strip locale prefix (/bn/..., /en/...) for matching
  const normalized = pathname.replace(/^\/(bn|en)(\/|$)/, "/");
  return normalized === pattern || normalized.startsWith(pattern + "/");
}

/**
 * Resolve a URL pathname to a PageType.
 *
 * @param pathname - From usePathname() or similar (e.g. "/recent", "/bn/video/live")
 * @returns The matching PageType, or undefined if no match found
 *
 * @example
 *   resolvePageType("/")              → "homePage"
 *   resolvePageType("/bn/recent")     → "recentPage"
 *   resolvePageType("/e-papers/visual") → "epaperPage"
 *   resolvePageType("/about")         → undefined (no ads on static pages)
 */
export function resolvePageType(pathname: string): PageType | undefined {
  for (const { pattern, pageType } of ROUTE_MAP) {
    if (matchRoute(pathname, pattern)) {
      return pageType;
    }
  }
  return undefined;
}
