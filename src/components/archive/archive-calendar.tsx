"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ArchiveCalendarProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateRangeSelect: (startDate: Date | null, endDate: Date | null) => void;
}

const DAY_NAMES = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"];
const BENGALI_MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isDateInRange(
  date: Date,
  startDate: Date | null,
  endDate: Date | null,
) {
  if (!startDate || !endDate) return false;
  return date >= startDate && date <= endDate;
}

export default function ArchiveCalendar({
  startDate,
  endDate,
  onDateRangeSelect,
}: ArchiveCalendarProps) {
  // Normalize today's date to midnight so time variations don't break comparisons
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewMonth, setViewMonth] = useState(
    startDate?.getMonth() ?? today.getMonth(),
  );
  const [viewYear, setViewYear] = useState(
    startDate?.getFullYear() ?? today.getFullYear(),
  );

  const [tempStartDate, setTempStartDate] = useState<Date | null>(startDate);

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(viewYear, viewMonth, day);

    if (!tempStartDate) {
      // First date selection
      setTempStartDate(selectedDate);
    } else if (selectedDate < tempStartDate) {
      // If selected date is before start date, reset
      setTempStartDate(selectedDate);
    } else {
      // Complete the range
      onDateRangeSelect(tempStartDate, selectedDate);
      setTempStartDate(null);
    }
  };

  const clearSelection = () => {
    setTempStartDate(null);
    onDateRangeSelect(null, null);
  };

  // Build the calendar grid
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [];
  // Pad with nulls for days before the 1st
  for (let i = 0; i < startDayOfWeek; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-[#000058] px-4 py-3 flex items-center justify-between">
        <button
          onClick={goToPrevMonth}
          className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-white font-bold text-base">
          {BENGALI_MONTHS[viewMonth]} {viewYear}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
        {DAY_NAMES.map(name => (
          <div
            key={name}
            className="text-center py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide"
          >
            {name}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 p-2 gap-0.5">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="aspect-square" />;
          }

          const dateObj = new Date(viewYear, viewMonth, day);

          // Fix: Compare direct midnights. Anything greater than today is the future.
          const isFuture = dateObj > today;

          const isStartSelected = startDate && isSameDay(dateObj, startDate);
          const isEndSelected = endDate && isSameDay(dateObj, endDate);
          const isTempStart =
            tempStartDate && isSameDay(dateObj, tempStartDate);
          const inRange = isDateInRange(
            dateObj,
            tempStartDate || startDate,
            endDate,
          );
          const isToday = isSameDay(dateObj, today);

          return (
            <button
              key={`day-${day}`}
              onClick={() => !isFuture && handleDateClick(day)}
              disabled={isFuture}
              className={`
                aspect-square flex items-center justify-center text-sm font-medium rounded-lg transition-all
                ${
                  isFuture
                    ? "text-gray-300 cursor-not-allowed bg-gray-50"
                    : isStartSelected || isEndSelected || isTempStart
                      ? "bg-red-600 text-white shadow-md shadow-red-200 scale-105"
                      : inRange
                        ? "bg-red-100 text-red-700"
                        : isToday
                          ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                          : "text-gray-700 hover:bg-gray-100"
                }
              `}
              aria-label={`${day}`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Selection Info & Clear Button */}
      {(tempStartDate || startDate || endDate) && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="text-xs text-gray-600">
            {tempStartDate && !endDate ? (
              <span>শেষ তারিখ নির্বাচন করুন</span>
            ) : startDate && endDate ? (
              <span>
                {startDate.toLocaleDateString("bn-BD", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                -{" "}
                {endDate.toLocaleDateString("bn-BD", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            ) : null}
          </div>
          <button
            onClick={clearSelection}
            className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            সাফ করুন
          </button>
        </div>
      )}
    </div>
  );
}
