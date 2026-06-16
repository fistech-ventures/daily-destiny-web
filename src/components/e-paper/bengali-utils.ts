const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Converts any Arabic-numeral substring in a number/string to Bengali digits. */
export function toBengaliNumber(value: number | string): string {
  return String(value).replace(/[0-9]/g, d => BENGALI_DIGITS[Number(d)]);
}

const BENGALI_MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

/** Formats an ISO date ("YYYY-MM-DD" or ISO datetime) as a Bengali date, e.g. "১৮ জুন, ২০২৪". */
export function formatBengaliDate(isoDate: string): string {
  if (!isoDate) return "";
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return isoDate;

  const [, yearStr, monthStr, dayStr] = match;
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);

  if (monthIndex < 0 || monthIndex > 11) return isoDate;

  const dayBengali = toBengaliNumber(day);
  const monthBengali = BENGALI_MONTHS[monthIndex];
  const yearBengali = toBengaliNumber(year);

  return `${dayBengali} ${monthBengali}, ${yearBengali}`;
}