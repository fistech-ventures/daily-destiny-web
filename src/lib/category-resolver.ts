import { getArticles } from "@/lib/api";
import { Category, Article } from "@/lib/types";
import { HOME_SECTIONS, HomeSectionConfig } from "@/config/home-sections";

export interface ResolvedSection {
  config: HomeSectionConfig;
  category: Category;
}

/**
 * Matches API categories to section configs by trying every alias.
 *
 * @returns A record keyed by section id — only sections whose category
 *          was found in the API response are included.
 */
export function resolveSections(
  apiCategories: Category[],
): Record<string, ResolvedSection> {
  // Build a fast lookup: lowercase alias → Category
  const aliasMap = new Map<string, Category>();
  for (const cat of apiCategories) {
    aliasMap.set(cat.slug.toLowerCase(), cat);
    aliasMap.set(cat.slugBn.toLowerCase(), cat);
    aliasMap.set(cat.slug, cat);
    aliasMap.set(cat.slugBn, cat);
  }

  const resolved: Record<string, ResolvedSection> = {};

  for (const config of HOME_SECTIONS) {
    for (const alias of config.slugAliases) {
      const match = aliasMap.get(alias) ?? aliasMap.get(alias.toLowerCase());
      if (match) {
        resolved[config.id] = { config, category: match };
        break;
      }
    }
  }

  return resolved;
}

export type SectionArticleMap = Map<string, Article[]>;

/**
 * Fetch articles for every resolved section in parallel.
 *
 * Skips sections whose layout doesn't need fetching
 * (only present to show the pattern). Returns a Map<sectionId, Article[]>.
 */
export async function fetchSectionArticles(
  resolved: Record<string, ResolvedSection>,
): Promise<SectionArticleMap> {
  const entries = Object.entries(resolved);
  const results = await Promise.all(
    entries.map(async ([id, { config, category }]) => {
      try {
        const res = await getArticles({
          categoryId: category.id,
          limit: config.articleLimit,
          status: "Published",
          includeMultiCategory: true,
        });
        return [id, (res?.data || []) as Article[]] as const;
      } catch {
        console.error(`Failed to fetch articles for section "${id}"`);
        return [id, [] as Article[]] as const;
      }
    }),
  );
  return new Map(results);
}

