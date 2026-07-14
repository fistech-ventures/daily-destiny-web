import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import AppProvider from "@/provider/app-provider";
import { Toaster } from "sonner";
import {
  getAllcategories,
  getArticles,
  getVideos,
  getMarketPrice,
} from "@/lib/api";
import BackToTop from "@/components/shared/back-to-top";
import { Article } from "@/lib/types";
import { getArticleCategory } from "@/lib/utils";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  let categories = [];
  let totalCategories = 0;
  try {
    const res = await getAllcategories({ sortBy: "position", page: 1, limit: 50 });
    categories = res?.data || [];
    totalCategories = res?.meta?.total || categories.length;
  } catch (error) {
    console.error("Failed to fetch categories for layout:", error);
  }

  let articles: Article[] = [];
  try {
    const res = await getArticles({ limit: 20 });
    articles = res?.data || [];
  } catch (error) {
    console.error("Failed to fetch articles for layout:", error);
  }

  let marketPrices = [];
  try {
    const res = await getMarketPrice({ page: 1, limit: 10 });
    marketPrices = res?.data || [];
  } catch (error) {
    console.error("Failed to fetch market prices for layout:", error);
  }

  const videoAticles = await getVideos();

  const headlines = articles.map((article) => ({
    title: article.title,
    category: getArticleCategory(article)?.slug ?? "",
    code: article.code,
  }));

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AppProvider
        categories={categories}
        totalCategories={totalCategories}
        headlines={headlines}
        videos={videoAticles.data.slice(0, 3)}
        marketPrices={marketPrices}
      >
        {children}
        <BackToTop />
        <Toaster position="top-center" duration={1000} />
      </AppProvider>
    </NextIntlClientProvider>
  );
}
