// import MainLayout from "@/components/home/main-layout";
// import VideoList from "@/components/video/video-list";
// // import ShareMarket from "@/components/shared/share-market";
// import { generateHomeMetadata } from "@/lib/metadata"; // adjust path
// import { setRequestLocale } from "next-intl/server";

// export const revalidate = 60;

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ locale: string }>;
// }) {
//   const { locale } = await params;

//   return generateHomeMetadata({
//     path: "/",
//     locale,
//   });
// }

// export default async function Home({
//   params,
// }: {
//   params: Promise<{ locale: string }>;
// }) {
//   const { locale } = await params;
//   setRequestLocale(locale);

//   return (
//     <main>
//       {/* <ShareMarket /> */}
//       <MainLayout />
//       <VideoList initialVideos={initialVideos} initialMeta={initialMeta} />
//     </main>
//   );
// }

import MainLayout from "@/components/home/main-layout";
import VideoSlider from "@/components/video/video-slider"; // Import the Slider
import { generateHomeMetadata } from "@/lib/metadata";
import { setRequestLocale } from "next-intl/server";
import { getVideos } from "@/lib/api";

export const revalidate = 60;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch standard data array
  const response = await getVideos({ page: 1, limit: 12 });
  const initialVideos = response?.data || [];

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-8">
      <MainLayout />
      
      {/* Horizontal Video Slider Section */}
      <VideoSlider videos={initialVideos} title="ভিডিও" />
    </main>
  );
}