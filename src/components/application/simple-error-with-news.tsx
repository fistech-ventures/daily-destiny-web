"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { getArticles } from "@/lib/api";
import { Article } from "@/lib/types";
import HorizontalArticleCard from "@/components/category/horizontal-article-card";
import { Loader2 } from "lucide-react";

interface SimpleErrorWithNewsProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  showHomeButton?: boolean;
}

export default function SimpleErrorWithNews({
  title,
  description,
  actionText,
  onAction,
  showHomeButton = true,
}: SimpleErrorWithNewsProps) {
  const tCommon = useTranslations("common");
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await getArticles({ limit: 10 });
        setRecentArticles(res?.data || []);
      } catch (error) {
        console.error("Failed to fetch recent news for error page:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4 w-full">
      <div className="bg-background rounded-lg p-8 text-center shadow-sm space-y-4 border border-gray-100">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
          {title}
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          {description}
        </p>
        <div className="pt-4 flex items-center justify-center gap-4">
          {onAction && actionText && (
            <Button
              onClick={onAction}
              className="bg-primary hover:bg-primary/80 text-white px-8 h-12 rounded-md font-bold transition-all shadow-sm"
            >
              {actionText}
            </Button>
          )}

          {showHomeButton && (
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-primary hover:bg-primary/80 text-white px-8 h-12 rounded-md font-bold transition-all shadow-sm"
            >
              {tCommon("backToHome") || "Back to Home"}
            </Link>
          )}
        </div>
      </div>

      <div className="bg-background rounded-md p-4 shadow-sm min-h-[200px]">
        <div className="flex items-center gap-3 border-l-4 border-primary pl-3 mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {tCommon("moreNews") || "Recent News"}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : recentArticles.length > 0 ? (
          <div className="flex flex-col divide-y divide-gray-100">
            {recentArticles.map((article) => (
              <div key={article.id} className="py-2">
                <HorizontalArticleCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            {tCommon("noDataAvailable")}
          </p>
        )}
      </div>
    </div>
  );
}
