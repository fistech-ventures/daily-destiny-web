// "use client";

// import React, { useState, useRef, useEffect, useCallback, memo } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import MainPage from "./MainPage";

// // 💡 thumbnail and fullImage point to the same file for now.
// //    When you're ready to optimise, generate small WebP thumbs (see script at
// //    the bottom of this file) and update the thumbnail paths to:
// //    "/daily-destiny-e-paper/1.webp" etc.
// export const SAMPLE_PAGES = [
//   {
//     id: 1,
//     pageNumber: "১",
//     section: "প্রধান পাতা",
//     thumbnail: "/daily-destiny-e-paper/1.webp",
//     fullImage: "/daily-destiny-e-paper/1.webp",
//   },
//   {
//     id: 2,
//     pageNumber: "২",
//     section: "পাতা ২",
//     thumbnail: "/daily-destiny-e-paper/2.jpg",
//     fullImage: "/daily-destiny-e-paper/2.jpg",
//   },
//   {
//     id: 3,
//     pageNumber: "৩",
//     section: "পাতা ৩",
//     thumbnail: "/daily-destiny-e-paper/3.jpg",
//     fullImage: "/daily-destiny-e-paper/3.jpg",
//   },
//   {
//     id: 4,
//     pageNumber: "৪",
//     section: "পাতা ৪",
//     thumbnail: "/daily-destiny-e-paper/4.jpg",
//     fullImage: "/daily-destiny-e-paper/4.jpg",
//   },
//   {
//     id: 5,
//     pageNumber: "৫",
//     section: "পাতা ৫",
//     thumbnail: "/daily-destiny-e-paper/5.jpg",
//     fullImage: "/daily-destiny-e-paper/5.jpg",
//   },
//   {
//     id: 6,
//     pageNumber: "৬",
//     section: "পাতা ৬",
//     thumbnail: "/daily-destiny-e-paper/6.jpg",
//     fullImage: "/daily-destiny-e-paper/6.jpg",
//   },
//   {
//     id: 7,
//     pageNumber: "৭",
//     section: "পাতা ৭",
//     thumbnail: "/daily-destiny-e-paper/7.jpg",
//     fullImage: "/daily-destiny-e-paper/7.jpg",
//   },
//   {
//     id: 8,
//     pageNumber: "৮",
//     section: "পাতা ৮",
//     thumbnail: "/daily-destiny-e-paper/8.jpg",
//     fullImage: "/daily-destiny-e-paper/8.jpg",
//   },
//   {
//     id: 9,
//     pageNumber: "৯",
//     section: "ব্ল্যাক CTP (০২-০৭)",
//     thumbnail: "/daily-destiny-e-paper/Page%2002-07%20Black%20CTP.jpg",
//     fullImage: "/daily-destiny-e-paper/Page%2002-07%20Black%20CTP.jpg",
//   },
//   {
//     id: 10,
//     pageNumber: "১০",
//     section: "কালার CTP (০৪-০৫)",
//     thumbnail: "/daily-destiny-e-paper/Page%2004-05%20Colour%20CTP.jpg",
//     fullImage: "/daily-destiny-e-paper/Page%2004-05%20Colour%20CTP.jpg",
//   },
//   {
//     id: 11,
//     pageNumber: "১১",
//     section: "কালার CTP (০৬-০৩)",
//     thumbnail: "/daily-destiny-e-paper/Page%2006-03%20Colour%20CTP.jpg",
//     fullImage: "/daily-destiny-e-paper/Page%2006-03%20Colour%20CTP.jpg",
//   },
//   {
//     id: 12,
//     pageNumber: "১২",
//     section: "CTP পাতা ২ (০৮-০১)",
//     thumbnail: "/daily-destiny-e-paper/Page%2008-01%20CTP%202.jpg",
//     fullImage: "/daily-destiny-e-paper/Page%2008-01%20CTP%202.jpg",
//   },
// ];

