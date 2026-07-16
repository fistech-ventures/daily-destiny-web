/**
 * Homepage section configuration.
 *
 * This is the SINGLE source of truth for which categories appear on the
 * homepage and which API slugs they map to.  If the backend changes a slug,
 * just add the new alias here — no component code needs to change.
 */

export type SectionLayout =
  | "national-grid"   // 2-top + 3-bottom grid  (National)
  | "hero-sidebar"    // 1 featured + 6 side cards (Politics / Religion / Law / Binodon)
  | "slider"          // Horizontal slider (Economy / Khela / Tech)
  | "three-column"    // 1 featured + 3 middle + 3 right (International, Education, etc.)

export interface HomeSectionConfig {
  id: string;
  /** Every possible API slug for this category — add new ones when the backend changes */
  slugAliases: string[];
  layout: SectionLayout;
  /** Number of articles to request */
  articleLimit: number;
}

/**
 * Ordered list of sections — they render in this exact sequence on the
 * homepage (interspersed with ads, dividers, and static components in page.tsx).
 */
export const HOME_SECTIONS: HomeSectionConfig[] = [
  // ── Group 1: Top section with LocationFilter beside it ──
  { id: "national",   slugAliases: ["national", "জাতীয়"],                                   layout: "national-grid",  articleLimit: 5 },

  // ── Group 1 continued ──
  { id: "politics",   slugAliases: ["politics", "rajneeti", "rajniti", "রাজনীতি"],           layout: "hero-sidebar",   articleLimit: 7 },

  // ── Group 2 ──
  { id: "international", slugAliases: ["international", "antarjatik", "আন্তর্জাতিক"],           layout: "three-column",  articleLimit: 7 },
  { id: "economy",    slugAliases: ["economy", "orthoniti", "অর্থনীতি"],                      layout: "slider",         articleLimit: 8 },

  // ── Group 3 ──
  { id: "binodon",    slugAliases: ["binodon", "entertainment", "বিনোদন"],                    layout: "hero-sidebar",   articleLimit: 7 },
  { id: "kheladula",  slugAliases: ["kheladula", "sports", "khela", "খেলাধুলা"],               layout: "slider",         articleLimit: 8 },
  { id: "education",  slugAliases: ["education", "shikkha", "শিক্ষা"],                         layout: "three-column",  articleLimit: 7 },
  { id: "tech",       slugAliases: ["information-technology", "technology", "tech", "তথ্যপ্রযুক্তি"], layout: "slider",    articleLimit: 8 },

  // ── Group 4 (no divider before) ──
  { id: "religion",   slugAliases: ["religion", "dhormo", "islam", "ধর্ম"],                   layout: "hero-sidebar",   articleLimit: 7 },
  { id: "law",        slugAliases: ["law-order", "law", "আইন-আদালত"],                         layout: "hero-sidebar",   articleLimit: 7 },

  // ── Group 5 ──
  { id: "opinion",    slugAliases: ["opinion", "মতামত"],                                      layout: "three-column",  articleLimit: 7 },
  { id: "health",     slugAliases: ["health", "স্বাস্থ্য"],                                   layout: "three-column",  articleLimit: 7 },
  { id: "lifestyle",  slugAliases: ["lifestyle", "জীবনযাপন"],                                  layout: "three-column",  articleLimit: 7 },
  { id: "campus",     slugAliases: ["campus", "ক্যাম্পাস"],                                    layout: "three-column",  articleLimit: 7 },
];

/** Helper to look up a config by id */
export function getSectionConfig(id: string): HomeSectionConfig | undefined {
  return HOME_SECTIONS.find(s => s.id === id);
}

/** Every alias known across all sections (useful for OtherCategories exclusion) */
export const ALL_DEDICATED_SLUGS: string[] = HOME_SECTIONS.flatMap(s => s.slugAliases);
