"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { getArticles } from "@/lib/api";
import { Article } from "@/lib/types";
import { getArticleCategory } from "@/lib/utils";
import { useTranslations } from "next-intl";

/**
 * Navbar search: a standalone client component rendered inside the navbar
 * between the category links and the market widget.
 *
 * - Desktop: inline input with a debounced suggestion dropdown of matching
 *   article titles (thumbnail + bold title).
 * - Mobile: a search icon that opens a full-width overlay with the same input.
 * - Submitting navigates to the existing /search?q= page.
 */
export default function NavbarSearch() {
  const router = useRouter();
  const t = useTranslations("search");

  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<Article[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced fetch of matching article titles.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = value.trim();
    if (!q) {
      setSuggestions([]);
      setDropdownOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await getArticles({ searchTerm: q, limit: 5 });
        const list = Array.isArray(res?.data) ? res.data : [];
        setSuggestions(list);
        setDropdownOpen(true);
      } catch {
        setSuggestions([]);
        setDropdownOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  // Close dropdown on outside click / Escape.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      const inside =
        (desktopRef.current && desktopRef.current.contains(target)) ||
        (mobileRef.current && mobileRef.current.contains(target));
      if (!inside) setDropdownOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setDropdownOpen(false);
    setMobileOpen(false);
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  const goToArticle = (article: Article) => {
    setDropdownOpen(false);
    setMobileOpen(false);
    const slug = getArticleCategory(article)?.slug || "uncategorized";
    router.push(`/news/${slug}/${article.code}`);
  };

  const dropdown = (
    <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
      {loading ? (
        <div className="px-4 py-3 text-sm text-gray-500">Searching…</div>
      ) : suggestions.length > 0 ? (
        <ul className="max-h-96 overflow-y-auto divide-y divide-gray-100">
          {suggestions.map((article) => (
            <li key={article.id}>
              <button
                type="button"
                onClick={() => goToArticle(article)}
                className="group w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-primary hover:text-white transition-colors"
              >
                <div className="relative w-16 h-12 shrink-0 overflow-hidden rounded bg-gray-100">
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <span
                  className="text-sm font-semibold text-gray-800 group-hover:text-white leading-snug"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {article.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="px-4 py-3 text-sm text-gray-500">{t("noResults")}</div>
      )}
    </div>
  );

  const input = (
    <form
      onSubmit={submit}
      role="search"
      className="relative flex items-center bg-gray-100 rounded-lg border border-transparent focus-within:border-gray-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm"
    >
      <Search className="h-3.5 w-3.5 text-gray-400 ml-2.5 shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("placeholder")}
        aria-label={t("placeholder")}
        className="w-full bg-transparent px-1.5 py-1.5 text-sm outline-none placeholder:text-gray-400"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="mr-2 p-1 rounded-full hover:bg-primary hover:text-white text-gray-500 transition-all"
          aria-label="Clear search"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </form>
  );

  return (
    <>
      {/* Desktop: inline input + suggestions */}
      <div ref={desktopRef} className="hidden md:block shrink-0 px-2">
        <div className="relative w-40 lg:w-52">
          {input}
          {dropdownOpen && dropdown}
        </div>
      </div>

      {/* Mobile: search icon → full-width overlay */}
      <div className="md:hidden flex items-center">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center px-3 py-3 text-gray-700 hover:text-primary/80 transition-colors"
          aria-label={t("placeholder")}
        >
          <Search className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[90]">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative bg-white shadow-2xl px-4 py-3 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <div ref={mobileRef} className="flex-1">
                <div className="relative">
                  {input}
                  {dropdownOpen && dropdown}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="shrink-0 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
