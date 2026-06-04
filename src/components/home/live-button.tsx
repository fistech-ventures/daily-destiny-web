import { Video } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function BlinkingLiveButton() {
  const tLive = useTranslations("live");

  return (
    <Link href="/video/live" className="">
      <Button className="flex items-center gap-2.5 rounded-full bg-[#f44336] w-full py-5 font-bold text-white shadow-lg transition-transform hover:scale-105 animate-shadow-blink">
        <Video className="h-5 w-5 fill-white stroke-none" strokeWidth={1.5} />
        <span className="text-sm tracking-tight">{tLive("label")}</span>
      </Button>
    </Link>
  );
}
