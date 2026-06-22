

import PaperSlider from "@/components/e-paper/PaperSlider";
import { getEpaperDates, getEpaperPagesByDate } from "@/lib/api";
const PUBLICATION_NAME = "Daily Destiny";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ date?: string }>;
}

const Page = async ({ params, searchParams }: PageProps) => {
  await params;
  const resolvedSearchParams = await searchParams;
  const requestedDate = resolvedSearchParams?.date;

  // 1. All dates that have a published edition, newest first.
  const rawDates = await getEpaperDates(PUBLICATION_NAME);
  const availableDates = Array.from(new Set(rawDates)).sort((a, b) =>
    b.localeCompare(a),
  );
  const latestDate = availableDates[0] ?? null;

  let targetDate =
    requestedDate && availableDates.includes(requestedDate)
      ? requestedDate
      : latestDate;

  let pages = targetDate
    ? await getEpaperPagesByDate(targetDate, PUBLICATION_NAME)
    : [];

  if (!pages.length && targetDate !== latestDate && latestDate) {
    targetDate = latestDate;
    pages = await getEpaperPagesByDate(latestDate, PUBLICATION_NAME);
  }

  return (
    <PaperSlider
      pages={pages}
      currentDate={targetDate}
      availableDates={availableDates}
    />
  );
};

export default Page;