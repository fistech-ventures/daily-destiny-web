import React from "react";
import Trending from "./trending";
import BazarPricing from "./bazar-pricing";
import LiveUpdate from "./live-update";
import { getMarketPrice, getTrendingTopics } from "@/lib/api";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NewsSidebar() {
  const trendingRes = await getTrendingTopics();
  const trendingTopics = trendingRes?.data || [];
  const marketPricingRes = await getMarketPrice();
  const marketPricing = marketPricingRes?.data || [];
  const tArticle = await getTranslations("article");

  return (
    <div className="space-y-4 w-full">
      {/* Trending Topics */}
      <div className="bg-primary/5 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg text-primary">
            {tArticle("trending")}
          </h3>
        </div>
        <Trending trendingTopics={trendingTopics} />
      </div>

      {/* Market Pricing */}
      <BazarPricing marketPricing={marketPricing} />

      {/* Live Updates */}
      <LiveUpdate />

      {/* Quick Links */}
      <div className="bg-background rounded-lg p-4 border">
        <h3 className="font-bold text-lg mb-3 border-l-4 border-primary pl-3">
          কুইক লিংক
        </h3>
        <div className="space-y-2">
          <Link
            href="/video"
            className="flex items-center justify-between p-2 hover:bg-accent rounded transition-colors"
          >
            <span className="text-sm font-medium">ভিডিও</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/gallery"
            className="flex items-center justify-between p-2 hover:bg-accent rounded transition-colors"
          >
            <span className="text-sm font-medium">গ্যালারি</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/pricing"
            className="flex items-center justify-between p-2 hover:bg-accent rounded transition-colors"
          >
            <span className="text-sm font-medium">বাজার দর</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-background rounded-lg p-4 border">
        <h3 className="font-bold text-lg mb-3 border-l-4 border-primary pl-3">
          সোশ্যাল মিডিয়া
        </h3>
        <div className="flex gap-2">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-600 text-white text-center py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Facebook
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-sky-500 text-white text-center py-2 rounded text-sm font-medium hover:bg-sky-600 transition-colors"
          >
            Twitter
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-red-600 text-white text-center py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors"
          >
            YouTube
          </a>
        </div>
      </div>
    </div>
  );
}
