import React from "react";
import MainArticle from "./main-article";
import { Article } from "@/lib/types";
import ArticleSidebar from "./article-sidebar";

export default async function ArticleTop({
  threeArticles,
}: {
  threeArticles: Article[];
}) {
  return (
    <div className="grid lg:grid-cols-12 lg:gap-10 gap-5 w-full">
      <div className="lg:col-span-9 col-span-12">
        <MainArticle mainArticles={threeArticles} />
      </div>
      <div className="lg:col-span-3 col-span-12">
        <ArticleSidebar />
      </div>
    </div>
  );
}
