"use client";

import React, { useState, useEffect } from "react";
import { Camera, ChevronRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Category } from "@/lib/types";
import { usePathname, useSearchParams } from "next/navigation";

const locales = ["en", "bn"];

export default function CategorySidebar({
  onClose,
  categories,
}: {
  onClose?: () => void;
  categories: Category[];
}) {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const strippedPathname = locales.reduce(
    (p, locale) =>
      p.startsWith(`/${locale}`) ? p.replace(`/${locale}`, "") || "/" : p,
    pathname,
  );

  const tImage = useTranslations("image");

  const currentLocale = useLocale();

  // Auto-expand category when on news detail page
  useEffect(() => {
    if (strippedPathname.startsWith('/news/')) {
      const pathParts = strippedPathname.split('/');
      if (pathParts.length >= 4) { // ['', 'news', 'categoryslug', 'news-code']
        const categorySlugFromUrl = pathParts[2]; // /news/categoryslug/news-code -> categoryslug
        
        // Find the category index and expand it
        const categoryIndex = categories.findIndex(
          (category) => category.slug === categorySlugFromUrl
        );
        
        if (categoryIndex !== -1) {
          setOpenIndexes((prev) => {
            const next = new Set(prev);
            next.add(categoryIndex);
            return next;
          });
        }
      }
    }
  }, [strippedPathname, categories]);

  const isActive = (href: string) => {
    const [hrefPath, hrefQuery] = href.split("?");
    if (hrefQuery) {
      const hrefParams = new URLSearchParams(hrefQuery);
      const subCategoryId = hrefParams.get("subCategoryId");
      
      // Handle news detail pages with subcategory
      if (strippedPathname.startsWith('/news/')) {
        const pathParts = strippedPathname.split('/');
        if (pathParts.length >= 4) { // ['', 'news', 'categoryslug', 'news-code']
          const categorySlugFromUrl = pathParts[2]; // /news/categoryslug/news-code -> categoryslug
          const categorySlugFromHref = hrefPath.replace('/', ''); // /categoryslug -> categoryslug
          const isCategoryMatch = categorySlugFromUrl === categorySlugFromHref;
          
          // If there's a subCategoryId in href, we need to check if the current news item belongs to this subcategory
          if (subCategoryId) {
            // For subcategory activation on news detail pages, we would need to access the article's subcategory data
            // For now, we'll check if the URL contains subcategory info or if we can determine it from other means
            return isCategoryMatch && searchParams.get("subCategoryId") === subCategoryId;
          }
          return isCategoryMatch;
        }
      }
      
      return (
        strippedPathname === hrefPath &&
        subCategoryId === searchParams.get("subCategoryId")
      );
    }
    
    // Handle news detail pages: /news/categoryslug/news-code
    // If current path is a news detail page, extract category slug and compare
    if (strippedPathname.startsWith('/news/')) {
      const pathParts = strippedPathname.split('/');
      if (pathParts.length >= 4) { // ['', 'news', 'categoryslug', 'news-code']
        const categorySlugFromUrl = pathParts[2]; // /news/categoryslug/news-code -> categoryslug
        const categorySlugFromHref = hrefPath.replace('/', ''); // /categoryslug -> categoryslug
        return categorySlugFromUrl === categorySlugFromHref;
      }
    }
    
    return strippedPathname === hrefPath;
  };

  const toggleCategory = (index: number) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="w-full bg-background rounded-lg sticky top-25 h-screen lg:h-[calc(70vh)] flex flex-col">
      <div className="sidebar-scroll lg:p-5 px-2 flex flex-col gap-2 flex-1 overflow-y-auto min-h-0">
        <Link href="/video" onClick={onClose}>
          <div className="flex items-center gap-2 px-4 py-3 rounded-md bg-linear-to-r from-primary to-primary/70 text-primary-foreground font-semibold">
            <span>
              <Camera />
            </span>
            <span>{tImage("label")}</span>
          </div>
        </Link>

        {categories?.map((category: Category, index: number) => (
          <div key={index}>
            <div className="flex flex-col">
              <div className="flex items-center text-base font-medium justify-between px-2 py-2 text-gray-800 cursor-pointer">
                <Link
                  href={`/${category.slug}`}
                  onClick={onClose}
                  className={`transition-colors ${
                    isActive(`/${category.slug}`)
                      ? "text-primary font-semibold"
                      : "hover:text-primary"
                  }`}
                >
                  {currentLocale === "en" ? category.title : category.titleBn}
                </Link>

                {(category.subCategories && category.subCategories.length > 0) && (
                  <ChevronRight
                    size={16}
                    className={`text-gray-400 transition-transform ${
                      openIndexes.has(index) ? "rotate-90" : ""
                    }`}
                    onClick={() => toggleCategory(index)}
                  />
                )}
              </div>

              {openIndexes.has(index) && category.subCategories.length > 0 && (
                <div className="pl-4 border-l-2 flex flex-col gap-1 text-sm text-gray-600">
                  {category.subCategories.map((sub) => (
                    <Link
                      href={`/${category.slug}?subCategoryId=${sub.id}`}
                      key={sub.id}
                      onClick={onClose}
                      className={`py-1 text-base transition-colors ${
                        isActive(
                          `/${category.slug}?subCategoryId=${sub.id}`,
                        )
                          ? "text-primary font-semibold"
                          : "hover:text-primary"
                      }`}
                    >
                      {sub.titleBn}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        <Link href="/gallery" onClick={onClose}>
          <div
            className={`flex items-center px-2.5 py-3 font-semibold transition-colors ${
              isActive("/gallery") ? "text-primary" : "hover:text-primary"
            }`}
          >
            <span>{tImage("lastLabel")}</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
