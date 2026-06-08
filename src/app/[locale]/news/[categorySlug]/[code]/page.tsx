import {
  getRelatedArticles,
  getArticleByCode,
  getArticles,
  getAllcategories,
  getGlobalConfigs,
} from "@/lib/api";
import { Article, Category, GlobalConfig } from "@/lib/types";
import React from "react";
import NewsDetails from "@/components/news/news-details";
import { getTranslations } from "next-intl/server";
import RelatedNewsCard from "@/components/news/related-news-card";
import HorizontalArticleCard from "@/components/category/horizontal-article-card";
import Link from "next/link";
import {
  generateArticleMetadata,
  generateFallbackMetadata,
} from "@/lib/metadata";
import { Metadata } from "next";
import { buildArticleLdJson } from "@/lib/article-ld-json";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string; code: string }>;
}): Promise<Metadata> {
  const { locale, categorySlug, code } = await params;
  const decodedCategorySlug = decodeURIComponent(categorySlug);
  const decodedCode = decodeURIComponent(code);
  const metadataPath = `/news/${decodedCategorySlug}/${decodedCode}`;

  try {
    const response = await getArticleByCode(decodedCode);
    const article = response?.data;
    if (!article) {
      return generateFallbackMetadata({
        locale,
        path: metadataPath,
        noIndex: true,
      });
    }
    return generateArticleMetadata(article, {
      locale,
      path: metadataPath,
    });
  } catch {
    return generateFallbackMetadata({
      locale,
      path: metadataPath,
      noIndex: true,
    });
  }
}

async function CustomNews404({ categorySlug }: { categorySlug: string }) {
  const tCommon = await getTranslations("common");

  let fallbackArticles: Article[] = [];
  try {
    const categoriesRes = await getAllcategories();
    const categories = categoriesRes?.data || [];
    const category = categories.find((c: Category) => c.slug === categorySlug);

    if (category) {
      const res = await getArticles({ categoryId: category.id, limit: 10 });
      fallbackArticles = res?.data || [];
    } else {
      const res = await getArticles({ limit: 10 });
      fallbackArticles = res?.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch fallback articles for 404:", error);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-background rounded-lg p-8 text-center shadow-sm space-y-4 border border-gray-100">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
          {tCommon("notFoundNews")}
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          {tCommon("notFoundNewsDescription")}
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-block bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-md font-bold transition-all shadow-sm"
          >
            {tCommon("backToHome") || "Back to Home"}
          </Link>
        </div>
      </div>

      {fallbackArticles.length > 0 && (
        <div className="bg-background rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-3 border-l-4 border-primary pl-3 mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {categorySlug && fallbackArticles.length > 0
                ? tCommon("moreNewsInCategory")
                : tCommon("relatedNews") || "Recent News"}
            </h2>
          </div>
          <div className="flex flex-col divide-y divide-gray-100">
            {fallbackArticles.map(article => (
              <div key={article.id} className="py-2">
                <HorizontalArticleCard article={article} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function NewsDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string; code: string }>;
}) {
  const { categorySlug, code } = await params;
  const decodedCode = decodeURIComponent(code);
  const decodedCategorySlug = decodeURIComponent(categorySlug);

  let article: Article | null = null;
  let relatedArticles: Article[] = [];
  let globalConfig: GlobalConfig | null = null;

  try {
    const [response, configRes] = await Promise.all([
      getArticleByCode(decodedCode),
      getGlobalConfigs(),
    ]);

    article = response?.data ?? null;
    globalConfig = configRes?.data ?? null;

    if (article) {
      // 💡 FIXED: Changed from article.id to article.code to match backend expectation
      const relatedRes = await getRelatedArticles(article.code);

      // Safely check if the backend responded with data.articles object or a clean array fallback
      let articlesArray: Article[] = [];
      if (relatedRes && Array.isArray(relatedRes.articles)) {
        articlesArray = relatedRes.articles;
      } else if (Array.isArray(relatedRes)) {
        articlesArray = relatedRes;
      }

      relatedArticles = articlesArray.slice(0, 5);
    }
  } catch (error) {
    console.error("Error fetching article details:", error);
  }

  const { data: recentArticles } = await getArticles({ limit: 5 });

  if (!article) {
    return <CustomNews404 categorySlug={decodedCategorySlug} />;
  }

  const tArticle = await getTranslations("article");
  const tRecent = await getTranslations("recent");

  const ldJson =
    article && globalConfig ? buildArticleLdJson(article, globalConfig) : null;

  return (
    <div className="grid grid-cols-3 lg:gap-6 gap-3 items-start">
      {ldJson && (
        <script
          id="article-ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
        />
      )}

      {/* News Details */}
      <div className="lg:col-span-2 col-span-3">
        <NewsDetails article={article} />
      </div>

      {/* Related & Recent Articles */}
      <div className="lg:col-span-1 col-span-3 flex flex-col gap-3">
        <div className="bg-background rounded-md p-3 no-print">
          <div className="flex items-center gap-3 border-l-4 border-primary pl-3 my-2">
            <h2 className="text-xl font-bold text-gray-900">
              {tRecent("title")}
            </h2>
          </div>
          <div>
            {recentArticles && recentArticles.length > 0 ? (
              recentArticles.map((article: Article) => (
                <RelatedNewsCard key={article.id} article={article} />
              ))
            ) : (
              <p className="p-4 text-center text-sm text-gray-500">
                {tArticle("noRelatedArticle")}
              </p>
            )}
          </div>
        </div>
        <div className="bg-background rounded-md p-3 no-print">
          <div className="flex items-center gap-3 border-l-4 border-primary pl-3 my-2">
            <h2 className="text-xl font-bold text-gray-900">
              {tArticle("relatedArticle")}
            </h2>
          </div>
          <div>
            {relatedArticles && relatedArticles.length > 0 ? (
              relatedArticles.map((article: Article) => (
                <RelatedNewsCard key={article.id} article={article} />
              ))
            ) : (
              <p className="p-4 text-center text-sm text-gray-500">
                {tArticle("noRelatedArticle")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