// // ─── Memoised thumbnail so only the two items that change (prev-active / new-active) re-render ───
// const Thumbnail = memo(function Thumbnail({
//   page,
//   index,
//   isActive,
//   onClick,
// }: {
//   page: (typeof SAMPLE_PAGES)[0];
//   index: number;
//   isActive: boolean;
//   onClick: (i: number) => void;
// }) {
//   return (
//     <div
//       onClick={() => onClick(index)}
//       className={`flex-none w-20 md:w-24 cursor-pointer transition-transform duration-200 will-change-transform ${
//         isActive ? "scale-105" : "opacity-60 hover:opacity-90"
//       }`}
//     >
//       <div
//         className={`overflow-hidden rounded border-2 transition-colors duration-200 ${
//           isActive
//             ? "border-red-500 shadow-md shadow-red-500/30"
//             : "border-transparent"
//         }`}
//       >
//         {/* 
//           ✅ FIX 1 – explicit width/height prevents layout shift (CLS)
//           ✅ FIX 2 – loading="lazy" defers off-screen thumbnails
//           ✅ FIX 3 – decoding="async" keeps main thread free
//           ✅ FIX 4 – thumbnails should be separate, small webp files (~5–15 KB each)
//                      See comments at the bottom of this file for the conversion command.
//         */}
//         <img
//           src={page.thumbnail}
//           alt={`পৃষ্ঠা ${page.pageNumber}`}
//           width={96}
//           height={144}
//           loading={index < 4 ? "eager" : "lazy"} // first 4 load immediately
//           decoding="async"
//           className="w-full aspect-[2/3] object-cover"
//         />
//       </div>
//       <p className="mt-1 text-center text-[11px] text-gray-300 font-medium truncate">
//         {page.pageNumber}
//       </p>
//     </div>
//   );
// });

// const PaperSlider = () => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   // Track which full images are already in the browser cache so we never
//   // create duplicate Image() objects for the same URL.
//   const preloadedRef = useRef<Set<string>>(new Set());
//   const thumbnailContainerRef = useRef<HTMLDivElement>(null);

//   // ─── Navigation ───────────────────────────────────────────────────────────
//   const handleNext = useCallback(() => {
//     setActiveIndex(prev => Math.min(prev + 1, SAMPLE_PAGES.length - 1));
//   }, []);

//   const handlePrev = useCallback(() => {
//     setActiveIndex(prev => Math.max(prev - 1, 0));
//   }, []);

//   // ─── Keyboard navigation ──────────────────────────────────────────────────
//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === "ArrowRight") handleNext();
//       if (e.key === "ArrowLeft") handlePrev();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [handleNext, handlePrev]);

//   // ─── Scroll active thumbnail into view ───────────────────────────────────
//   useEffect(() => {
//     const container = thumbnailContainerRef.current;
//     if (!container) return;
//     const thumb = container.children[activeIndex] as HTMLElement | undefined;
//     thumb?.scrollIntoView({
//       behavior: "smooth",
//       inline: "center",
//       block: "nearest",
//     });
//   }, [activeIndex]);

//   // ─── Smart preloading: current ±1 neighbours only ────────────────────────
//   // ✅ FIX 5 – Previously only preloaded the next page.
//   //            Now we preload prev + next and dedupe via a Set so we never
//   //            fire the same network request twice.
//   useEffect(() => {
//     const indices = [activeIndex - 1, activeIndex, activeIndex + 1];
//     indices.forEach(i => {
//       if (i < 0 || i >= SAMPLE_PAGES.length) return;
//       const src = SAMPLE_PAGES[i].fullImage;
//       if (preloadedRef.current.has(src)) return;
//       preloadedRef.current.add(src);
//       const img = new Image();
//       img.src = src;
//     });
//   }, [activeIndex]);

//   const isFirst = activeIndex === 0;
//   const isLast = activeIndex === SAMPLE_PAGES.length - 1;

//   return (
//     <div className="flex flex-col overflow-hidden bg-[#f5f5f5] relative">
//       {/* ── Header ──────────────────────────────────────────────────────────── */}
//       <header className="flex items-center justify-between px-5 py-2.5 bg-white border-b shadow-sm shrink-0">
//         <span className="font-medium text-gray-700 text-sm md:text-base leading-tight">
//           {SAMPLE_PAGES[activeIndex].section}
//           <span className="mx-1.5 text-gray-300">•</span>
//           পৃষ্ঠা {SAMPLE_PAGES[activeIndex].pageNumber}
//         </span>
//         <span className="text-xs text-gray-400 tabular-nums">
//           {activeIndex + 1} / {SAMPLE_PAGES.length}
//         </span>
//       </header>

//       {/* ── Main reader ─────────────────────────────────────────────────────── */}

//       <main className=" flex-1 min-h-0 flex flex-col">
//         {/* Prev button */}
//         <button
//           onClick={handlePrev}
//           disabled={isFirst}
//           aria-label="আগের পৃষ্ঠা"
//           className={`absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20
//             p-2.5 md:p-3 rounded-full bg-red-600 text-white shadow-lg
//             transition-all duration-200 will-change-transform cursor-pointer
//             ${isFirst ? "opacity-0 pointer-events-none" : "hover:bg-red-700 active:scale-95"}`}
//         >
//           <ChevronLeft size={22} />
//         </button>

//         {/* Page view — fills all remaining height */}
//         <div className="flex-1 min-h-0 px-4 md:px-10 lg:px-16 py-3">
//           {/*
//             MainPage must internally use:
//               <img ... className="w-full h-full object-contain" />
//             and its container should be `w-full h-full`.
//             Pass the page src so MainPage doesn't re-derive it.
//           */}
//           <MainPage activeIndex={activeIndex} />
//         </div>

