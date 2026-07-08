import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Article, Category } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely gets the effective category for an article.
 * Prefers `article.categories?.[0]` (array) as the primary source,
 * falling back to `article.category` (single object) for backward
 * compatibility with older API responses.
 */
export function getArticleCategory(article: Article): Category | null {
  return article.categories?.[0] ?? article.category ?? null;
}

/**
 * Safely gets the effective category slug for an article.
 * Convenience wrapper around getArticleCategory for link building.
 */
export function getArticleCategorySlug(article: Article): string | undefined {
  return getArticleCategory(article)?.slug ?? undefined;
}

/**
 * Safely gets the effective subcategory for an article.
 * Prefers `article.subCategories?.[0]` (array) as the primary source,
 * falling back to `article.subCategory` (single object) for backward
 * compatibility with older API responses.
 */
export function getArticleSubCategory(article: Article): Category | null {
  return article.subCategories?.[0] ?? article.subCategory ?? null;
}

/**
 * Safely gets the effective subcategory slug for an article.
 * Convenience wrapper around getArticleSubCategory for link building.
 */
export function getArticleSubCategorySlug(article: Article): string | undefined {
  return getArticleSubCategory(article)?.slug ?? undefined;
}

