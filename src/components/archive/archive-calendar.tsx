"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ArchiveCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const DAY_NAMES = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"];
const BENGALI_MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function ArchiveCalendar({
  selectedDate,
  onDateSelect,
}: ArchiveCalendarProps) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(
    selectedDate?.getMonth() ?? today.getMonth(),
  );
  const [viewYear, setViewYear] = useState(
    selectedDate?.getFullYear() ?? today.getFullYear(),
  );

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
          const isSelected = selectedDate && isSameDay(dateObj, selectedDate);
          const isToday = isSameDay(dateObj, today);

          return (
            <button
              key={`day-${day}`}
              onClick={() => onDateSelect(dateObj)}
              className={`
                aspect-square flex items-center justify-center text-sm font-medium rounded-lg transition-all
                ${
                  isSelected
                    ? "bg-red-600 text-white shadow-md shadow-red-200 scale-105"
                    : isToday
                      ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                      : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
