"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketPrice } from "@/lib/types";

// 🌟 Ekhon eta page ba layout theke direct data nibe
export default function MarketPriceWidget({ 
  marketPrices 
}: { 
  marketPrices: MarketPrice[] 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // ⏱️ 3-Second interval swapping loop
  useEffect(() => {
    if (!marketPrices || marketPrices.length <= 1) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % marketPrices.length);
        setFade(true);
      }, 300);
    }, 3000); 

    return () => clearInterval(interval);
  }, [marketPrices]);

  if (!marketPrices || marketPrices.length === 0) return null;

  const activeItem = marketPrices[currentIndex];

  return (
    <div className="flex items-center h-full gap-2.5 px-4 bg-gray-50/40 select-none border-r border-gray-200">
      {/* Product Image Box */}
      <div className="w-10 h-8 shrink-0 flex items-center justify-center overflow-hidden">
        <div className={`w-full h-full flex items-center justify-center transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}>
          {activeItem.image ? (
            <img
              src={activeItem.image}
              alt={activeItem.titleBn || activeItem.title}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-gray-300 text-[9px]">
              নমুনা
            </div>
          )}
        </div>
      </div>

      {/* Product Details Section */}
      <div className={`flex flex-col min-w-[75px] transition-all duration-300 ${fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-0.5"}`}>
        <div className="flex items-center gap-1">
          <span className="w-[3px] h-3 bg-[#C91F26] rounded-xs block shrink-0" />
          <h3 className="text-xs font-bold text-gray-800 leading-none">
            {activeItem.titleBn || activeItem.title}
          </h3>
        </div>
        <p className="text-xs font-black text-[#1e3a8a] mt-0.5 leading-none">
          {activeItem.priceRange}
        </p>
      </div>

      {/* Detail Navigate Arrow Icon */}
      <Link 
        href="/pricing" 
        className="flex items-center justify-center p-0.5 rounded-full text-gray-400 hover:text-[#C91F26] transition-colors ml-0.5 shrink-0"
      >
        <ArrowRight size={13} className="stroke-[2.5]" />
      </Link>
    </div>
  );
}