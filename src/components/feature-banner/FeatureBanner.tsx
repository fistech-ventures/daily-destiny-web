// src/components/feature-banner/FeatureBanner.tsx
// TODO: When the API is ready, restore the `data` prop and remove the
//       hardcoded BANNER_DATA constant below.

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

// ── Hardcoded data — swap with API response when ready ───────────────────────
const BANNER_DATA = {
  hero_title: 'ফুটবলের বিশ্ব লড়াই',
  hero_subtitle: 'FIFA World Cup 2026',
  hero_bg_image:
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1400&q=80',
  section_label: 'বিশ্বকাপ ফুটবল ২০২৬',
  see_all_href: '/worldcup-2026',

  featured_articles: [
    {
      id: '1',
      title: "'কোনো কিছুই অসম্ভব নয়' — আর্জেন্টিনাকে নিয়ে কেপ ভার্দের কোচ",
      image:
        'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80',
      href: '/sports/argentina-cape-verde',
      time: '১ ঘণ্টা আগে',
      category: 'বিশ্বকাপ',
    },
    {
      id: '2',
      title: 'বিশ্বকাপে এই মাইলফলকেও প্রথম ব্রাজিল',
      image:
        'https://images.unsplash.com/photo-1551958219-acbc630e2914?w=600&q=80',
      href: '/sports/brazil-milestone',
      time: '২ ঘণ্টা আগে',
      category: 'বিশ্বকাপ',
    },
  ],

  side_articles: [
    {
      id: '3',
      title: 'যেভাবে এখনো নকআউট পর্বে উঠতে পারে ইরান',
      image:
        'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=300&q=80',
      href: '/sports/iran-knockout-chances',
      time: '৩ ঘণ্টা আগে',
    },
    {
      id: '4',
      title: 'বিশ্বকাপ থেকে বিদায়ের পর কোচের সিদ্ধান্ত নিয়ে মুখ খুললেন উরুগুয়ে অধিনায়ক',
      image:
        'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=300&q=80',
      href: '/sports/uruguay-coach-decision',
      time: '৩ ঘণ্টা আগে',
    },
    {
      id: '5',
      title: 'নকআউটে কে কার মুখোমুখি, দেখে নিন এক নজরে',
      image:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&q=80',
      href: '/sports/knockout-fixtures',
      time: '৪ ঘণ্টা আগে',
    },
  ],
}
// ─────────────────────────────────────────────────────────────────────────────

const FeatureBanner = () => {
  const {
    hero_title,
    hero_subtitle,
    hero_bg_image,
    section_label,
    see_all_href,
    featured_articles,
    side_articles,
  } = BANNER_DATA

  return (
    <section className="w-full mb-6">

      {/* ── HERO BANNER ── */}
      <div className="relative w-full h-[220px] md:h-[360px] overflow-hidden">
        <Image
          src={hero_bg_image}
          alt={hero_title}
          fill
          className="object-cover object-center"
          priority
        />
        {/* dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

        {/* text overlay */}
        <div className="absolute bottom-0 left-0 p-5 md:p-8">
          {hero_subtitle && (
            <span className="text-yellow-400 text-xs md:text-sm font-medium tracking-widest uppercase mb-1 block">
              {hero_subtitle}
            </span>
          )}
          <h2 className="text-white text-2xl md:text-5xl font-bold leading-tight">
            {hero_title}
          </h2>
        </div>
      </div>

      {/* ── SECTION HEADER ── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a3a6b]">
        <h3 className="text-white text-sm md:text-base font-bold tracking-wide">
          {section_label}
        </h3>
        <Link
          href={see_all_href}
          className="text-yellow-400 text-xs md:text-sm font-medium hover:text-yellow-300 transition-colors"
        >
          সব দেখুন →
        </Link>
      </div>

      {/* ── CARD GRID ── */}
      <div className="bg-[#0f2548] p-4 grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Left: 2 large featured cards */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {featured_articles.map((article) => (
            <Link
              key={article.id}
              href={article.href}
              className="group block"
            >
              <div className="relative w-full h-44 overflow-hidden rounded-md">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {article.category && (
                  <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded">
                    {article.category}
                  </span>
                )}
              </div>
              <h4 className="text-white text-sm font-semibold mt-2 leading-snug line-clamp-3 group-hover:text-yellow-300 transition-colors">
                {article.title}
              </h4>
              {article.time && (
                <span className="text-gray-400 text-xs mt-1 block">{article.time}</span>
              )}
            </Link>
          ))}
        </div>

        {/* Right: side stack — small cards */}
        <div className="flex flex-col gap-3 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-4">
          {side_articles.map((article, index) => (
            <React.Fragment key={article.id}>
              <Link href={article.href} className="flex gap-3 group">
                <div className="relative w-20 h-16 flex-shrink-0 overflow-hidden rounded">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-xs font-medium leading-snug line-clamp-3 group-hover:text-yellow-300 transition-colors">
                    {article.title}
                  </h4>
                  {article.time && (
                    <span className="text-gray-400 text-[10px] mt-1 block">{article.time}</span>
                  )}
                </div>
              </Link>
              {/* divider between side articles */}
              {index < side_articles.length - 1 && (
                <div className="border-t border-white/10" />
              )}
            </React.Fragment>
          ))}
        </div>

      </div>
    </section>
  )
}

export default FeatureBanner