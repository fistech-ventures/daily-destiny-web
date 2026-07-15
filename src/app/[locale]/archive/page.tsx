"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  CalendarDays,
  FileText,
  Clock,
  X,
  Loader2,
} from "lucide-react";
import ArchiveCalendar from "@/components/archive/archive-calendar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatRelativeTime } from "@/utils/date-formatter";
import { getArticles } from "@/lib/api";
import { Article } from "@/lib/types";
import { getArticleCategory } from "@/lib/utils";
import ArticleTitle from "@/components/shared/article-title";

export default function ArchivePage() {
  const { locale } = useParams();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch latest articles on mount (when no date selected)
  useEffect(() => {
    getArticles({
      limit: 6,
      status: "Published",
      sortBy: "date",
      sortOrder: "DESC",
    })
      .then(res => {
        setLatestArticles(res?.data || []);
      })
      .catch(err => {
        console.error("Error fetching latest articles:", err);
      });
  }, []);

  const handleDateRangeSelect = useCallback(
    (start: Date | null, end: Date | null) => {
      setStartDate(start);
      setEndDate(end);
    },
    [],
  );

  // Format date to YYYY-MM-DD without timezone conversion
  const formatDateForAPI = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch articles when date is selected (mirroring archive-section pattern)
  useEffect(() => {
    if (!startDate || !endDate) return;

    let cancelled = false;
    setLoading(true);

    const dateParam = formatDateForAPI(startDate);

    getArticles({
      date: dateParam,
      limit: 9,
    })
      .then(res => {
        if (!cancelled) {
          setArticles(res?.data || []);
        }
      })
      .catch(err => {
        if (!cancelled) {
          console.error("Error fetching archive articles:", err);
          setArticles([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [startDate, endDate]);

  const hasSelectedDate = startDate && endDate;
  const displayArticles = hasSelectedDate ? articles : latestArticles;
  const isDisplayLoading = hasSelectedDate ? loading : false;

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const clearDate = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 text-white shadow-sm">
          <CalendarDays className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            আর্কাইভ
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            ক্যালেন্ডার থেকে একটি তারিখ নির্বাচন করে পুরনো সংবাদ দেখুন
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Calendar Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          <ArchiveCalendar
            startDate={startDate}
            endDate={endDate}
            onDateRangeSelect={handleDateRangeSelect}
          />

          {hasSelectedDate && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-800">
                    নির্বাচিত তারিখ
                  </p>
                  <p className="text-sm text-amber-700 mt-0.5">
                    {formatDateDisplay(startDate)}
                  </p>
                </div>
                <button
                  onClick={clearDate}
                  className="p-1 text-amber-400 hover:text-amber-600 transition-colors"
                  aria-label="Clear date"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Articles */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Sub-header */}
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  {hasSelectedDate ? (
                    <>
                      <CalendarDays className="h-4 w-4 text-red-600" />
                      <span>{formatDateDisplay(startDate)}</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 text-red-600" />
                      <span>সর্বশেষ সংবাদ</span>
                    </>
                  )}
                </h3>
                {hasSelectedDate && (
                  <button
                    onClick={clearDate}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear date"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {!hasSelectedDate && (
                  <Link
                    href={`/${locale}/archive`}
                    className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                  >
                    আরও
                    <span className="text-lg leading-none">→</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Article grid: 3 columns */}
            {isDisplayLoading ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
              </div>
            ) : displayArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                {displayArticles.map(article => (
                  <a
                    key={article.id}
                    href={`/news/${getArticleCategory(article)?.slug || ""}/${article.code}`}
                    className="group flex flex-col rounded-lg overflow-hidden border border-gray-100 hover:border-[#1a66ca] bg-white shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                      {article.coverImage ? (
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <FileText className="h-10 w-10" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-3 flex flex-col">
                      <h4
                        className="text-base font-semibold text-gray-800 leading-snug group-hover:text-[#1a66ca] transition-colors"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          width: "100%",
                        }}
                      >
                        <ArticleTitle article={article} />
                      </h4>
                      <div className="flex items-center gap-2 mt-2">
                        {getArticleCategory(article)?.titleBn && (
                          <span className="text-sm font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                            {getArticleCategory(article)?.titleBn}
                          </span>
                        )}
                        {article.date && (
                          <span className="text-[10px] text-gray-400">
                            {formatRelativeTime(article.date)}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-6">
                <FileText className="h-10 w-10 text-gray-300 mb-3" />
                {hasSelectedDate ? (
                  <p className="text-gray-500 text-sm">
                    এই তারিখে কোনো সংবাদ পাওয়া যায়নি
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm">
                    কোনো সংবাদ পাওয়া যায়নি
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
