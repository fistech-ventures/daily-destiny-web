import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Article, Category } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely gets the effective category for an article.
 * Falls back from `article.category` to `article.categories?.[0]`
 * since the API may return either shape.
 */
export function getArticleCategory(article: Article): Category | null {
  return article.category ?? article.categories?.[0] ?? null;
}

/**
 * Safely gets the effective category slug for an article.
 * Convenience wrapper around getArticleCategory for link building.
 */
export function getArticleCategorySlug(article: Article): string | undefined {
  return getArticleCategory(article)?.slug ?? undefined;
}

