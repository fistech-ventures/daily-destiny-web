import MarketPriceListClient from "@/components/market-price/market-price-list-client";
import { getMarketPrice } from "@/lib/api";
import { generateHomeMetadata } from "@/lib/metadata";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return generateHomeMetadata({
    path: "/pricing",
    locale,
  });

  console.log(getMarketPrice);
}

export default async function PricingPage() {
  const response = await getMarketPrice({ limit: 24, page: 1 });
  const marketPricingData = response?.data || [];
  const meta = response?.meta;

  return (
    <div>
      <h2 className="lg:text-2xl text-xl font-bold">বাজার দর</h2>
      <div className="my-2">
        <MarketPriceListClient initialData={marketPricingData} initialMeta={meta} />
      </div>
    </div>
  );
}