//         {/* Next button */}
//         <button
//           onClick={handleNext}
//           disabled={isLast}
//           aria-label="পরের পৃষ্ঠা"
//           className={`absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20
//             p-2.5 md:p-3 rounded-full bg-red-600 text-white shadow-lg
//             transition-all duration-200 will-change-transform cursor-pointer
//             ${isLast ? "opacity-0 pointer-events-none" : "hover:bg-red-700 active:scale-95"}`}
//         >
//           <ChevronRight size={22} />
//         </button>
//       </main>

//       {/* ── Thumbnail strip ──────────────────────────────────────────────────── */}
//       <footer className="shrink-0 bg-[#1e1e1e] border-t border-[#111] px-4 py-3">
//         <div
//           ref={thumbnailContainerRef}
//           className="flex gap-3 overflow-x-auto scroll-smooth pb-1"
//           style={{ scrollbarWidth: "thin", scrollbarColor: "#555 transparent" }}
//         >
//           {SAMPLE_PAGES.map((page, index) => (
//             <Thumbnail
//               key={page.id}
//               page={page}
//               index={index}
//               isActive={index === activeIndex}
//               onClick={setActiveIndex}
//             />
//           ))}
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default PaperSlider;


"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import MainPage from "./MainPage";
// 👉 Adjust this import to wherever api.ts actually lives in your project
// (e.g. "@/lib/api" or "@/services/api") if it's not at this path.
import { EpaperPage } from "@/lib/api";
import { formatBengaliDate, toBengaliNumber } from "./bengali-utils";

// ─── Shape consumed by MainPage / the thumbnail strip ──────────────────────
export interface EpaperViewPage {
  id: string;
  pageNumber: string; // Bengali numeral, e.g. "১"
  section: string; // human label shown in the header (API's `title`)
  thumbnail: string;
  fullImage: string;
}

function mapToViewPages(pages: EpaperPage[]): EpaperViewPage[] {
  return [...pages]
    .sort((a, b) => a.pageNumber - b.pageNumber)
    .map(p => ({
      id: p.id,
      pageNumber: toBengaliNumber(p.pageNumber),
      section: p.title || `পাতা ${toBengaliNumber(p.pageNumber)}`,
      thumbnail: p.thumbnailUrl,
      fullImage: p.imageUrl,
    }));
}

interface PaperSliderProps {
  pages: EpaperPage[];
  currentDate: string | null;
  availableDates: string[];
}

// ─── Memoised thumbnail so only the two items that change (prev-active / new-active) re-render ───
const Thumbnail = memo(function Thumbnail({
  page,
  index,
  isActive,
  onClick,
}: {
  page: EpaperViewPage;
  index: number;
  isActive: boolean;
  onClick: (i: number) => void;
}) {
  return (
    <div
      onClick={() => onClick(index)}
      className={`flex-none w-20 md:w-24 cursor-pointer transition-transform duration-200 will-change-transform ${
        isActive ? "scale-105" : "opacity-60 hover:opacity-90"
      }`}
    >
      <div
        className={`overflow-hidden rounded border-2 transition-colors duration-200 ${
          isActive
            ? "border-red-500 shadow-md shadow-red-500/30"
            : "border-transparent"
        }`}
      >
        <img
          src={page.thumbnail}
          alt={`পৃষ্ঠা ${page.pageNumber}`}
          width={96}
          height={144}
          loading={index < 4 ? "eager" : "lazy"} // first 4 load immediately
          decoding="async"
          className="w-full aspect-[2/3] object-cover"
        />
      </div>
      <p className="mt-1 text-center text-[11px] text-gray-300 font-medium truncate">
        {page.pageNumber}
      </p>
    </div>
  );
});

