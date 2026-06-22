import VisualEpaperSlider from "@/components/e-paper/VisualEpaperSlider";
import {
  getVisualEditionByDate,
  getVisualEditionDates,
  getLatestVisualEdition,
} from "@/lib/api";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ date?: string }>;
}

const VisualEpaperPage = async ({ params, searchParams }: PageProps) => {
  await params;
  const resolvedSearchParams = await searchParams;
  const requestedDate = resolvedSearchParams?.date;

  // 1. All dates that have a visual edition, newest first.
  const rawDates = await getVisualEditionDates();
  const availableDates = Array.from(new Set(rawDates)).sort((a, b) =>
    b.localeCompare(a),
  );
  const latestDate = availableDates[0] ?? null;

  // 2. Determine which edition to fetch
  let targetDate =
    requestedDate && availableDates.includes(requestedDate)
      ? requestedDate
      : latestDate;

  let edition = null;

  if (targetDate) {
    edition = await getVisualEditionByDate(targetDate);
  }

  // Fallback: if the requested date has no edition, try the latest
  if (!edition && targetDate !== latestDate && latestDate) {
    targetDate = latestDate;
    edition = await getVisualEditionByDate(latestDate);
  }

  // Ultimate fallback: fetch the latest edition directly
  if (!edition) {
    edition = await getLatestVisualEdition();
    if (edition?.publishDate) {
      targetDate = edition.publishDate;
    }
  }

  return (
    <VisualEpaperSlider
      edition={edition}
      currentDate={targetDate}
      availableDates={availableDates}
    />
  );
};

export default VisualEpaperPage;
