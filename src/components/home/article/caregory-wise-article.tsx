import { Category } from "@/lib/types";
import { getTranslations } from "next-intl/server";
import React from "react";
import CategorySection from "./articles-by-category";

export default async function CategoryWiseArticles({
  fourCategories,
}: {
  fourCategories: Category[];
}) {
  const tArticle = await getTranslations("article");

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {fourCategories.map((category: Category) => (
          <CategorySection
            key={category.id}
            category={category}
            moreText={tArticle("more")}
          />
        ))}
      </div>
    </section>
  );
}
