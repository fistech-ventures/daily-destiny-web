"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Menu,
  Newspaper,
  MoreHorizontal,
  X,
  Home,
  Facebook,
  Youtube,
  Instagram,
  Linkedin,
  Users,
  ChevronDown,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavbarSocialLinks } from "./navbar-social-links";
import SocialIcon from "./SocialIcon";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Category, MarketPrice } from "@/lib/types";
import { VideoArticle } from "@/lib/api";
import { getMarketPrice } from "@/lib/api";
import Headline from "./headline";
import MarketPriceWidget from "../market-price/market-price-ticker";
import { getAllcategories } from "@/lib/api";

function DesktopDateTime() {
  const locale = useLocale();
  const [dateTime, setDateTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dhakaTime = new Date(
    dateTime.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
  );

  const dateStr = new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-US", {
    timeZone: "Asia/Dhaka",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(dhakaTime);

  const timeStr = new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-US", {
    timeZone: "Asia/Dhaka",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(dhakaTime);

  return (
    <div className="hidden md:flex flex-col text-xs text-gray-500 leading-tight">
      <span className="font-medium text-gray-700">{dateStr}</span>
      <span className="text-gray-400">{timeStr}</span>
    </div>
  );
}

export function Navbar({
  categories,
  totalCategories,
  headlines = [],
  marketPrices: initialMarketPrices = [],
}: {
  categories: Category[];
  totalCategories?: number;
  videos?: VideoArticle[];
  headlines?: { title: string; code: string; category: string }[];
  marketPrices?: MarketPrice[];
}) {
  const [marketPrices, setMarketPrices] =
    React.useState<MarketPrice[]>(initialMarketPrices);

  React.useEffect(() => {
    if (initialMarketPrices && initialMarketPrices.length > 0) return;
    async function loadPrices() {
      try {
        const response = await getMarketPrice({ page: 1, limit: 10 });
        const data = Array.isArray(response) ? response : response.data || [];
        setMarketPrices(data);
      } catch (error) {
        console.error(
          "Failed to fetch market prices for widget in navbar:",
          error,
        );
      }
    }
    loadPrices();
  }, [initialMarketPrices]);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const pathname = usePathname();

  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [isDesktopPopupOpen, setIsDesktopPopupOpen] = React.useState(false);
  const [isMoreOpen, setIsMoreOpen] = React.useState(false);
  const [hideNavbar, setHideNavbar] = React.useState(false);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;

      // Hide top bar after a small scroll, and hide the navbar on a larger downward scroll.
      if (isScrollingDown && currentScrollY > 100) {
        setHideNavbar(true);
      } else if (!isScrollingDown) {
        setHideNavbar(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const locales = ["en", "bn"];
  const strippedPathname = locales.reduce(
    (p, locale) =>
      p.startsWith(`/${locale}`) ? p.replace(`/${locale}`, "") || "/" : p,
    pathname,
  );

  // Dropdown state for categories (used for touch devices and explicit open control)
  // Category IDs are strings (see src/lib/types.ts), so store string | null here.
  const [openDropdownId, setOpenDropdownId] = React.useState<string | null>(
    null,
  );
  const navRef = React.useRef<HTMLElement | null>(null);
  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  React.useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("click", handleDocClick);
    return () => {
      document.removeEventListener("click", handleDocClick);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // ── Client-side category pagination (for the "আরও" overlay) ──
  const [loadedCategories, setLoadedCategories] =
    React.useState<Category[]>(categories);
  const [categoriesPage, setCategoriesPage] = React.useState(1);
  const [isLoadingMoreCats, setIsLoadingMoreCats] = React.useState(false);

  // Sync state when the server-provided categories prop changes
  React.useEffect(() => {
    setLoadedCategories(categories);
    setCategoriesPage(1);
  }, [categories]);

  const hasMoreCategories =
    totalCategories !== undefined && loadedCategories.length < totalCategories;

  const loadMoreCategories = async () => {
    if (isLoadingMoreCats) return;
    setIsLoadingMoreCats(true);
    try {
      const nextPage = categoriesPage + 1;
      const res = await getAllcategories({
        sortBy: "position",
        page: nextPage,
        limit: 50,
      });
      const newCategories: Category[] = res?.data || [];
      if (newCategories.length > 0) {
        // Append without duplicates using functional updater to avoid stale closure
        setLoadedCategories((prev) => {
          const existingTitles = new Set(prev.map((c) => c.titleBn || c.title));
          const uniqueNew = newCategories.filter(
            (c) => !existingTitles.has(c.titleBn || c.title),
          );
          return [...prev, ...uniqueNew];
        });
        setCategoriesPage(nextPage);
      }
    } catch (error) {
      console.error("Failed to load more categories:", error);
    } finally {
      setIsLoadingMoreCats(false);
    }
  };

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full bg-white shadow-sm transition-transform duration-300 ease-in-out",
          hideNavbar ? "-translate-y-full md:translate-y-0" : "translate-y-0",
        )}
      >
        {/* ════════════════════════════════════════════════
          TOP BAR — Date(Left) | Logo(Center) | Social Icons(Right)
          ════════════════════════════════════════════════ */}
        <div className="border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-2.5">
              {/* Left: Current Date & Time (Desktop only) */}
              <DesktopDateTime />

              {/* Center: Logo */}
              <Link href="/" className="shrink-0">
                <img
                  src="/images/logoblack.png"
                  alt="Logo"
                  width={200}
                  height={64}
                  className="h-11 w-auto object-contain mx-auto"
                />
              </Link>

              {/* Right side */}
              {/* Desktop: 4 social icons + three-dot */}
              <div className="hidden md:flex items-center gap-1.5">
                {/* Facebook */}
                <SocialIcon
                  bgColor="#1877F2"
                  href="https://www.facebook.com/DailyDestinyBD"
                >
                  <Facebook
                    size={16}
                    color="#ffffff"
                    fill="#ffffff"
                    className="stroke-[1] md:h-[18px] md:w-[18px]"
                  />
                </SocialIcon>

                {/* YouTube */}
                <SocialIcon
                  bgColor="#FF0000"
                  href="https://www.youtube.com/@DailyDestinyBD"
                >
                  <Youtube
                    size={16}
                    color="#FF0000"
                    fill="#ffffff"
                    className="stroke-[1] md:h-[18px] md:w-[18px]"
                  />
                </SocialIcon>

                {/* Instagram */}
                <SocialIcon bgColor="#E1306C" href="https://instagram.com">
                  <Instagram
                    size={16}
                    color="#ffffff"
                    className="stroke-[2] md:h-[18px] md:w-[18px]"
                  />
                </SocialIcon>

                {/* TikTok */}
                <SocialIcon bgColor="#000000" href="https://tiktok.com">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 md:h-4 md:w-4"
                    fill="#ffffff"
                  >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.61 4.18 1.15 1.21 2.76 1.93 4.41 2.02v3.62c-1.68-.03-3.32-.57-4.68-1.57-.18-.13-.34-.28-.5-.43v6.33c.03 2.87-1.4 5.63-3.89 7.07-2.73 1.63-6.29 1.41-8.79-.54-2.58-1.95-3.64-5.39-2.54-8.5 1.01-2.99 3.94-5.07 7.13-5.05.12 0 .24 0 .36.01v3.74c-1.3-.12-2.6.43-3.41 1.45-.96 1.16-1.12 2.84-.41 4.17.67 1.34 2.14 2.13 3.64 1.94 1.52-.14 2.76-1.34 2.96-2.85.04-.31.05-.62.05-.93V.02z" />
                  </svg>
                </SocialIcon>

                {/* Three-dot button — opens social links modal */}
                <button
                  onClick={() => setIsDesktopPopupOpen(!isDesktopPopupOpen)}
                  className="w-9 h-9 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-transform active:scale-95 text-white shadow-sm"
                  aria-label="Show more social links"
                >
                  {isDesktopPopupOpen ? (
                    <X size={18} />
                  ) : (
                    <MoreHorizontal size={18} />
                  )}
                </button>
              </div>

              {/* Mobile: Original social icons with three-dot */}
              <div className="md:hidden">
                <NavbarSocialLinks
                  isPopupOpen={isPopupOpen}
                  setIsPopupOpen={setIsPopupOpen}
                  variant="navbar"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════
          Headline  s Banner 
          ════════════════════════════════════════════════ */}
        <Headline headlines={headlines} />

        {/* ════════════════════════════════════════════════
          BOTTOM BAR — Categories (Left) | Actions (Right)
          ════════════════════════════════════════════════ */}
        <div className="relative border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* Category links — scrollable */}
              <nav
                ref={navRef}
                className="flex items-center overflow-x-auto scrollbar-none h-full"
              >
                <Link
                  href={`/`}
                  className={cn(
                    "shrink-0 px-3 flex items-center h-full border-b-2 transition-colors",
                    strippedPathname === `/`
                      ? "border-red-600 text-red-600"
                      : "border-transparent text-gray-700 hover:text-red-600",
                  )}
                  aria-label="Home"
                >
                  <Home className="h-5 w-5" />
                </Link>
                <Link
                  href={`/recent`}
                  className={cn(
                    "shrink-0 px-3 hidden md:flex items-center h-full text-base font-bold whitespace-nowrap border-b-2 transition-colors",
                    strippedPathname === `/recent`
                      ? "border-red-600 text-primary"
                      : "border-transparent text-gray-700 hover:text-primary/80",
                  )}
                >
                  সর্বশেষ
                </Link>

                {/* Ensure your parent container has classes like: "flex overflow-x-auto scrollbar-none" */}
                <div className="hidden md:flex items-center overflow-x-auto scrollbar-none gap-2 h-full">
                  {categories
                    .slice(0, 10)
                    .filter((category, index, self) => {
                      const title = category.titleBn || category.title;
                      return (
                        self.findIndex(
                          (c) => (c.titleBn || c.title) === title,
                        ) === index
                      );
                    })
                    .map((category) => (
                      <div key={category.id} className="shrink-0 h-full">
                        <Link
                          href={`/${category.slug}`}
                          className={cn(
                            "px-3 flex items-center h-full text-base font-bold whitespace-nowrap border-b-2 transition-colors",
                            strippedPathname === `/${category.slug}`
                              ? "border-red-600 text-red-600"
                              : "border-transparent text-gray-700 hover:text-red-600",
                          )}
                        >
                          {category.titleBn || category.title}
                        </Link>
                      </div>
                    ))}
                </div>

                {/* আরও button — shows all categories */}
                <button
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  className={cn(
                    "cursor-pointer shrink-0 px-4 py-1.5 flex items-center gap-2 rounded-full text-sm font-bold tracking-wide whitespace-nowrap transition-all duration-300 select-none","hidden md:flex",
                    isMoreOpen
                      ? "bg-red-600 text-white shadow-md shadow-red-600/20 scale-[0.98]"
                      : "bg-gray-50 border border-gray-200/80 text-gray-700 hover:bg-gray-100 hover:text-red-600 hover:border-red-200",
                  )}
                >
                  <span>আরও</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-300 ease-in-out",
                      isMoreOpen ? "rotate-180" : "opacity-80",
                    )}
                  />
                </button>

                <Link
                  href={`/video`}
                  className={cn(
                    "shrink-0 px-3 hidden md:flex items-center h-full text-base font-bold whitespace-nowrap border-b-2 transition-colors",
                    strippedPathname === `/video`
                      ? "border-primary text-text-primary/80"
                      : "border-transparent text-gray-700 hover:text-primary/80",
                  )}
                >
                  ভিডিও
                </Link>
              </nav>

              {/* Right actions */}
              <div className="flex items-center shrink-0 h-full divide-x divide-gray-200 border-l border-gray-200">
                {/* Market Widget Placement Wrapped with precise matching inline height styles */}
                <div className="hidden sm:flex h-full items-center">
                  <MarketPriceWidget marketPricing={marketPrices} />
                </div>

                {/* ই-পেপার */}
                <Link
                  href="/e-papers/visual"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-3 text-sm text-gray-700 hover:text-primary/80 transition-colors"
                >
                  <Newspaper className="h-4 w-4" />
                  <span>ই-পেপার</span>
                </Link>

                {/* Hamburger → Mega Menu */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <SheetTrigger
                    aria-label="Open menu"
                    className="flex items-center justify-center px-3 py-3 text-gray-700 cursor-pointer hover:text-primary/80 transition-colors"
                  >
                    <Menu className="h-5 w-5" />
                  </SheetTrigger>

                  {/* ── Full-screen mega menu ── */}
                  <SheetContent
                    side="top"
                    className="w-full h-screen max-h-screen px-0 py-6 overflow-y-auto bg-white"
                  >
                    {/* Mega menu header */}
                    <div className="flex items-center justify-between px-10 py-0 border-b border-gray-200 pb-2">
                      <Link href="/" onClick={() => setIsSheetOpen(false)}>
                        <img
                          src="/images/footerlogo.png"
                          alt="Logo"
                          className="h-10 w-auto object-contain"
                        />
                      </Link>
                      <div className="hidden md:block ">
                        <div className=" flex h-full justify-end items-center">
                          <MarketPriceWidget marketPricing={marketPrices} />
                        </div>
                      </div>
                      <div className="">
                        <Link
                          href="/e-papers/visual"
                          onClick={() => setIsSheetOpen(false)}
                          className="flex items-center gap-1.5 px-3 py-3 text-sm text-gray-700 hover:text-primary/80 transition-colors"
                        >
                          <Newspaper className="h-4 w-4" />
                          <span>ই-পেপার</span>
                        </Link>
                      </div>
                    </div>

                    {/* Mega menu body */}
                    <div className="flex flex-col lg:flex-row px-6 py-8 gap-8">
                      <div className="md:hidden!">
                        <div className=" flex h-full justify-end items-center">
                          <MarketPriceWidget marketPricing={marketPrices} />
                        </div>
                      </div>
                      {/* LEFT: quick nav + categories + subcategories */}
                      <div className="flex-1 min-w-0 p-5">
                        {/* Category rows */}
                        <div className="divide-y divide-gray-100">
                          {categories
                            .filter((category, index, self) => {
                              const title = category.titleBn || category.title;
                              return (
                                self.findIndex(
                                  (c) => (c.titleBn || c.title) === title,
                                ) === index
                              );
                            })
                            .map((category) => (
                              <div
                                key={category.id}
                                className="flex items-start py-3 gap-4"
                              >
                                {/* Category name */}
                                <div className="flex items-center gap-0.5 w-32 shrink-0">
                                  <Link
                                    href={`/${category.slug}`}
                                    onClick={() => setIsSheetOpen(false)}
                                    className="text-[15px] font-bold text-gray-900 hover:text-red-600 transition-colors"
                                  >
                                    {category.titleBn || category.title}
                                  </Link>

                                  {(category as Category).subCategories
                                    ?.length > 0 && (
                                    <span className="text-red-600 font-bold ml-1">
                                      ›
                                    </span>
                                  )}
                                </div>

                                {/* Subcategory links */}
                                {(category as Category).subCategories?.length >
                                  0 && (
                                  <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                                    {(category as Category).subCategories.map(
                                      (sub: Category) => (
                                        <Link
                                          key={sub.id}
                                          href={`/${sub.slug}`}
                                          onClick={() => setIsSheetOpen(false)}
                                          className="text-sm text-gray-600 hover:text-red-600 transition-colors whitespace-nowrap"
                                        >
                                          {sub.titleBn || sub.title}
                                        </Link>
                                      ),
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}                            {/* আরও button inside hamburger */}
                            <div className="flex items-start py-3 gap-4">
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => {
                                    setIsSheetOpen(false);
                                    setTimeout(() => setIsMoreOpen(true), 300);
                                  }}
                                  className="cursor-pointer text-[15px] font-bold text-red-600 hover:text-red-700 transition-all duration-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50/60"
                                >
                                  আরও বিভাগ
                                  <ChevronDown className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                সকল বিভাগ দেখুন
                              </div>
                            </div>
                        </div>
                      </div>

                      {/* RIGHT sidebar */}
                      <div className="lg:w-72 shrink-0 space-y-6 lg:border-l border-gray-200 lg:pl-8">
                        <div className="flex flex-col">
                          <h2 className="text-gray-800 text-lg font-bold border-l-4 pl-4 border-primary">
                            সোশ্যাল মিডিয়া
                          </h2>
                          <NavbarSocialLinks
                            isPopupOpen={isPopupOpen}
                            setIsPopupOpen={setIsPopupOpen}
                            variant="hamburger"
                          />
                        </div>
                        <Link
                          href="/e-papers/visual"
                          onClick={() => setIsSheetOpen(false)}
                        >
                          <div className="bg-[#000058] hover:bg-[#000058]/80 transition-colors px-4 py-2 text-white text-xs font-bold uppercase rounded-md tracking-wider flex flex-col items-start  gap-2">
                            <div className="flex items-center gap-2">
                              <Newspaper
                                size={24}
                                color="#ffffff"
                                className="stroke-[2] md:h-[24px] md:w-[24px]"
                              />
                              <div>
                                <h2 className="text-white text-lg font-bold  ">
                                  আজকের পত্রিকা
                                </h2>
                                <span className="text-white text-md font-bold  ">
                                  (print Version)
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>

          {/* Mega Menu Dropdown */}
          {openDropdownId &&
            (() => {
              const activeCategory = categories.find(
                (c) => c.id === openDropdownId,
              );
              if (
                !activeCategory ||
                !activeCategory.subCategories ||
                activeCategory.subCategories.length === 0
              )
                return null;
              return (
                <div
                  onMouseEnter={() => {
                    if (closeTimeoutRef.current)
                      clearTimeout(closeTimeoutRef.current);
                  }}
                  onMouseLeave={() => {
                    closeTimeoutRef.current = setTimeout(() => {
                      setOpenDropdownId(null);
                    }, 150);
                  }}
                  className={cn(
                    "absolute left-0 top-full z-50 w-full bg-white border-t border-b border-gray-200 shadow-xl transition-all duration-300 ease-in-out",
                    "animate-in fade-in slide-in-from-top-2 duration-200",
                  )}
                >
                  <div className="max-w-screen-xl mx-auto px-6 py-6 text-gray-900">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {activeCategory.subCategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/${sub.slug}`}
                          onClick={() => setOpenDropdownId(null)}
                          className="group/item flex flex-col p-3 rounded-lg border border-transparent hover:border-red-100 hover:bg-red-50/30 transition-all duration-200"
                        >
                          <div className="font-bold text-gray-900 group-hover/item:text-red-600 transition-colors">
                            {sub.titleBn || sub.title}
                          </div>
                          <span className="text-xs text-gray-500 mt-1">
                            {sub.titleBn
                              ? `${sub.titleBn} সংক্রান্ত সব খবর`
                              : `All news about ${sub.title}`}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
        </div>

        {/* ════════════════════════════════════════════════
          MOBILE SEARCH OVERLAY
          ════════════════════════════════════════════════ */}
      </header>

      {/* ════════════════════════════════════════════════
        DESKTOP THREE-DOT SOCIAL LINKS MODAL
        ════════════════════════════════════════════════ */}
      {mounted && isDesktopPopupOpen
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center hidden md:flex pointer-events-auto">
              <div
                onClick={() => setIsDesktopPopupOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
              />
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 bg-white border border-gray-200 rounded-[24px] p-8 pt-10 shadow-2xl flex flex-col items-center gap-5 animate-in fade-in zoom-in-75 slide-in-from-bottom-4 duration-300 ease-out"
              >
                <button
                  onClick={() => setIsDesktopPopupOpen(false)}
                  className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>

                {/* Social Icons Grid */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                  {/* Facebook */}
                  <SocialIcon
                    bgColor="#1877F2"
                    href="https://www.facebook.com/DailyDestinyBD"
                  >
                    <Facebook
                      size={18}
                      color="#ffffff"
                      fill="#ffffff"
                      className="stroke-[1]"
                    />
                  </SocialIcon>

                  {/* YouTube */}
                  <SocialIcon
                    bgColor="#FF0000"
                    href="https://www.youtube.com/@DailyDestinyBD"
                  >
                    <Youtube
                      size={18}
                      color="#FF0000"
                      fill="#ffffff"
                      className="stroke-[1]"
                    />
                  </SocialIcon>

                  {/* Instagram */}
                  <SocialIcon bgColor="#E1306C" href="https://instagram.com">
                    <Instagram
                      size={18}
                      color="#ffffff"
                      className="stroke-[2]"
                    />
                  </SocialIcon>

                  {/* TikTok */}
                  <SocialIcon bgColor="#000000" href="https://tiktok.com">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#ffffff">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.61 4.18 1.15 1.21 2.76 1.93 4.41 2.02v3.62c-1.68-.03-3.32-.57-4.68-1.57-.18-.13-.34-.28-.5-.43v6.33c.03 2.87-1.4 5.63-3.89 7.07-2.73 1.63-6.29 1.41-8.79-.54-2.58-1.95-3.64-5.39-2.54-8.5 1.01-2.99 3.94-5.07 7.13-5.05.12 0 .24 0 .36.01v3.74c-1.3-.12-2.6.43-3.41 1.45-.96 1.16-1.12 2.84-.41 4.17.67 1.34 2.14 2.13 3.64 1.94 1.52-.14 2.76-1.34 2.96-2.85.04-.31.05-.62.05-.93V.02z" />
                    </svg>
                  </SocialIcon>

                  {/* LinkedIn */}
                  <SocialIcon bgColor="#0A66C2" href="https://linkedin.com">
                    <Linkedin
                      size={18}
                      color="#ffffff"
                      fill="#ffffff"
                      className="stroke-[1]"
                    />
                  </SocialIcon>

                  {/* Facebook Group */}
                  <SocialIcon
                    bgColor="#1877F2"
                    href="https://facebook.com/groups"
                  >
                    <Users size={18} color="#ffffff" className="stroke-[2]" />
                  </SocialIcon>

                  {/* WhatsApp */}
                  <SocialIcon bgColor="#25D366" href="https://wa.me/yournumber">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#ffffff">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.66.986 3.292 1.481 4.757 1.482 5.327 0 9.663-4.329 9.665-9.645.001-2.577-1.002-5.001-2.822-6.822-1.82-1.82-4.244-2.822-6.824-2.823-5.332 0-9.669 4.33-9.672 9.648-.001 1.55.422 3.064 1.223 4.385l-.973 3.553 3.646-.956zM17.41 14.39c-.314-.157-1.857-.916-2.143-1.02-.287-.104-.496-.157-.704.157-.208.313-.807 1.02-1.01 1.25-.202.23-.404.26-.718.103-1.385-.694-2.43-1.226-3.394-2.875-.253-.432.253-.4.723-1.343.078-.157.039-.294-.02-.41-.058-.117-.496-1.196-.679-1.64-.179-.43-.362-.372-.496-.372l-.423-.008c-.147 0-.387.055-.589.274-.202.219-.77.752-.77 1.833 0 1.08.788 2.124.898 2.274.11.15 1.55 2.366 3.753 3.32.524.227.933.363 1.253.465.527.168 1.006.144 1.384.088.422-.062 1.857-.76 2.119-1.458.262-.697.262-1.294.183-1.42-.078-.125-.287-.203-.6-.36z" />
                    </svg>
                  </SocialIcon>
                </div>

                {/* Row 2: Remaining icons */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                  {/* Pinterest */}
                  <SocialIcon bgColor="#BD081C" href="https://pinterest.com">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#ffffff">
                      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.091.377-.293 1.194-.332 1.358-.052.211-.174.256-.401.151-1.495-.696-2.43-2.882-2.43-4.636 0-3.774 2.743-7.24 7.907-7.24 4.152 0 7.379 2.959 7.379 6.913 0 4.123-2.599 7.44-6.207 7.44-1.212 0-2.35-.63-2.74-1.373l-.748 2.848c-.27 1.039-1.001 2.342-1.488 3.132C10.166 23.889 11.066 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                    </svg>
                  </SocialIcon>

                  {/* Google News */}
                  <SocialIcon bgColor="#4285F4" href="https://news.google.com">
                    <Newspaper
                      size={18}
                      color="#ffffff"
                      className="stroke-[2]"
                    />
                  </SocialIcon>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}

      {/* ════════════════════════════════════════════════
        আরও — ALL CATEGORIES OVERLAY
        ════════════════════════════════════════════════ */}
      {mounted && isMoreOpen
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto">
              <div
                onClick={() => setIsMoreOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
              />
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 bg-white border border-gray-200 rounded-2xl p-8 pt-10 shadow-2xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-75 slide-in-from-bottom-4 duration-300 ease-out"
              >
                <button
                  onClick={() => setIsMoreOpen(false)}
                  className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>

                <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">
                  সকল বিভাগ
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {loadedCategories
                    .filter((category, index, self) => {
                      const title = category.titleBn || category.title;
                      return (
                        self.findIndex(
                          (c) => (c.titleBn || c.title) === title,
                        ) === index
                      );
                    })
                    .map((category) => (
                      <Link
                        key={category.id}
                        href={`/${category.slug}`}
                        onClick={() => setIsMoreOpen(false)}
                        className="flex flex-col p-3 rounded-lg border border-gray-100 hover:border-red-100 hover:bg-red-50/30 transition-all duration-200 group"
                      >
                        <span className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                          {category.titleBn || category.title}
                        </span>
                        {(category as Category).subCategories?.length > 0 && (
                          <span className="text-xs text-gray-400 mt-1">
                            {(category as Category).subCategories!.length} টি
                            উপবিভাগ
                          </span>
                        )}
                      </Link>
                    ))}
                </div>

                {/* Load More button — only shown when more categories are available */}
                {hasMoreCategories && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={loadMoreCategories}
                      disabled={isLoadingMoreCats}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-semibold rounded-lg transition-all duration-200 active:scale-[0.97]"
                    >
                      {isLoadingMoreCats ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          লোড হচ্ছে...
                        </>
                      ) : (
                        <>
                          <span>আরও বিভাগ লোড করুন</span>
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
