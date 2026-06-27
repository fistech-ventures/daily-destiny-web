// src/components/feature-banner/FeatureBanner.tsx
// TODO: When the API is ready, restore the `data` prop and remove the
//       hardcoded BANNER_DATA constant below.

import React from "react";
import Link from "next/link";
import Image from "next/image";

// ── Hardcoded data mapped directly to the screenshot ───────────────────────
const BANNER_DATA = {
  hero_title: "ফুটবলের বিশ্ব লড়াই",
  // Note: Hero background image should contain the players banner and the FIFA logo composite
  hero_bg_image: "/images/football-world-cup-banner.jpg",

  articles: [
    {
      id: "1",
      title: "জার্মানিকে হারিয়ে নকআউটে সুযোগ পাওয়ায় ইকুয়েডরে সরকারি ছুটি ঘোষণা",
      image: "/images/ecuador-celebration.jpg",
      href: "/sports/ecuador-holiday",
    },
    {
      id: "2",
      title: "গ্রুপের শেষ ম্যাচে লিওকে বিশ্রাম দেওয়ার ভাবনা স্কালোনির",
      image: "/images/messi-rest-scaloni.jpg",
      href: "/sports/messi-rest-plan",
    },
    {
      id: "3",
      title: "গ্রুপ চ্যাম্পিয়ন হয়েও সাংবাদিকদের প্রশ্নে হতবাক পচেত্তিনো",
      image: "/images/pochettino-press.jpg",
      href: "/sports/pochettino-confused",
    },
    {
      id: "4",
      title: "অনুশীলনে পরিবর্তনের আভাস আর্জেন্টিনা দলে",
      image: "/images/argentina-training.jpg",
      href: "/sports/argentina-training-changes",
    },
  ],
};
// ─────────────────────────────────────────────────────────────────────────────

const FeatureBanner = () => {
  const { hero_title, hero_bg_image, articles } = BANNER_DATA;

  return (
    <section className="w-full bg-[#cbd5e1] p-1 font-sans">
      {/* ── TOP BANNER ── */}
      <div className="relative w-full h-[140px] sm:h-[180px] md:h-[240px] overflow-hidden mb-1">
        <Image
          src={hero_bg_image}
          alt={hero_title}
          fill
          className="object-cover object-center"
          priority
        />
        {/* Screen reader fallback title text */}
        <h1 className="sr-only">{hero_title}</h1>
      </div>

      {/* ── 4-COLUMN BOTTOM GRID ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white p-2">
        {articles.map(article => (
          <Link
            key={article.id}
            href={article.href}
            className="group flex flex-col justify-between"
          >
            <div>
              {/* Image Container */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-200"
                />
              </div>

              {/* News Title */}
              <h4 className="text-[#1e293b] text-xs sm:text-sm font-semibold mt-2 leading-relaxed group-hover:text-blue-700 transition-colors line-clamp-3">
                {article.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeatureBanner;
