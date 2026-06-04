import { Article } from "@/lib/types";
import React from "react";
import SecondArticleCard from "./second-article-card";
import { getTranslations } from "next-intl/server";

export default async function SecondArticleSection({
  secondArticles,
}: {
  secondArticles: Article[];
}) {
  const tCommon = await getTranslations("common");

  if (!secondArticles || secondArticles.length === 0) {
    return (
      <section className="rounded-md bg-background p-3 lg:my-6 flex justify-center items-center py-20">
        <p className="text-gray-500 font-medium">{tCommon("noDataAvailable")}</p>
      </section>
    );
  }

  return (
    <section className="rounded-md bg-background grid lg:grid-cols-3 md:grid-cols-2 gap-4 p-3 lg:my-6">
      {secondArticles.map((article: Article) => (
        <SecondArticleCard key={article.id} article={article} />
      ))}
    </section>
  );
}
