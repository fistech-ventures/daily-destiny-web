import React from "react";
import { HomeSectionConfig } from "@/config/home-sections";
import { Category, Article } from "@/lib/types";

import NationalGrid from "@/components/category/national-grid";
import PoliticsSection from "@/components/home/article/polititcs-section";
import KhelaSlider from "@/components/home/article/khela-slider";
import ThreeColumnSection from "@/components/category/three-column-section";

interface SectionRendererProps {
  section: HomeSectionConfig;
  category: Category;
  articles: Article[];
}

/**
 * Renders the appropriate layout component for a given section config.
 *
 * Usage in page.tsx:
 *   <SectionRenderer section={config} category={category} articles={articles} />
 */
export default function SectionRenderer({
  section,
  category,
  articles,
}: SectionRendererProps) {
  if (!articles.length) return null;

  const title = category.titleBn || category.title || "";
  const slug = category.slug;

  switch (section.layout) {
    case "national-grid":
      return <NationalGrid articles={articles} category={category} />;

    case "hero-sidebar":
      // PoliticsSection uses the first article's category to derive header title
      return <PoliticsSection articles={articles} />;

    case "slider":
      // Use KhelaSlider for all slider-type sections
      return (
        <KhelaSlider
          articles={articles}
          title={title}
          categorySlug={slug}
        />
      );

    case "three-column":
      return (
        <ThreeColumnSection
          articles={articles}
          category={category}
        />
      );

    default:
      return null;
  }
}
