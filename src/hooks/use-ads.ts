// src/hooks/use-ads.ts
// React Query hook for fetching advertisements

import { useQuery } from "@tanstack/react-query";
import { getAds } from "@/lib/ads-api";
import type { PageType, AdsQueryParams, Ad } from "@/lib/ads-types";

interface UseAdsOptions {
  pageType?: PageType;
  position?: string;
  categoryId?: string;
  limit?: number;
  /** When true, skips the query entirely (e.g. for unknown routes) */
  enabled?: boolean;
}

/**
 * Fetch ads for a specific page type and position.
 *
 * @example
 *   const { data, isLoading } = useAds({ pageType: "homePage", position: "Home-TopBanner" });
 */
export function useAds(options: UseAdsOptions) {
  const {
    pageType,
    position,
    categoryId,
    limit = 5,
    enabled = true,
  } = options;

  const queryParams: AdsQueryParams = {
    page: 1,
    limit,
    pageType,
    position,
    categoryId,
  };

  return useQuery({
    queryKey: ["ads", pageType, position, categoryId],
    queryFn: () => getAds(queryParams),
    staleTime: 5 * 60 * 1000, // 5-minute cache
    refetchOnWindowFocus: false,
    retry: 1,
    enabled,
    select: (data): Ad[] => {
      const now = new Date();
      return data.data.filter((ad) => {
        // Must be marked active
        if (!ad.isActive) return false;
        // Must be published
        // Allow both Published (live) and Drafted (testing) ads
        if (ad.status !== "Published" && ad.status !== "Drafted") return false;
        // Must be within active date range (if specified)
        if (ad.startDate && new Date(ad.startDate) > now) return false;
        if (ad.endDate && new Date(ad.endDate) < now) return false;
        return true;
      });
    },
  });
}

/**
 * Fetch ads for the Footer-Up-Banner global position.
 * The pageType is determined at the call site.
 */
export function useFooterAds(pageType?: PageType) {
  return useAds({ pageType, position: "Footer-Up-Banner" });
}
