import React from "react";
import Image from "next/image";
import Link from "next/link";
import { generateFallbackMetadata } from "@/lib/metadata";
import { FileText } from "lucide-react";
import { getArticles } from "@/lib/api";
import { Article } from "@/lib/types";
import { getArticleCategory } from "@/lib/utils";
import LocationFilter from "@/components/category/categoryfilter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    ...generateFallbackMetadata({ path: "/circular", locale }),
    title: "বিজ্ঞপ্তি | Daily Destiny",
    description: "Daily Destiny - বিজ্ঞপ্তি",
    robots: { index: false, follow: false },
  };
}

export default async function CircularPage() {
  // Fetch recent articles for the sidebar
  let recentArticles: Article[] = [];
  try {
    const res = await getArticles({ limit: 6, status: "Published" });
    recentArticles = res?.data || [];
  } catch (err) {
    console.error("Failed to fetch recent articles for circular page:", err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* ── HEADER ── */}
      <div className="border-b border-gray-100 pb-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 text-white shadow-sm shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="lg:text-2xl text-xl font-bold text-[#1a66ca] leading-tight">
              বিজ্ঞপ্তি
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              দৈনিক ডেসটিনি প্রকাশিত বিজ্ঞপ্তি
            </p>
          </div>
        </div>
      </div>

      {/* ── TWO-COLUMN LAYOUT ── */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT: Circular Image */}
        <div className="flex-1 w-full lg:pr-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative w-full" style={{ aspectRatio: "1080/1350" }}>
              <Image
                src="/advertise/circular.jpeg"
                alt="বিজ্ঞপ্তি"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
            </div>
          </div>
        </div>

        {/* RIGHT: Sidebar with Recent News + Location Filter */}
        <div className="w-full lg:w-80 shrink-0 sticky top-4 flex flex-col gap-4">
          {/* Recent News */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-red-500 rounded-full" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    সর্বশেষ সংবাদ
                  </h3>
                </div>
                <Link
                  href="/recent"
                  className="text-xs font-semibold text-[#1a66ca] hover:text-red-600 transition-colors"
                >
                  আরও →
                </Link>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {recentArticles.length > 0 ? (
                recentArticles.slice(0, 5).map((article) => (
                  <Link
                    key={article.id}
                    href={`/news/${getArticleCategory(article)?.slug || "others"}/${article.code}`}
                    className="group flex items-start gap-3 px-4 py-3 hover:bg-gray-50/80 transition-colors duration-150"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-16 h-14 shrink-0 rounded-md overflow-hidden bg-gray-100 shadow-xs">
                      {article.coverImage ? (
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <FileText className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4
                        className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-[#1a66ca] transition-colors"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {article.title}
                      </h4>
                      {getArticleCategory(article)?.titleBn && (
                        <span className="inline-block mt-1 text-[10px] font-medium text-brand bg-blue-50 px-1.5 py-0.5 rounded-full">
                          {getArticleCategory(article)?.titleBn}
                        </span>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-gray-400">
                  কোনো সংবাদ পাওয়া যায়নি
                </div>
              )}
            </div>
          </div>

          {/* Location Filter */}
          <LocationFilter />
        </div>
      </div>
    </div>
  );
}
