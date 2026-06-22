"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  CalendarDays,
  ChevronRight,
  FileText,
  Loader2,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatRelativeTime } from "@/utils/date-formatter";
import ArchiveCalendar from "@/components/archive/archive-calendar";
import { getArticles } from "@/lib/api";
import { Article } from "@/lib/types";

export default function ArchiveSection() {
  const { locale } = useParams();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch latest articles on mount (when no date selected)
  useEffect(() => {
    getArticles({ limit: 9, status: "Published", sortBy: "date", sortOrder: "DESC" })
      .then(res => {
        setLatestArticles(res?.data || []);
      })
      .catch(err => {
        console.error("Error fetching latest articles:", err);
      });
  }, []);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  // Fetch articles when a date is selected
  useEffect(() => {
    if (!selectedDate) return;

    let cancelled = false;
    setLoading(true);

    const dateParam = selectedDate.toString();

    getArticles({ date: dateParam, limit: 9 })
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
  }, [selectedDate]);

  const displayArticles = selectedDate ? articles : latestArticles;
  const isDisplayLoading = selectedDate ? loading : false;

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
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  {selectedDate ? (
                    <>
                      <CalendarDays className="h-4 w-4 text-red-600" />
                      <span>
                        {selectedDate.toLocaleDateString("bn-BD", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 text-red-600" />
                      <span>সর্বশেষ সংবাদ</span>
                    </>
                  )}
                </h3>
                {!selectedDate && (
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
                      className="group flex flex-col rounded-lg overflow-hidden border border-gray-100 hover:border-red-200 bg-white shadow-sm hover:shadow-md transition-all duration-200"
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
                        <h4 className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          {article.category?.titleBn && (
                            <span className="text-[10px] font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
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
                  {selectedDate ? (
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

          {/* RIGHT: Calendar (25%) */}
          <div className="w-full lg:w-1/4">
            <ArchiveCalendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
