"use client";

import React, { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { MobileBottomNav } from "@/components/shared/mobile-bottom-nav";
import { usePathname } from "next/navigation";
import { Category, MarketPrice } from "@/lib/types";
import AdBanner from "@/components/shared/ad-banner";

import { VideoArticle } from "@/lib/api";
import ShareMarket from "@/components/shared/share-market";

interface AppProviderProps {
  children: React.ReactNode;
  categories: Category[];
  headlines: { title: string; code: string; category: string }[];
  videos: VideoArticle[];
  marketPrices?: MarketPrice[];
}

export default function AppProvider({
  children,
  categories,
  headlines,
  videos,
  marketPrices = [],
}: AppProviderProps) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
    [],
  );

  const pathname = usePathname();

  const isSearchPage = pathname.includes("/search");

  return (
    <QueryClientProvider client={queryClient}>
      {/* <Navbar categories={categories} videos={videos} headlines={headlines} /> */}
      {/* <Headline headlines={headlines} /> */}

      <Navbar
        categories={categories}
        videos={videos}
        headlines={headlines}
        marketPrices={marketPrices}
      />
      <ShareMarket />

      <div className="md:pb-0 pb-16">
        {isSearchPage ? (
          <main>{children}</main>
        ) : (
          <div className="container mx-auto lg:py-1">
            <main>{children}</main>
          </div>
        )}
      </div>
      {/* Footer Advertisement Section */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <AdBanner className="rounded-lg" altText="ফুটার বিজ্ঞাপন" />
        </div>
      </div>
      <Footer />

      <MobileBottomNav />
    </QueryClientProvider>
  );
}
