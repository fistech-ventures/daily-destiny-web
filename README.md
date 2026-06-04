# Prime TV Web

A modern, bilingual (Bengali & English) news and media web application built with **Next.js 15**, featuring locale-aware routing, server-side rendering, and a responsive layout with sidebar navigation.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
  - [Building for Production](#building-for-production)
- [Internationalization (i18n)](#internationalization-i18n)
- [API Layer](#api-layer)
- [Key Components](#key-components)
- [Linting](#linting)

---

## Overview

Prime TV Web is the front-end web application for the Prime TV media platform. It delivers news articles, videos, market prices, and topic-based content in both **Bengali (বাংলা)** and **English**. The app uses Next.js App Router with locale-based routing so every URL is automatically prefixed with the active locale (e.g. `/bn/`, `/en/`).

---

## Tech Stack

| Category | Library / Tool |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router + Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) + Radix UI |
| Icons | [Lucide React](https://lucide.dev/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Data Fetching | [TanStack Query v5](https://tanstack.com/query) + [Axios](https://axios-http.com/) |
| Forms | [React Hook Form](https://react-hook-form.com/) |
| Internationalisation | [next-intl](https://next-intl-docs.vercel.app/) |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) |
| Date Utilities | [date-fns](https://date-fns.org/) |

---

## Project Structure

```
prime-tv-web/
├── public/                    # Static assets (images, icons)
├── src/
│   ├── app/
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root HTML layout
│   │   └── [locale]/          # Locale-scoped pages
│   │       ├── layout.tsx     # Locale layout (Navbar, Footer, Sidebar)
│   │       ├── page.tsx       # Home page
│   │       ├── not-found.tsx  # Custom 404 page
│   │       ├── category/[slug]/   # Category listing page
│   │       ├── news/[slug]/       # Single article page
│   │       ├── video/             # Video listing & detail pages
│   │       ├── topic/[slug]/      # Topic (tag) pages
│   │       ├── recent/            # Recently published articles
│   │       └── search/            # Search results page
│   ├── components/
│   │   ├── shared/            # Global layout components
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── mobile-bottom-nav.tsx
│   │   │   ├── language-switcher.tsx
│   │   │   ├── share-market.tsx
│   │   │   └── social-share.tsx
│   │   ├── home/              # Home page sections & sidebar
│   │   ├── category/          # Category page components
│   │   ├── news/              # Article/news page components
│   │   ├── video/             # Video page components
│   │   ├── search/            # Search page components
│   │   ├── topic/             # Topic page components
│   │   ├── application/       # App-level UI (modals, overlays)
│   │   └── ui/                # Reusable shadcn/ui primitives
│   ├── i18n/
│   │   ├── routing.ts         # Locale routing configuration
│   │   └── request.ts         # next-intl server request helper
│   ├── lib/
│   │   ├── api.ts             # Axios API client & all data-fetching functions
│   │   ├── types.ts           # Shared TypeScript interfaces
│   │   └── utils.ts           # Utility helpers (cn, etc.)
│   ├── messages/
│   │   ├── bn.json            # Bengali translations
│   │   └── en.json            # English translations
│   ├── provider/
│   │   └── app-provider.tsx   # TanStack Query client + layout orchestration
│   ├── utils/
│   │   └── date-formatter.ts  # Date formatting helpers
│   └── middleware.ts          # next-intl locale detection middleware
├── .env.example               # Environment variable template
├── next.config.ts             # Next.js configuration
├── tailwind.config (via postcss) 
├── tsconfig.json
└── package.json
```

---

## Pages & Routes

All routes are prefixed with the active locale (default: `bn`).

| Route | Description |
|---|---|
| `/` → redirect to `/bn` | Root redirects to default locale |
| `/{locale}` | Home page with featured articles and sidebar |
| `/{locale}/category/{slug}` | Articles filtered by category |
| `/{locale}/news/{slug}` | Single news article detail |
| `/{locale}/video` | Video listing page |
| `/{locale}/video/{slug}` | Single video detail |
| `/{locale}/topic/{slug}` | Articles grouped by topic/tag |
| `/{locale}/recent` | Recently published articles |
| `/{locale}/search?searchTerm=` | Full-text search results |

---

## Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later (or Yarn / pnpm)

### Installation

```bash
git clone https://github.com/quicksoft/prime-tv-web.git
cd prime-tv-web
npm install
```

### Environment Variables

Copy the example file and fill in the required values:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```env
# Base URL of the backend REST API (required)
NEXT_PUBLIC_API_URL=https://your-api.example.com
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ Yes | Base URL for all API requests (articles, categories, topics, market prices, etc.) |

> **Note:** `NEXT_PUBLIC_` prefix makes the variable accessible in both server and client components.

### Running Locally

```bash
npm run dev
```

The app will start at [http://localhost:3000](http://localhost:3000) and automatically redirect to the default locale (`/bn`).

### Building for Production

```bash
npm run build
npm run start
```

---

## Internationalization (i18n)

The app uses [**next-intl**](https://next-intl-docs.vercel.app/) for full bilingual support.

| Locale | Language | Default? |
|---|---|---|
| `bn` | Bengali (বাংলা) | ✅ Yes |
| `en` | English | No |

- Translation strings live in `src/messages/bn.json` and `src/messages/en.json`.
- The middleware (`src/middleware.ts`) auto-detects the user's locale and redirects accordingly.
- A `LanguageSwitcher` component in the navbar lets users toggle between locales at any time.
- All category and article slugs have bilingual variants (`slug` / `slugBn`, `title` / `titleBn`).

---

## API Layer

All data-fetching logic is centralized in **`src/lib/api.ts`**. It creates a pre-configured Axios instance using `NEXT_PUBLIC_API_URL` as the base URL.

| Function | Endpoint | Description |
|---|---|---|
| `getAllcategories(query?)` | `GET /web/categories` | Fetch all content categories |
| `getTrendingTopics()` | `GET /web/tags` | Fetch trending topic tags |
| `getMarketPrice()` | `GET /web/market-prices` | Fetch commodity market prices |
| `getArticles(query?)` | `GET /web/articles` | Fetch paginated/filtered articles |
| `getSingleArticle(slug)` | `GET /web/articles/by-slug/{slug}` | Fetch a single article by slug |
| `getRelatedArticles(id)` | `GET /web/articles/{id}/related` | Fetch related articles |
| `getVideos(query?)` | *(local data)* | Fetch paginated video articles |
| `getImages()` | *(local data)* | Fetch image gallery articles |

**`ArticleQueryParams`** supports filtering by: `page`, `limit`, `searchTerm`, `isActive`, `isExclusive`, `isFeatured`, `categoryId`, `subCategoryId`, `authorId`, `type`, `status`, and `topics`.

---

## Key Components

| Component | Location | Purpose |
|---|---|---|
| `Navbar` | `components/shared/navbar.tsx` | Top navigation with categories, search, and language switcher |
| `Footer` | `components/shared/footer.tsx` | Site footer with links and info |
| `MobileBottomNav` | `components/shared/mobile-bottom-nav.tsx` | Mobile sticky bottom navigation bar |
| `HomeSidebar` | `components/home/home-sidebar.tsx` | Left sidebar with categories (desktop only) |
| `AppProvider` | `provider/app-provider.tsx` | Wraps app in TanStack QueryClientProvider and manages layout |
| `LanguageSwitcher` | `components/shared/language-switcher.tsx` | Toggle between Bengali and English |
| `SocialShare` | `components/shared/social-share.tsx` | Social media share buttons on articles |
| `ShareMarket` | `components/shared/share-market.tsx` | Live share/commodity market price ticker |

---

## Linting

```bash
npm run lint
```

The project uses ESLint with the `eslint-config-next` ruleset.

---

## Image Domains

The following external image hostnames are whitelisted in `next.config.ts`:

- `sgp1.digitaloceanspaces.com` — production media storage (DigitalOcean Spaces)
- `img.youtube.com` — YouTube video thumbnails
- `placehold.co` — placeholder images (development)
- `cdn.pixabay.com` — stock images (development/testing)
