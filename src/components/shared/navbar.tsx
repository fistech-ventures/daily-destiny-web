"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Menu,
  X,
  Newspaper,
  Globe,
  User,
  Users,
  Facebook,
  Youtube,
  Instagram,
  Linkedin,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
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
import SocialIcon from "./SocialIcon";
import Headline from "./headline";

export function Navbar({
  categories,
  videos,
  headlines = [],
}: {
  categories: Category[];
  videos: VideoArticle[];
  headlines?: { title: string; code: string; category: string }[];
}) {
  const tSearch = useTranslations("search");

  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const router = useRouter();
  const pathname = usePathname();
  const isSearchPage = pathname.includes("/search");

  const [isPopupOpen, setIsPopupOpen] = React.useState(false);

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

            {/* Social Icons — Exact Serial Matching image_c17a08.png */}
            <div className="relative flex items-center gap-1.5 md:gap-2.5">
              {/* ════════════════════════════════════════════════
                  ১. মোস্ট ইম্পর্ট্যান্ট ৩টি আইকন (মোবাইল ও ডেস্কটপ সবখানেই দেখাবে)
                  ════════════════════════════════════════════════ */}

              {/* Facebook */}
              <SocialIcon bgColor="#1877F2" href="https://www.facebook.com/DailyDestinyBD">
                <Facebook
                  size={16}
                  color="#ffffff"
                  fill="#ffffff"
                  className="stroke-[1] md:h-[18px] md:w-[18px]"
                /> 
              </SocialIcon>

              {/* YouTube */}
              <SocialIcon bgColor="#FF0000" href="https://www.youtube.com/@DailyDestinyBD">
                <Youtube
                  size={16}
                  color="#FF0000"
                  fill="#ffffff"
                  className="stroke-[1] md:h-[18px] md:w-[18px]"
                />
              </SocialIcon>

              {/* LinkedIn */}
              <SocialIcon bgColor="#0A66C2" href="https://linkedin.com">
                <Linkedin
                  size={16}
                  color="#ffffff"
                  fill="#ffffff"
                  className="stroke-[1] md:h-[18px] md:w-[18px]"
                />
              </SocialIcon>

              {/* ════════════════════════════════════════════════
                  ২. বাকি আইকনগুলো (মোবাইলে হাইড থাকবে, শুধু md স্ক্রিন থেকে দেখাবে)
                  ════════════════════════════════════════════════ 
                */}

              {/* Facebook Group */}
              <div className="hidden md:block">
                <SocialIcon
                  bgColor="#1877F2"
                  href="https://facebook.com/groups"
                >
                  <Users
                    size={16}
                    color="#ffffff"
                    className="stroke-[2] md:h-[18px] md:w-[18px]"
                  />
                </SocialIcon>
              </div>

              {/* TikTok */}
              <div className="hidden md:block">
                <SocialIcon bgColor="#000000" href="https://tiktok.com">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 md:h-4 md:w-4"
                    fill="#ffffff"
                  >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.61 4.18 1.15 1.21 2.76 1.93 4.41 2.02v3.62c-1.68-.03-3.32-.57-4.68-1.57-.18-.13-.34-.28-.5-.43v6.33c.03 2.87-1.4 5.63-3.89 7.07-2.73 1.63-6.29 1.41-8.79-.54-2.58-1.95-3.64-5.39-2.54-8.5 1.01-2.99 3.94-5.07 7.13-5.05.12 0 .24 0 .36.01v3.74c-1.3-.12-2.6.43-3.41 1.45-.96 1.16-1.12 2.84-.41 4.17.67 1.34 2.14 2.13 3.64 1.94 1.52-.14 2.76-1.34 2.96-2.85.04-.31.05-.62.05-.93V.02z" />
                  </svg>
                </SocialIcon>
              </div>

              {/* WhatsApp */}
              <div className="hidden md:block">
                <SocialIcon bgColor="#25D366" href="https://wa.me/yournumber">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 md:h-[18px] md:w-[18px]"
                    fill="#ffffff"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.66.986 3.292 1.481 4.757 1.482 5.327 0 9.663-4.329 9.665-9.645.001-2.577-1.002-5.001-2.822-6.822-1.82-1.82-4.244-2.822-6.824-2.823-5.332 0-9.669 4.33-9.672 9.648-.001 1.55.422 3.064 1.223 4.385l-.973 3.553 3.646-.956zM17.41 14.39c-.314-.157-1.857-.916-2.143-1.02-.287-.104-.496-.157-.704.157-.208.313-.807 1.02-1.01 1.25-.202.23-.404.26-.718.103-1.385-.694-2.43-1.226-3.394-2.875-.253-.432.253-.4.723-1.343.078-.157.039-.294-.02-.41-.058-.117-.496-1.196-.679-1.64-.179-.43-.362-.372-.496-.372l-.423-.008c-.147 0-.387.055-.589.274-.202.219-.77.752-.77 1.833 0 1.08.788 2.124.898 2.274.11.15 1.55 2.366 3.753 3.32.524.227.933.363 1.253.465.527.168 1.006.144 1.384.088.422-.062 1.857-.76 2.119-1.458.262-.697.262-1.294.183-1.42-.078-.125-.287-.203-.6-.36z" />
                  </svg>
                </SocialIcon>
              </div>

              {/* Pinterest */}
              <div className="hidden lg:block">
                <SocialIcon bgColor="#BD081C" href="https://pinterest.com">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 md:h-4 md:w-4"
                    fill="#ffffff"
                  >
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.091.377-.293 1.194-.332 1.358-.052.211-.174.256-.401.151-1.495-.696-2.43-2.882-2.43-4.636 0-3.774 2.743-7.24 7.907-7.24 4.152 0 7.379 2.959 7.379 6.913 0 4.123-2.599 7.44-6.207 7.44-1.212 0-2.35-.63-2.74-1.373l-.748 2.848c-.27 1.039-1.001 2.342-1.488 3.132C10.166 23.889 11.066 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                </SocialIcon>
              </div>

              {/* Instagram */}
              <div className="hidden md:block">
                <SocialIcon bgColor="#E1306C" href="https://instagram.com">
                  <Instagram
                    size={16}
                    color="#ffffff"
                    className="stroke-[2] md:h-[18px] md:w-[18px]"
                  />
                </SocialIcon>
              </div>

              {/* Google News */}
              <div className="hidden md:block">
                <SocialIcon bgColor="#4285F4" href="https://news.google.com">
                  <Newspaper
                    size={16}
                    color="#ffffff"
                    className="stroke-[2] md:h-[18px] md:w-[18px]"
                  />
                </SocialIcon>
              </div>

                {/* ════════════════════════════════════════════════
                  ৩. "More" রাউন্ড বাটন (শুধু মোবাইলে দেখাবে, md স্ক্রিনে হাইড হবে)
                  ════════════════════════════════════════════════ */}
              <button
                onClick={() => setIsPopupOpen(!isPopupOpen)}
                className="md:hidden w-9 h-9 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-transform active:scale-95 text-white shadow-sm"
                aria-label="Show more social links"
              >
                {isPopupOpen ? <X size={18} /> : <MoreHorizontal size={18} />}
              </button>

              {/* ════════════════════════════════════════════════
                ৪. মোবাইল পপ-আপ ওভারলে মেনু (বাকি আইকনগুলোর জন্য)
                ════════════════════════════════════════════════ */}
              {isPopupOpen && (
                <>
                  {/* ব্যাকড্রপ ক্লিক করলে পপ-আপ বন্ধ হবে */}
                  <div
                    className="fixed inset-0 z-40 md:hidden"
                    onClick={() => setIsPopupOpen(false)}
                  />

                  {/* ছোট পপ-আপ বক্স */}
                  <div className="absolute right-0 top-50 z-50 md:hidden bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl p-3 shadow-xl flex items-center gap-3 animate-in fade-in zoom-in-95 duration-150">
                    {/* Facebook Group */}
                    <SocialIcon
                      bgColor="#1877F2"
                      href="https://facebook.com/groups"
                    >
                      <Users size={16} color="#ffffff" className="stroke-[2]" />
                    </SocialIcon>

                    {/* TikTok */}
                    <SocialIcon bgColor="#000000" href="https://tiktok.com">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="#ffffff"
                      >
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.61 4.18 1.15 1.21 2.76 1.93 4.41 2.02v3.62c-1.68-.03-3.32-.57-4.68-1.57-.18-.13-.34-.28-.5-.43v6.33c.03 2.87-1.4 5.63-3.89 7.07-2.73 1.63-6.29 1.41-8.79-.54-2.58-1.95-3.64-5.39-2.54-8.5 1.01-2.99 3.94-5.07 7.13-5.05.12 0 .24 0 .36.01v3.74c-1.3-.12-2.6.43-3.41 1.45-.96 1.16-1.12 2.84-.41 4.17.67 1.34 2.14 2.13 3.64 1.94 1.52-.14 2.76-1.34 2.96-2.85.04-.31.05-.62.05-.93V.02z" />
                      </svg>
                    </SocialIcon>

                    {/* WhatsApp */}
                    <SocialIcon
                      bgColor="#25D366"
                      href="https://wa.me/yournumber"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="#ffffff"
                      >
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.66.986 3.292 1.481 4.757 1.482 5.327 0 9.663-4.329 9.665-9.645.001-2.577-1.002-5.001-2.822-6.822-1.82-1.82-4.244-2.822-6.824-2.823-5.332 0-9.669 4.33-9.672 9.648-.001 1.55.422 3.064 1.223 4.385l-.973 3.553 3.646-.956zM17.41 14.39c-.314-.157-1.857-.916-2.143-1.02-.287-.104-.496-.157-.704.157-.208.313-.807 1.02-1.01 1.25-.202.23-.404.26-.718.103-1.385-.694-2.43-1.226-3.394-2.875-.253-.432.253-.4.723-1.343.078-.157.039-.294-.02-.41-.058-.117-.496-1.196-.679-1.64-.179-.43-.362-.372-.496-.372l-.423-.008c-.147 0-.387.055-.589.274-.202.219-.77.752-.77 1.833 0 1.08.788 2.124.898 2.274.11.15 1.55 2.366 3.753 3.32.524.227.933.363 1.253.465.527.168 1.006.144 1.384.088.422-.062 1.857-.76 2.119-1.458.262-.697.262-1.294.183-1.42-.078-.125-.287-.203-.6-.36z" />
                      </svg>
                    </SocialIcon>

                    {/* Pinterest */}
                    <SocialIcon bgColor="#BD081C" href="https://pinterest.com">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="#ffffff"
                      >
                        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.091.377-.293 1.194-.332 1.358-.052.211-.174.256-.401.151-1.495-.696-2.43-2.882-2.43-4.636 0-3.774 2.743-7.24 7.907-7.24 4.152 0 7.379 2.959 7.379 6.913 0 4.123-2.599 7.44-6.207 7.44-1.212 0-2.35-.63-2.74-1.373l-.748 2.848c-.27 1.039-1.001 2.342-1.488 3.132C10.166 23.889 11.066 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                      </svg>
                    </SocialIcon>

                    {/* Instagram */}
                    <SocialIcon bgColor="#E1306C" href="https://instagram.com">
                      <Instagram
                        size={16}
                        color="#ffffff"
                        className="stroke-[2]"
                      />
                    </SocialIcon>

                    {/* Google News */}
                    <SocialIcon
                      bgColor="#4285F4"
                      href="https://news.google.com"
                    >
                      <Newspaper
                        size={16}
                        color="#ffffff"
                        className="stroke-[2]"
                      />
                    </SocialIcon>
                  </div>
                </>
              )}
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
                          { label: "विशेष সংবাদ", href: "/special" },
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
