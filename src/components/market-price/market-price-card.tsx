import { MarketPrice } from "@/lib/types";
import React from "react";

export default function MarketPriceCard({
  marketPricing,
}: {
  marketPricing: MarketPrice;
}) {
  return (
    <div className="flex flex-col justify-center items-center gap-y-2 w-full">
      <img
        src={marketPricing?.image}
        alt={marketPricing?.title}
        className="w-24 lg:w-28 aspect-square rounded-full object-contain"
      />
      <h2 className="text-sm md:text-base font-semibold">
        {marketPricing?.title}
      </h2>
      <p className="text-sm md:text-base text-gray-600">
        {marketPricing?.priceRange}
      </p>
    </div>
  );
}
