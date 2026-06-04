import { formatDistance } from "date-fns";
import { bn } from "date-fns/locale";

export function formatRelativeTime(
  date: string | Date | number,
) {
  // Convert both dates to Bangladesh Time explicitly to avoid any server/client or timezone mismatch
  const tzOptions = { timeZone: "Asia/Dhaka" };
  const bdNow = new Date(new Date().toLocaleString("en-US", tzOptions));
  const bdDate = new Date(new Date(date).toLocaleString("en-US", tzOptions));

  return formatDistance(bdDate, bdNow, {
    addSuffix: true,
    locale: bn,
  });
}


export function formatBdTime(date: string | Date | number) {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Dhaka",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const parts = new Intl.DateTimeFormat("bn-BD", options).formatToParts(d);

  const day = parts.find(p => p.type === "day")?.value;
  const month = parts.find(p => p.type === "month")?.value;
  const year = parts.find(p => p.type === "year")?.value;
  const hour = parts.find(p => p.type === "hour")?.value;
  const minute = parts.find(p => p.type === "minute")?.value;
  const dayPeriod = parts.find(p => p.type === "dayPeriod")?.value;

  return `${day} ${month} ${year}, ${hour}:${minute} ${dayPeriod}`;
}