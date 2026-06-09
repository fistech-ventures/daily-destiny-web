"use client";

import React from "react";
import PaginatedList from "@/components/shared/paginated-list";
import MarketPriceCard from "@/components/market-price/market-price-card";
import { getMarketPrice } from "@/lib/api";
import { MarketPrice } from "@/lib/types";

interface MarketPriceListClientProps {
  initialData: MarketPrice[];
  initialMeta?: { total: number; page: number; limit: number };
}

export default function MarketPriceListClient({
  initialData,
  initialMeta,
}: MarketPriceListClientProps) {
  const fetchMore = async (page: number) => {
    return getMarketPrice({ page, limit: initialMeta?.limit || 24 });
  };

  return (
    <PaginatedList<MarketPrice>
      initialData={initialData}
      initialMeta={initialMeta}
      fetchData={fetchMore}
      listClassName="w-full grid grid-cols-3 lg:grid-cols-4 gap-10 p-6 bg-background rounded-md"
      noDataMessage="কোনো বাজার দর পাওয়া যায়নি"
      renderItem={(item: MarketPrice, index: number) => (
        <MarketPriceCard key={index} marketPricing={item} />
      )}
    />
  );
}
