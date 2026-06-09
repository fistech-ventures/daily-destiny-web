"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getMarketPrice } from "@/lib/api";
import { MarketPrice } from "@/lib/types";

export default function MarketPriceWidget() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    async function loadPrices() {
      try {
        const response = await getMarketPrice({ page: 1, limit: 10 });
        const data = Array.isArray(response) ? response : response.data || [];
        
        // 🔍 DEBUG LOG: Check your browser inspector console to verify image path names!
        console.log("Market API Response:", data);
        
        setPrices(data);
      } catch (error) {
        console.error("Failed to fetch market prices for widget", error);
      } finally {
        setLoading(false);
      }
    }
    loadPrices();
  }, []);

  // ════════════════════════════════════════════════
  // AUTOMATIC SWAPPING LOGIC (3-SECOND INTERVALS)
  // ════════════════════════════════════════════════
  useEffect(() => {
    if (prices.length <= 1) return;

    const interval = setInterval(() => {
      // 1. Fade out active contents
      setFade(false);

      setTimeout(() => {
        // 2. Advance pointer index behind the curtain
        setCurrentIndex((prevIndex) => (prevIndex + 1) % prices.length);
        // 3. Fade back in
        setFade(true);
      }, 300); // Gives animation time to disappear gracefully

    }, 3000); // ⏱️ Swaps every 3 seconds sharp

    return () => clearInterval(interval);
  }, [prices]);

  if (loading || prices.length === 0) return null;

  const activeItem = prices[currentIndex];

  return (
    <div className="flex items-center h-full gap-3 px-4 border-x border-gray-100 bg-gray-50/50 max-h-12 py-1 select-none">
      
      {/* Product Image Box Container */}
      <div className="w-12 h-10 shrink-0 flex items-center justify-center overflow-hidden">
        <div 
          className={`w-full h-full flex items-center justify-center transition-opacity duration-300 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          {activeItem.image ? (
            <img
              src={activeItem.image}
              alt={activeItem.titleBn || activeItem.title}
              className="w-full h-full object-contain"
              onError={(e) => {
                // Falls back gracefully if your path is broken/unreachable
                (e.target as HTMLImageElement).src = "https://placehold.co/48x40?text=ERR";
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-400 text-[9px] font-bold">
              নমুনা
            </div>
          )}
        </div>
      </div>

      {/* Product Details Section */}
      <div 
        className={`flex flex-col min-w-[85px] transition-all duration-300 ${
          fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
        }`}
      >
        {/* Title row with small red accent indicator block */}
        <div className="flex items-center gap-1">
          <span className="w-[3px] h-3 bg-[#C91F26] rounded-xs block shrink-0" />
          <h3 className="text-xs font-bold text-gray-800 leading-none">
            {activeItem.titleBn || activeItem.title}
          </h3>
        </div>
        {/* Price layout */}
        <p className="text-sm font-black text-[#1e3a8a] mt-1 leading-none">
          {activeItem.priceRange}
        </p>
      </div>

      {/* Mini Link Arrow for Navigation */}
      <Link 
        href="/pricing" 
        className="flex items-center justify-center p-1 rounded-full text-gray-400 hover:text-[#C91F26] hover:bg-gray-100 transition-colors ml-1 shrink-0"
        title="বাজার দর বিস্তারিত"
      >
        <ArrowRight size={14} className="stroke-[2.5]" />
      </Link>
    </div>
  );
}