const PaperSlider = ({ pages, currentDate, availableDates }: PaperSliderProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const viewPages = useMemo(() => mapToViewPages(pages), [pages]);

  const [activeIndex, setActiveIndex] = useState(0);
  // Track which full images are already in the browser cache so we never
  // create duplicate Image() objects for the same URL.
  const preloadedRef = useRef<Set<string>>(new Set());
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  // ─── Reset to the first page whenever the edition (date) changes ────────
  useEffect(() => {
    setActiveIndex(0);
  }, [currentDate]);

  // ─── Navigation ───────────────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    setActiveIndex(prev => Math.min(prev + 1, viewPages.length - 1));
  }, [viewPages.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex(prev => Math.max(prev - 1, 0));
  }, []);

  // ─── Keyboard navigation ──────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleNext, handlePrev]);

  // ─── Scroll active thumbnail into view ───────────────────────────────────
  useEffect(() => {
    const container = thumbnailContainerRef.current;
    if (!container) return;
    const thumb = container.children[activeIndex] as HTMLElement | undefined;
    thumb?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex]);

  // ─── Smart preloading: current ±1 neighbours only ────────────────────────
  useEffect(() => {
    const indices = [activeIndex - 1, activeIndex, activeIndex + 1];
    indices.forEach(i => {
      if (i < 0 || i >= viewPages.length) return;
      const src = viewPages[i].fullImage;
      if (!src || preloadedRef.current.has(src)) return;
      preloadedRef.current.add(src);
      const img = new Image();
      img.src = src;
    });
  }, [activeIndex, viewPages]);

  // ─── Date picker → updates the URL, the server component refetches ──────
  const handleDateChange = (newDate: string) => {
    if (!newDate || newDate === currentDate) return;
    router.push(`${pathname}?date=${newDate}`);
  };

  const DatePicker = () =>
    availableDates.length > 0 ? (
      <label className="flex items-center gap-1.5 text-xs text-gray-500">
        <Calendar size={14} className="text-gray-400" />
        <select
          value={currentDate ?? ""}
          onChange={e => handleDateChange(e.target.value)}
          className="bg-transparent text-gray-700 font-medium text-xs md:text-sm
                     border border-gray-200 rounded px-2 py-1 cursor-pointer
                     focus:outline-none focus:ring-1 focus:ring-red-400"
        >
          {availableDates.map(d => (
            <option key={d} value={d}>
              {formatBengaliDate(d)}
            </option>
          ))}
        </select>
      </label>
    ) : null;

  // ─── Empty state: no edition exists for this date / at all ──────────────
  if (!viewPages.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 bg-[#f5f5f5] px-4">
        <span className="text-4xl">📰</span>
        <p className="text-gray-500 text-sm text-center">
          এই তারিখের জন্য কোনো ই-পেপার পাওয়া যায়নি।
        </p>
        <DatePicker />
      </div>
    );
  }

  const isFirst = activeIndex === 0;
  const isLast = activeIndex === viewPages.length - 1;

  return (
    <div className="flex flex-col overflow-hidden bg-[#f5f5f5] relative">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between gap-3 px-5 py-2.5 bg-white border-b shadow-sm shrink-0">
        <span className="font-medium text-gray-700 text-sm md:text-base leading-tight truncate">
          {viewPages[activeIndex].section}
          <span className="mx-1.5 text-gray-300">•</span>
          পৃষ্ঠা {viewPages[activeIndex].pageNumber}
        </span>

        <div className="flex items-center gap-3 shrink-0">
          <DatePicker />
          <span className="text-xs text-gray-400 tabular-nums">
            {toBengaliNumber(activeIndex + 1)} / {toBengaliNumber(viewPages.length)}
          </span>
        </div>
      </header>

      {/* ── Main reader ─────────────────────────────────────────────────────── */}
      <main className=" flex-1 min-h-0 flex flex-col">
        {/* Prev button */}
        <button
          onClick={handlePrev}
          disabled={isFirst}
          aria-label="আগের পৃষ্ঠা"
          className={`absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20
            p-2.5 md:p-3 rounded-full bg-red-600 text-white shadow-lg
            transition-all duration-200 will-change-transform cursor-pointer
            ${isFirst ? "opacity-0 pointer-events-none" : "hover:bg-red-700 active:scale-95"}`}
        >
          <ChevronLeft size={22} />
        </button>

        {/* Page view — fills all remaining height */}
        <div className="flex-1 min-h-0 px-4 md:px-10 lg:px-16 py-3">
          <MainPage pages={viewPages} activeIndex={activeIndex} />
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={isLast}
          aria-label="পরের পৃষ্ঠা"
          className={`absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20
            p-2.5 md:p-3 rounded-full bg-red-600 text-white shadow-lg
            transition-all duration-200 will-change-transform cursor-pointer
            ${isLast ? "opacity-0 pointer-events-none" : "hover:bg-red-700 active:scale-95"}`}
        >
          <ChevronRight size={22} />
        </button>
      </main>

      {/* ── Thumbnail strip ──────────────────────────────────────────────────── */}
      <footer className="shrink-0 bg-[#1e1e1e] border-t border-[#111] px-4 py-3">
        <div
          ref={thumbnailContainerRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-1"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#555 transparent" }}
        >
          {viewPages.map((page, index) => (
            <Thumbnail
              key={page.id}
              page={page}
              index={index}
              isActive={index === activeIndex}
              onClick={setActiveIndex}
            />
          ))}
        </div>
      </footer>
    </div>
  );
};

export default PaperSlider;