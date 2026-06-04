import MainLayout from "@/components/home/main-layout";
// import ShareMarket from "@/components/shared/share-market";
import { generateHomeMetadata } from "@/lib/metadata"; // adjust path
import { setRequestLocale } from "next-intl/server";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return generateHomeMetadata({
    path: "/",
    locale,
  });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      {/* <ShareMarket /> */}
      <MainLayout />
    </main>
  );
}
