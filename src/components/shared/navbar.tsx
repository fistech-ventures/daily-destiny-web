"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Menu, Video, X, Newspaper, Globe, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslations } from "next-intl";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { Category } from "@/lib/types";
import { VideoArticle } from "@/lib/api";

export function Navbar({ categories, videos }: { categories: Category[]; videos: VideoArticle[] }) {
  const tSearch = useTranslations("search");

  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const router = useRouter();
  const pathname = usePathname();
  const isSearchPage = pathname.includes("/search");

  const locales = ["en", "bn"];
  const strippedPathname = locales.reduce(
    (p, locale) =>
      p.startsWith(`/${locale}`) ? p.replace(`/${locale}`, "") || "/" : p,
    pathname,
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* ════════════════════════════════════════════════
          TOP BAR — Logo (left)  |  3 Featured Videos (right)
          ════════════════════════════════════════════════ */}
      <div className="border-b border-gray-200 bg-primary">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 gap-6">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <img
                src="/images/logo.png"
                alt="Logo"
                width={200}
                height={64}
                className="h-12 w-auto object-contain"
              />
            </Link>

            {/* Featured videos — desktop only, pushed to the right */}
            <div className="hidden lg:flex items-center gap-6">
              {videos.map((video) => (
                <Link
                  key={video.id}
                  href={`/video/${video.code}`}
                  className="flex items-center gap-3 group"
                >
                  {/* Thumbnail with red play badge */}
                  <div className="relative shrink-0 w-22 h-14.5 rounded overflow-hidden bg-gray-100">
                    <img
                      src={video.coverImage}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <span className="absolute top-1 left-1 bg-red-600 rounded-sm px-1 py-px flex items-center">
                      <Video className="h-2.5 w-2.5 fill-white stroke-white" />
                    </span>
                  </div>
                  {/* Title */}
                  <p className="text-sm font-medium text-white leading-snug line-clamp-2 w-28 group-hover:text-white/80 transition-colors">
                    {video.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          BOTTOM BAR — Categories (left)  |  Actions (right)
          ════════════════════════════════════════════════ */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Category links — scrollable */}
            <nav className="flex items-center overflow-x-auto scrollbar-none">
              <Link
                href={`/recent`}
                className={cn(
                  "shrink-0 px-3 py-3 text-base font-bold whitespace-nowrap border-b-2 transition-colors",
                  strippedPathname === `/recent`
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-gray-700 hover:text-red-600",
                )}
              >
                সর্বশেষ
              </Link>
              {categories.slice(0, 10).map((category) => (
                <Link
                  key={category.id}
                  href={`/${category.slug}`}
                  className={cn(
                    "shrink-0 px-3 py-3 text-base font-bold whitespace-nowrap border-b-2 transition-colors",
                    strippedPathname === `/${category.slug}`
                      ? "border-red-600 text-red-600"
                      : "border-transparent text-gray-700 hover:text-red-600",
                  )}
                >
                  {category.titleBn || category.title}
                </Link>
              ))}
              <Link
                href={`/video`}
                className={cn(
                  "shrink-0 px-3 py-3 text-base font-bold whitespace-nowrap border-b-2 transition-colors",
                  strippedPathname === `/video`
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-gray-700 hover:text-red-600",
                )}
              >
                ভিডিও
              </Link>
            </nav>

            {/* Right actions */}
            <div className="flex items-center shrink-0 divide-x divide-gray-200">
              {/* Search — desktop inline form */}
              {!isSearchPage && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 group"
                >
                  <Search className="h-4 w-4 text-gray-500 group-focus-within:text-gray-800" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={tSearch("placeholder") || "খুঁজুন"}
                    className="h-7 w-32 border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-gray-500"
                  />
                </form>
              )}

              {/* Search — mobile icon button */}
              <button
                aria-label="Search"
                onClick={() => setIsSearchOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-3 text-sm text-gray-700 hover:text-red-600 transition-colors"
              >
                <Search className="h-4 w-4" />
                <span className="font-medium">খুঁজুন</span>
              </button>

              {/* ই-পেপার */}
              <Link
                href="/epaper"
                className="hidden sm:flex items-center gap-1.5 px-3 py-3 text-sm text-gray-700 hover:text-red-600 transition-colors"
              >
                <Newspaper className="h-4 w-4" />
                <span>ই-পেপার</span>
              </Link>

              {/* Eng */}
              <Link
                href="/en"
                className="hidden sm:flex items-center gap-1.5 px-3 py-3 text-sm text-gray-700 hover:text-red-600 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span>Eng</span>
              </Link>

              {/* Login */}
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1.5 px-3 py-3 text-sm text-gray-700 hover:text-red-600 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>

              {/* Hamburger → Mega Menu */}
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetTrigger
                  aria-label="Open menu"
                  className="flex items-center justify-center px-3 py-3 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </SheetTrigger>

                {/* ── Full-screen mega menu ── */}
                <SheetContent
                  side="top"
                  className="w-full h-screen max-h-screen p-0 overflow-y-auto bg-white"
                >
                  {/* Mega menu header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <Link href="/" onClick={() => setIsSheetOpen(false)}>
                      <img
                        src="/images/logo.png"
                        alt="Logo"
                        className="h-10 w-auto object-contain"
                      />
                    </Link>
                    <button
                      onClick={() => setIsSheetOpen(false)}
                      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                      aria-label="Close menu"
                    >
                      <X className="h-6 w-6" strokeWidth={1.5} />
                    </button>
                  </div>

                  {/* Mega menu body */}
                  <div className="flex flex-col lg:flex-row px-6 py-6 gap-8">
                    {/* LEFT: quick nav + categories + subcategories */}
                    <div className="flex-1 min-w-0">
                      {/* Quick nav row */}
                      <div className="flex flex-wrap gap-x-8 gap-y-2 pb-5 mb-2 border-b border-gray-200">
                        {[
                          { label: "প্রচ্ছদ", href: "/" },
                          { label: "সর্বশেষ", href: "/recent" },
                          { label: "বিশেষ সংবাদ", href: "/special" },
                          { label: "রাজনীতি", href: "/politics" },
                          { label: "রস+আলো", href: "/ros-alo" },
                          { label: "ছবি", href: "/photo" },
                          { label: "ভিডিও", href: "/video" },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsSheetOpen(false)}
                            className="text-[15px] font-bold text-gray-900 hover:text-red-600 transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      {/* Category rows */}
                      <div className="divide-y divide-gray-100">
                        {categories.map((category) => (
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
                              {(category as Category).subCategories?.length >
                                0 && (
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
                      {/* Login + Search */}
                      <div className="flex gap-3">
                        <Link
                          href="/login"
                          onClick={() => setIsSheetOpen(false)}
                          className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded px-4 py-2 text-sm font-medium text-gray-700 hover:border-red-500 hover:text-red-600 transition-colors"
                        >
                          <User className="h-4 w-4" />
                          Login
                        </Link>
                        <button
                          onClick={() => {
                            setIsSheetOpen(false);
                            setIsSearchOpen(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded px-4 py-2 text-sm font-medium text-gray-700 hover:border-red-500 hover:text-red-600 transition-colors"
                        >
                          <Search className="h-4 w-4" />
                          খুঁজুন
                        </button>
                      </div>

                      {/* Social */}
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-3">
                          অনুসরণ করুন
                        </p>
                        <div className="flex gap-2">
                          {[
                            {
                              label: "Facebook",
                              href: "https://facebook.com",
                              bg: "bg-blue-600",
                              icon: "f",
                            },
                            {
                              label: "X",
                              href: "https://x.com",
                              bg: "bg-black",
                              icon: "𝕏",
                            },
                            {
                              label: "Instagram",
                              href: "https://instagram.com",
                              bg: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600",
                              icon: "◈",
                            },
                            {
                              label: "YouTube",
                              href: "https://youtube.com",
                              bg: "bg-red-600",
                              icon: "▶",
                            },
                            {
                              label: "News",
                              href: "#",
                              bg: "bg-blue-400",
                              icon: "N",
                            },
                          ].map((s) => (
                            <a
                              key={s.label}
                              href={s.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={s.label}
                              className={`${s.bg} text-white w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold hover:opacity-80 transition-opacity`}
                            >
                              {s.icon}
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* App download */}
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-3">
                          মোবাইল অ্যাপস ডাউনলোড করুন
                        </p>
                        <div className="flex flex-col gap-2">
                          <a
                            href="https://play.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 border border-gray-300 rounded px-4 py-2 hover:border-gray-500 transition-colors"
                          >
                            <span className="text-xl">▶</span>
                            <div className="leading-tight">
                              <p className="text-[10px] text-gray-500">
                                GET IT ON
                              </p>
                              <p className="text-sm font-semibold text-gray-800">
                                Google Play
                              </p>
                            </div>
                          </a>
                          <a
                            href="https://apps.apple.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 border border-gray-300 rounded px-4 py-2 hover:border-gray-500 transition-colors"
                          >
                            <span className="text-xl"></span>
                            <div className="leading-tight">
                              <p className="text-[10px] text-gray-500">
                                Download on the
                              </p>
                              <p className="text-sm font-semibold text-gray-800">
                                App Store
                              </p>
                            </div>
                          </a>
                        </div>
                      </div>

                      {/* Footer links */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-3 border-t border-gray-100">
                        {[
                          "আমাদের সম্পর্কে",
                          "বিজ্ঞাপন",
                          "সার্কুলেশন",
                          "নীতি ও শর্ত",
                          "যোগাযোগ",
                          "নিউজলেটার",
                        ].map((l) => (
                          <Link
                            key={l}
                            href="#"
                            onClick={() => setIsSheetOpen(false)}
                            className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                          >
                            • {l}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          MOBILE SEARCH OVERLAY
          ════════════════════════════════════════════════ */}
      {isSearchOpen && (
        <div className="absolute inset-x-0 top-0 z-50 flex items-center bg-white h-14 px-4 border-b border-gray-200 shadow">
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full items-center gap-2"
          >
            <Search className="h-5 w-5 text-gray-400 shrink-0" />
            <Input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tSearch("placeholder") || "যা খুঁজতে চান.."}
              className="flex-1 border-none bg-transparent p-0 text-base shadow-none focus-visible:ring-0 text-gray-800 placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="shrink-0 p-1 text-gray-500 hover:text-gray-900"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
