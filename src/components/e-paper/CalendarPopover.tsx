"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { formatBengaliDate, toBengaliNumber } from "./bengali-utils";

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

const BENGALI_DAY_NAMES = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহস্পতি", "শুক্র", "শনি"];

interface CalendarPopoverProps {
  availableDates: string[];
  currentDate: string | null;
  onSelect: (date: string) => void;
}

function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getMonthBounds(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { startDayOfWeek, daysInMonth };
}

export default function CalendarPopover({
  availableDates,
  currentDate,
  onSelect,
}: CalendarPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    if (currentDate) return new Date(currentDate + "T00:00:00");
    if (availableDates.length > 0)
      return new Date(availableDates[0] + "T00:00:00");
    return new Date();
  });

  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Build a fast Set for availability lookups
  const availableSet = new Set(availableDates);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const { startDayOfWeek, daysInMonth } = getMonthBounds(year, month);

  // Build calendar grid: leading nulls then day numbers
  const days: (number | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const formatDate = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const isAvailable = (day: number) => availableSet.has(formatDate(day));

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const isSelected = (day: number) => currentDate === formatDate(day);

  const handlePrevMonth = () => setViewMonth(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewMonth(new Date(year, month + 1, 1));

  const handleDateClick = (day: number) => {
    const dateStr = formatDate(day);
    if (isAvailable(day)) {
      onSelect(dateStr);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* ── Trigger button (looks like a native date input) ────────────── */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 border border-gray-300 rounded px-3 py-1.5 text-sm bg-white font-medium text-gray-700 outline-none cursor-pointer hover:border-gray-400 focus-visible:ring-1 focus-visible:ring-emerald-400 focus-visible:border-emerald-400 transition-colors"
        aria-label="ই-পেপারের তারিখ নির্বাচন"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <Calendar size={16} className="text-gray-400 shrink-0" />
        <span>
          {currentDate
            ? formatBengaliDate(currentDate)
            : "তারিখ নির্বাচন করুন"}
        </span>
      </button>

      {/* ── Popover calendar ───────────────────────────────────────────── */}
      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="ক্যালেন্ডার"
          className="absolute top-full left-0 mt-1.5 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-3 min-w-[280px]"
        >
          {/* Month / Year navigation header */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              aria-label="আগের মাস"
            >
              <ChevronLeft size={16} className="text-gray-500" />
            </button>
            <span className="text-sm font-semibold text-gray-800 select-none">
              {BENGALI_MONTHS[month]} {toBengaliNumber(year)}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              aria-label="পরের মাস"
            >
              <ChevronRight size={16} className="text-gray-500" />
            </button>
          </div>

          {/* Day name header row */}
          <div className="grid grid-cols-7 mb-1">
            {BENGALI_DAY_NAMES.map((name) => (
              <div
                key={name}
                className="text-center text-[11px] font-medium text-gray-400 py-1 select-none"
              >
                {name}
              </div>
            ))}
          </div>

          {/* Calendar day grid */}
          <div className="grid grid-cols-7">
            {days.map((day, idx) => {
              if (day === null) {
                return <div key={`e-${idx}`} className="p-1" />;
              }

              const available = isAvailable(day);
              const selected = isSelected(day);
              const today = isToday(day);

              let cellClass =
                "p-1 text-center text-sm rounded transition select-none ";

              if (!available) {
                cellClass += "text-gray-300 cursor-not-allowed";
              } else if (selected) {
                cellClass +=
                  "bg-emerald-600 text-white font-semibold shadow-sm cursor-pointer";
              } else if (today) {
                cellClass +=
                  "text-emerald-700 font-semibold hover:bg-emerald-50 cursor-pointer";
              } else {
                cellClass +=
                  "text-gray-700 hover:bg-gray-100 cursor-pointer";
              }

              return (
                <button
                  key={day}
                  type="button"
                  disabled={!available}
                  onClick={() => handleDateClick(day)}
                  className={cellClass}
                  aria-label={`${toBengaliNumber(day)} ${
                    BENGALI_MONTHS[month]
                  } ${toBengaliNumber(year)}${!available ? " (উপলব্ধ নয়)" : ""}`}
                >
                  {toBengaliNumber(day)}
                </button>
              );
            })}
          </div>

          {/* Footer: available date count */}
          {availableDates.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-400 text-center select-none">
              মোট {toBengaliNumber(availableDates.length)}টি সংস্করণ উপলব্ধ
            </div>
          )}
        </div>
      )}
    </div>
  );
}
