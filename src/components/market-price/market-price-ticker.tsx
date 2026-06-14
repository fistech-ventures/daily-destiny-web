"use client";

import { ArrowRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MarketPrice } from "@/lib/types";


export default function MarketPriceWidget({
  marketPricing,
}: {
  marketPricing: MarketPrice[];
}) {
  const [index, setIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Mark as ready after first client render
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!marketPricing || marketPricing.length === 0) return;
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % marketPricing.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [marketPricing]);

  const currentItem = marketPricing?.[index];

  // SSR or not yet hydrated — show nothing to avoid flicker
  if (!isReady) return null;

  return (
    <div className="flex items-center h-full w-full p-3 border-x border-gray-100 bg-gray-50/50 select-none">
      <div className="relative overflow-hidden w-full h-full flex items-center">
        {marketPricing && marketPricing.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 h-full"
            >
              {/* Image Box */}
              <div className="w-10 h-8 shrink-0 flex items-center justify-center overflow-hidden bg-white border border-gray-100 rounded">
                <img
                  src={
                    currentItem?.image || "https://placehold.co/48x40?text=ERR"
                  }
                  alt={currentItem?.titleBn || currentItem?.title || ""}
                  className="object-contain w-full h-full"
                  onError={e => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/48x40?text=ERR";
                  }}
                />
              </div>

              {/* Details */}
              <div className="flex flex-col justify-center min-w-[75px]">
                <div className="flex items-center gap-1">
                  <span className="w-[3px] h-3 bg-[#C91F26] rounded-xs block shrink-0" />
                  <h3 className="text-xs font-bold text-gray-800 leading-none">
                    {currentItem?.titleBn || currentItem?.title || ""}
                  </h3>
                </div>
                <p className="text-xs font-black text-[#1e3a8a] mt-0.5 leading-none">
                  {currentItem?.priceRange || ""}
                </p>
              </div>

              {/* Arrow */}
              <Link
                href="/pricing"
                className="flex items-center justify-center p-1 rounded-full text-gray-400 hover:text-[#C91F26] transition-colors ml-1 shrink-0"
              >
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex items-center gap-2 h-full animate-pulse w-full">
            <div className="w-10 h-8 bg-gray-200 rounded" />
            <div className="flex-1 space-y-1">
              <div className="h-2 bg-gray-200 rounded w-16" />
              <div className="h-2 bg-gray-200 rounded w-12" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

