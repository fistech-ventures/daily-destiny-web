"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Link from "next/link";
import { MarketPrice } from "@/lib/types";

export default function BazarPricing({
  marketPricing,
}: {
  marketPricing: MarketPrice[];
}) {
  const tArticle = useTranslations("article");
  const tCommon = useTranslations("common");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!marketPricing || marketPricing.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % marketPricing.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [marketPricing, marketPricing?.length]);

  if (!marketPricing || marketPricing.length === 0) {
    return (
      <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 lg:space-y-3">
        {/* Header */}
        <div className="flex justify-between items-center border-l-4 border-primary pl-3">
          <h2 className="text-xl font-bold text-gray-800">
            {tArticle("bazarPricing")}
          </h2>
          <Link
            href="/pricing"
            className="flex items-center gap-1 text-primary cursor-pointer hover:underline"
          >
            <span className="text-sm font-medium">{tArticle("more")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="py-8 flex items-center justify-center">
          <p className="text-sm font-medium text-gray-500">{tCommon("noDataAvailable")}</p>
        </div>
      </div>
    );
  }

  const currentItem = marketPricing[index];
  return (
    <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 lg:space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center border-l-4 border-primary pl-3">
        <h2 className="text-xl font-bold text-gray-800">
          {tArticle("bazarPricing")}
        </h2>
        <Link
          href="/pricing"
          className="flex items-center gap-1 text-primary cursor-pointer hover:underline"
        >
          <span className="text-sm font-medium">{tArticle("more")}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Carousel Area */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            {/* img Section */}
            <div className="relative w-24 aspect-square rounded-xl shrink-0 overflow-hidden">
              <img
                src={
                  currentItem?.image || "https://placehold.co/200x200"
                }
                alt={currentItem?.title || ""}
                className="object-contain w-full aspect-square rounded-xl p-2"
              />
            </div>

            {/* Info Section */}
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold text-gray-700">
                {currentItem?.title || ""}{" "}
              </h3>
              <p className="text-base font-bold text-gray-900">
                {currentItem?.priceRange || ""}{" "}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
