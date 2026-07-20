// src/lib/ad-slots.ts
// Centralized ad slot configuration — maps slot keys to image + metadata

export interface AdSlotConfig {
  /** Path to the ad image (relative to `/public/`, e.g. `/advertise/foo.png`) */
  imageUrl: string;
  /** Optional click-through URL when the ad is tapped */
  linkUrl?: string;
  /** Alt / aria-label text (use Bengali where appropriate) */
  altText?: string;
  /** CSS aspect-ratio override, e.g. "6.5/1", "16/9", "2/1" */
  aspectRatio?: string;
  /** Default className to merge with any caller-supplied class */
  className?: string;
  /**
   * When true, the ad banner is hidden (renders nothing).
   * Use this as a toggle — e.g. from admin panel or API.
   */
  hidden?: boolean;
}

export const AD_SLOTS = {
  /** ── Homepage ─────────────────────────────────────── */
  "homepage-hero-banner": {
    imageUrl: "/advertise/sspl-add1525-245.jpeg",
    altText: "হোমপেজ বিজ্ঞাপন",
    aspectRatio: "6.5/1",
    className: "rounded-lg",
  },
  "homepage-mid-banner": {
    imageUrl: "/advertise/sspl-add1525-245.jpeg",
    altText: "মাঝপাতার বিজ্ঞাপন",
    aspectRatio: "6.5/1",
    className: "rounded-lg",
  },
  "homepage-sidebar": {
    imageUrl: "/advertise/sspl-add-16-9.png",
    altText: "এলাকার সংবাদ বিজ্ঞাপন",
    aspectRatio: "16/9",
    className: "rounded-lg",
  },

  /** ── Category / Recent Pages ───────────────────────── */
  "category-page-sidebar": {
    imageUrl: "/advertise/sspl-add-16-9.png",
    altText: "বিভাগ পাতা বিজ্ঞাপন",
    className: "rounded-lg",
  },
  "recent-page-sidebar": {
    imageUrl: "/advertise/sspl-add-16-9.png",
    altText: "সাম্প্রতিক পাতা বিজ্ঞাপন",
    className: "rounded-lg",
  },

  /** ── Archive ──────────────────────────────────────── */
  "archive-sidebar": {
    imageUrl: "/advertise/sspl-add-16-9.png",
    altText: "আর্কাইভ বিজ্ঞাপন",
    className: "rounded-xl",
  },

  /** ── Article Section Sidebar ──────────────────────── */
  "article-section-sidebar": {
    imageUrl: "/advertise/sspl-add-16-9.png",
    altText: "বিজ্ঞাপন",
    className: "rounded-lg",
  },

  /** ── E-Paper Viewer ───────────────────────────────── */
  "e-paper-sidebar": {
    imageUrl: "/advertise/sspl-add-16-9.png",
    altText: "ই-পেপার বিজ্ঞাপন",
    className: "rounded-lg",
  },

  /** ── Global Footer ────────────────────────────────── */
  "footer-banner": {
    imageUrl: "/advertise/sspl-add1525-245.jpeg",
    altText: "ফুটার বিজ্ঞাপন",
    className: "rounded-lg",
  },
} as const satisfies Record<string, AdSlotConfig>;

/** Union of all valid slot keys — used for type safety */
export type AdSlotKey = keyof typeof AD_SLOTS;

/**
 * Lookup a slot config by key.
 * Falls back to a sensible default if the key doesn't exist.
 */
export function getSlotConfig(
  slotKey: AdSlotKey,
): AdSlotConfig {
  return AD_SLOTS[slotKey];
}
