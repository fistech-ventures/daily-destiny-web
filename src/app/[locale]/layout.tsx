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
} from "@/lib/api";
import { Article } from "@/lib/types";

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
  try {
    const res = await getAllcategories();
    categories = res?.data || [];
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

  const videoAticles = await getVideos();

  const headlines = articles.map((article) => ({
    title: article.title,
    category: article.category?.slug,
    code: article.code,
  }));

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AppProvider
        categories={categories}
        headlines={headlines}
        videos={videoAticles.data.slice(0, 3)}
      >
        {children}
        <Toaster position="top-center" duration={1000} />
      </AppProvider>
    </NextIntlClientProvider>
  );
}
