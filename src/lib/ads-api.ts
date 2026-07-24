// src/lib/ads-api.ts
// API functions for fetching advertisements from the backend

import { api } from "@/lib/api";
import type { AdsQueryParams, AdsApiResponse } from "@/lib/ads-types";

/**
 * Fetch ads from the backend, optionally filtered by pageType and position.
 *
 * Examples:
 *   getAds({ pageType: "homePage", position: "Home-TopBanner" })
 *   getAds({ pageType: "categoryPage", position: "Right-Sidebar-top" })
 *   getAds({ position: "Footer-Up-Banner" }) // global position
 */
export async function getAds(
  params: AdsQueryParams = {},
): Promise<AdsApiResponse> {
  try {
    const response = await api.get("/web/ads", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching ads:", error);
    throw error;
  }
}
