import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import NotFoundContent from "@/components/application/not-found-content";
import AppProvider from "@/provider/app-provider";
import { getAllcategories, getArticles, getVideos } from "@/lib/api";
import { Article } from "@/lib/types";
import { generateFallbackMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generateFallbackMetadata({ path: "/404", locale, noIndex: true });
}

export default async function GlobalNotFound() {
  const locale = await getLocale();
  const messages = await getMessages(); // gets messages for the current locale

  let categories = [];
  try {
    const res = await getAllcategories();
    categories = res?.data || [];
  } catch (error) {
    console.error("Failed to fetch categories for not-found:", error);
  }

  let articles: Article[] = [];
  try {
    const res = await getArticles({ limit: 20 });
    articles = res?.data || [];
  } catch (error) {
    console.error("Failed to fetch articles for layout:", error);
  }

  const headlines = articles.map((article) => ({
    title: article.title,
    category: article.category?.slug,
    code: article.code,
  }));

  const videoArticles = await getVideos();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AppProvider
        categories={categories}
        headlines={headlines}
        videos={videoArticles.data.slice(0, 3)}
      >
        <NotFoundContent />
      </AppProvider>
    </NextIntlClientProvider>
  );
}
