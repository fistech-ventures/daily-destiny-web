"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Newspaper } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavbarSocialLinks } from "./navbar-social-links";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Category, MarketPrice } from "@/lib/types";
import { VideoArticle } from "@/lib/api";
import { getMarketPrice } from "@/lib/api";
import Headline from "./headline";
import MarketPriceWidget from "../market-price/market-price-ticker";

export function Navbar({
  categories,
  headlines = [],
  marketPrices: initialMarketPrices = [],
}: {
  categories: Category[];
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

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full bg-white shadow-sm transition-transform duration-300 ease-in-out",
          hideNavbar ? "-translate-y-full md:translate-y-0" : "translate-y-0",
        )}
      >
        {/* ════════════════════════════════════════════════
          TOP BAR — Logo (Left) | Social Icons (Right)
          ════════════════════════════════════════════════ */}
        <div className="border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-2.5">
              {/* Logo Container placed exactly like 'আমার দেশ' in image_c17a08.png */}
              <Link href="/" className="shrink-0 flex flex-col items-center">
                <img
                  src="/images/logoblack.png"
                  alt="Logo"
                  width={200}
                  height={64}
                  className="h-11 w-auto object-contain"
                />
              </Link>

              {/* Social Icons — Exact Serial Matching */}
              <NavbarSocialLinks
                isPopupOpen={isPopupOpen}
                setIsPopupOpen={setIsPopupOpen}
                variant="navbar"
              />
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
                  href={`/recent`}
                  className={cn(
                    "shrink-0 px-3 flex items-center h-full text-base font-bold whitespace-nowrap border-b-2 transition-colors",
                    strippedPathname === `/recent`
                      ? "border-red-600 text-primary"
                      : "border-transparent text-gray-700 hover:text-primary/80",
                  )}
                >
                  সর্বশেষ
                </Link>

                {/* Filter out duplicates dynamically by title text */}
                {/* {categories
                  .slice(0, 10)
                  .filter((category, index, self) => {
                    const title = category.titleBn || category.title;
                    return self.findIndex(c => (c.titleBn || c.title) === title) === index;
                  })
                  .map((category) => (
                    <Link
                      key={category.id}
                      href={`/${category.slug}`}
                      className={cn(
                        "shrink-0 px-3 flex items-center h-full text-base font-bold whitespace-nowrap border-b-2 transition-colors",
                        strippedPathname === `/${category.slug}`
                          ? "border-red-600 text-red-600"
                          : "border-transparent text-gray-700 hover:text-red-600",
                      )}
                    >
                      {category.titleBn || category.title}
                      
                    </Link>
                  ))} */}

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
                    <div
                      key={category.id}
                      className="shrink-0 h-full"
                      onMouseEnter={() => {
                        if (closeTimeoutRef.current)
                          clearTimeout(closeTimeoutRef.current);
                        if ((category as Category).subCategories?.length > 0) {
                          setOpenDropdownId(category.id);
                        }
                      }}
                      onMouseLeave={() => {
                        if ((category as Category).subCategories?.length > 0) {
                          closeTimeoutRef.current = setTimeout(() => {
                            setOpenDropdownId(null);
                          }, 150);
                        }
                      }}
                    >
                      <Link
                        href={`/${category.slug}`}
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          // On touch devices, toggle dropdown instead of navigating
                          try {
                            if (
                              (category as Category).subCategories?.length >
                                0 &&
                              typeof window !== "undefined" &&
                              window.matchMedia &&
                              window.matchMedia("(hover: none)").matches
                            ) {
                              e.preventDefault();
                              if (closeTimeoutRef.current)
                                clearTimeout(closeTimeoutRef.current);
                              setOpenDropdownId((prev) =>
                                prev === category.id ? null : category.id,
                              );
                            }
                          } catch {
                            // ignore
                          }
                        }}
                        className={cn(
                          "px-3 flex items-center h-full text-base font-bold whitespace-nowrap border-b-2 transition-colors",
                          strippedPathname === `/${category.slug}`
                            ? "border-red-600 text-red-600"
                            : "border-transparent text-gray-700 hover:text-red-600",
                        )}
                        aria-haspopup={
                          (category as Category).subCategories?.length > 0
                            ? "menu"
                            : undefined
                        }
                        aria-expanded={openDropdownId === category.id}
                      >
                        {category.titleBn || category.title}

                        {(category as Category).subCategories?.length > 0 && (
                          <span className="ml-1 text-xs">▼</span>
                        )}
                      </Link>
                    </div>
                  ))}

                <Link
                  href={`/video`}
                  className={cn(
                    "shrink-0 px-3 flex items-center h-full text-base font-bold whitespace-nowrap border-b-2 transition-colors",
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
                  href="/e-paper"
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
                      <div className="">
                        <Link
                          href="/e-paper"
                          className="flex items-center gap-1.5 px-3 py-3 text-sm text-gray-700 hover:text-primary/80 transition-colors"
                        >
                          <Newspaper className="h-4 w-4" />
                          <span>ই-পেপার</span>
                        </Link>
                      </div>
                    </div>

                    {/* Mega menu body */}
                    <div className="flex flex-col lg:flex-row px-6 py-8 gap-8">
                      <div className="">
                        <div className=" flex h-full justify-end items-center">
                          <MarketPriceWidget marketPricing={marketPrices} />
                        </div>
                      </div>
                      {/* LEFT: quick nav + categories + subcategories */}
                      <div className="flex-1 min-w-0">
                        {/* Quick nav row */}
                        <div className="flex flex-wrap gap-x-8 gap-y-2 pb-5 mb-2 border-b border-gray-200">
                          {[
                            { label: "প্রচ্ছদ", href: "/" },
                            { label: "সর্বশেষ", href: "/recent" },
                            { label: "বিশেষ সংবাদ", href: "/special" },
                            { label: "রাজনীতি", href: "/politics" },
                            { label: "ছবি", href: "/photo" },
                            { label: "ভিডিও", href: "/video" },
                            // { label: "ই-পেপার", href: "/e-paper" },
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsSheetOpen(false)}
                              className="text-[15px] font-bold text-gray-900 hover:text-primary transition-colors"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>

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
                            ))}
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
                        <Link href="/e-paper">
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
    </>
  );
}
