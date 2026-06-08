"use client";

import React, { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { MobileBottomNav } from "@/components/shared/mobile-bottom-nav";
import { usePathname } from "next/navigation";
import { Category } from "@/lib/types";
import Headline from "@/components/shared/headline";
import { VideoArticle } from "@/lib/api";

interface AppProviderProps {
  children: React.ReactNode;
  categories: Category[];
  headlines: { title: string; code: string; category: string }[];
  videos: VideoArticle[];
}

export default function AppProvider({
  children,
  categories,
  headlines,
  videos,
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
      <Navbar categories={categories} videos={videos} headlines={headlines} />
      {/* <Headline headlines={headlines} /> */}

      <div className="md:pb-0 pb-16">
        {isSearchPage ? (
          <main>{children}</main>
        ) : (
          <div className="container mx-auto lg:py-8">
            <main>{children}</main>
          </div>
        )}
      </div>

      <Footer />
      <MobileBottomNav />
    </QueryClientProvider>
  );
}
