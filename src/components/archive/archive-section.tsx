"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  CalendarDays,
  ChevronRight,
  FileText,
  Loader2,
  Clock,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatRelativeTime } from "@/utils/date-formatter";
import ArchiveCalendar from "@/components/archive/archive-calendar";
import { getArticles } from "@/lib/api";
import { Article } from "@/lib/types";

export default function ArchiveSection() {
  const { locale } = useParams();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch latest articles on mount (when no date range selected)
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

  // Fetch articles when date range is selected
  useEffect(() => {
    if (!startDate || !endDate) return;

    let cancelled = false;
    setLoading(true);

    const startDateParam = formatDateForAPI(startDate);
    const endDateParam = formatDateForAPI(endDate);

    getArticles({
      startDate: startDateParam,
      endDate: endDateParam,
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

  const displayArticles = startDate && endDate ? articles : latestArticles;
  const isDisplayLoading = startDate && endDate ? loading : false;
  const hasDateRange = startDate && endDate;

  const clearDateRange = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="w-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Section Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">আর্কাইভ</h2>
          </div>
          <Link
            href={`/${locale}/archive`}
            className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            সব দেখুন
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Content: Latest Articles (3/4) + Calendar (1/4) */}
        <div className="flex flex-col lg:flex-row gap-6 p-6">
          {/* LEFT: Latest Articles (75%) */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Sub-header */}
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                    {hasDateRange ? (
                      <>
                        <CalendarDays className="h-4 w-4 text-red-600" />
                        <span>
                          {formatDateDisplay(startDate)} থেকে{" "}
                          {formatDateDisplay(endDate)}
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-red-600" />
                        <span>সর্বশেষ সংবাদ</span>
                      </>
                    )}
                  </h3>
                  {hasDateRange && (
                    <button
                      onClick={clearDateRange}
                      className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Clear date range"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {!hasDateRange && (
                  <Link
                    href={`/${locale}/archive`}
                    className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                  >
                    আরও
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                )}
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
                      href={`/news/${article.category?.slug || ""}/${article.code}`}
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
                        <h4 className="text-base font-semibold text-gray-800 leading-snug group-hover:text-[#1a66ca] transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          {article.category?.titleBn && (
                            <span className="text-sm font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                              {article.category.titleBn}
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
                  {hasDateRange ? (
                    <p className="text-gray-500 text-sm">
                      এই তারিখ পরিসরে কোনো সংবাদ পাওয়া যায়নি
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

          {/* RIGHT: Calendar (25%) */}
          <div className="w-full lg:w-1/4">
            <ArchiveCalendar
              startDate={startDate}
              endDate={endDate}
              onDateRangeSelect={handleDateRangeSelect}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
