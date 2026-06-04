"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchInputProps {
  placeholder?: string;
}

export default function SearchInput({ placeholder }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [value, setValue] = useState(query);

  useEffect(() => {
    setValue(query);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    } else {
      router.push("/search");
    }
  };

  const clearSearch = () => {
    setValue("");
    router.push("/search");
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="relative flex items-center bg-gray-100 rounded-lg overflow-hidden transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white border border-transparent focus-within:border-gray-200 shadow-sm">
        <label htmlFor="search-page-input" className="sr-only">Search</label>
        <Input
          id="search-page-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder || "Search..."}
          className="h-14 border-none bg-transparent pl-4 pr-12 text-lg md:text-xl shadow-none focus-visible:ring-0 placeholder:text-gray-400 font-medium"
        />
        {value && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-4 p-1.5 rounded-full hover:bg-gray-200 text-gray-500 transition-all active:scale-95"
            aria-label="Clear search"
          >
            <X className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        )}
      </div>
    </form>
  );
}
