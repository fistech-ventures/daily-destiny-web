"use client";

import React, { useState, useCallback } from "react";
import { CalendarDays, FileText } from "lucide-react";
import ArchiveCalendar from "@/components/archive/archive-calendar";
import NewsListClient from "@/components/news/news-list-client";

export default function ArchivePage() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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

  const hasDateRange = startDate && endDate;

  const fetchParams = hasDateRange
    ? {
        startDate: formatDateForAPI(startDate),
        endDate: formatDateForAPI(endDate),
        limit: 10,
      }
    : undefined;

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
            তারিখ পরিসর নির্বাচন করে পুরনো সংবাদ দেখুন
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

          {hasDateRange && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    নির্বাচিত তারিখ পরিসর
                  </p>
                  <p className="text-sm text-amber-700 mt-0.5">
                    {formatDateDisplay(startDate)} থেকে{" "}
                    {formatDateDisplay(endDate)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Articles */}
        <div className="lg:col-span-8 xl:col-span-9">
          {hasDateRange ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">
                  {formatDateDisplay(startDate)} - {formatDateDisplay(endDate)}
                </h2>
              </div>
              <div className="p-4">
                <NewsListClient
                  key={`${startDate.toISOString()}-${endDate.toISOString()}`}
                  initialData={[]}
                  initialMeta={{ total: 0, page: 1, limit: 10 }}
                  fetchParams={fetchParams}
                  noDataMessage="এই তারিখ পরিসরে কোনো সংবাদ পাওয়া যায়নি"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarDays className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                একটি তারিখ পরিসর নির্বাচন করুন
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                বাম পাশের ক্যালেন্ডার থেকে একটি শুরু ও শেষ তারিখ নির্বাচন করে
                সেই সময়ের সব সংবাদ দেখুন
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
