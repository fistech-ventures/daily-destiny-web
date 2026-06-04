import { Article } from "@/lib/types";
import Link from "next/link";
import React from "react";

export default function GridSection({
  articles,
}: {
  articles: Article[];
}) {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/news/${article.category?.slug || "others"}/${article.code}`}
            className="block group"
          >
            <div className="bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img
                src={article.coverImage}
                alt={article.title}
                height={400}
                width={400}
                className="w-full aspect-3/2 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-3">
                <span className="text-xs text-primary font-semibold">
                  {article.category?.titleBn || article.category?.title}
                </span>
                <h3 className="text-base font-semibold mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {article.excerpt}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
