// ─────────────────────────────────────────────────────────────────────────────
// TEMPORARY STATIC PLACEHOLDER
// ─────────────────────────────────────────────────────────────────────────────
// `featureBannerConfig` is used ONLY as a stand-in until the real API endpoint
// (GET /web/feature-banners/active) is live.
//
// WHEN THE API IS READY:
//   1. Delete the `featureBannerConfig` const (not the interfaces).
//   2. In `src/lib/api.ts` → `getFeatureBannerData()`:
//      - Uncomment the real API call.
//      - Remove the static placeholder `return` statement.
//      - Remove the top-level import of `featureBannerConfig` from this file.
//   3. Optionally move the interfaces below to `src/lib/types.ts` and
//      delete this file entirely.
// ─────────────────────────────────────────────────────────────────────────────

export interface Article {
  id: string
  title: string
  image: string
  href: string
  time?: string
  category?: string
}

export interface FeatureBannerConfig {
  is_active: boolean
  hero_title: string
  hero_subtitle?: string
  hero_bg_image: string
  section_label: string
  see_all_href: string
  featured_articles: Article[]  // 2 large cards
  side_articles: Article[]      // 2-3 small stacked cards
}

export const featureBannerConfig: FeatureBannerConfig = {
  // ✅ Toggle this to true/false to simulate admin on/off
  is_active: true,

  hero_title: 'ফুটবলের বিশ্ব লড়াই',
  hero_subtitle: 'FIFA World Cup 2026',
  hero_bg_image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1400&q=80',
  section_label: 'বিশ্বকাপ ফুটবল ২০২৬',
  see_all_href: '/worldcup-2026',

  featured_articles: [
    {
      id: '1',
      title: "'কোনো কিছুই অসম্ভব নয়' — আর্জেন্টিনাকে নিয়ে কেপ ভার্দের কোচ",
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80',
      href: '/sports/argentina-cape-verde',
      time: '১ ঘণ্টা আগে',
      category: 'বিশ্বকাপ',
    },
    {
      id: '2',
      title: 'বিশ্বকাপে এই মাইলফলকেও প্রথম ব্রাজিল',
      image: 'https://images.unsplash.com/photo-1551958219-acbc630e2914?w=600&q=80',
      href: '/sports/brazil-milestone',
      time: '২ ঘণ্টা আগে',
      category: 'বিশ্বকাপ',
    },
  ],

  side_articles: [
    {
      id: '3',
      title: 'যেভাবে এখনো নকআউট পর্বে উঠতে পারে ইরান',
      image: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=300&q=80',
      href: '/sports/iran-knockout-chances',
      time: '৩ ঘণ্টা আগে',
    },
    {
      id: '4',
      title: 'বিশ্বকাপ থেকে বিদায়ের পর কোচের সিদ্ধান্ত নিয়ে মুখ খুললেন উরুগুয়ে অধিনায়ক',
      image: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=300&q=80',
      href: '/sports/uruguay-coach-decision',
      time: '৩ ঘণ্টা আগে',
    },
    {
      id: '5',
      title: 'নকআউটে কে কার মুখোমুখি, দেখে নিন এক নজরে',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&q=80',
      href: '/sports/knockout-fixtures',
      time: '৪ ঘণ্টা আগে',
    },
  ],
}