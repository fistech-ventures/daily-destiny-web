"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { RotateCcw, ZapOff } from "lucide-react";
import { useTranslations } from "next-intl";

interface TooManyRequestsProps {
  error: Error & { retryAfter?: number };
  reset: () => void;
}

export default function TooManyRequests({ error, reset }: TooManyRequestsProps) {
  const t = useTranslations("tooManyRequests");
  const initialTime = error.retryAfter ? error.retryAfter : 60;
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="fixed inset-0 z-9999 w-full h-full bg-[#F8F9FE] min-h-screen overflow-hidden flex items-center justify-center">

      {/* 1. TV Static Overlay (Matching your 404) */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none mix-blend-multiply bg-[url('https://media.giphy.com/media/oEI9uWUzn938w/giphy.gif')]"></div>

      {/* 2. Scanning Line */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(210,35,48,0.05)_50%)] bg-size-[100%_8px]"></div>

      <div className="relative z-20 container px-6 flex flex-col items-center text-center">

        {/* Error Code Background */}
        <h1 className="absolute text-[180px] md:text-[300px] font-black tracking-tighter text-[#d22330] opacity-[0.03] select-none leading-none">
          429
        </h1>

        <div className="flex flex-col items-center gap-8 max-w-2xl">

          {/* Animated Warning Icon */}
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-[#d22330] opacity-20"></div>
            <div className="relative rounded-full bg-[#d22330] p-6 shadow-xl shadow-[#d22330]/20">
              <ZapOff className="h-10 w-10 text-white" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="inline-block bg-[#d22330] text-white px-3 py-1 text-xs font-bold uppercase tracking-widest animate-pulse mb-2">
              System Overload
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-[#1A1A1D] uppercase">
              {t("title")}
            </h2>

            <p className="mx-auto max-w-md text-[#5E627B] text-base md:text-lg leading-relaxed">
              {t("description")}
            </p>

            {/* Retro OSD Countdown */}
            <div className="mt-8 border-2 border-[#d22330]/20 bg-white p-6 shadow-sm inline-block min-w-[240px]">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#5E627B] mb-2 font-bold">
                Cooling Down Transmitters
              </div>
              <div className="text-4xl font-black text-[#d22330] tabular-nums">
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => reset()}
            size="lg"
            disabled={timeLeft > 0}
            className={`mt-4 rounded-none h-16 px-10 text-lg font-bold uppercase tracking-widest transition-all
              ${timeLeft > 0
                ? "bg-gray-200 text-gray-400 border-transparent cursor-not-allowed"
                : "bg-[#d22330] hover:bg-[#b01d28] text-white shadow-lg shadow-[#d22330]/20 active:scale-95"
              }`}
          >
            <RotateCcw className={`h-5 w-5 mr-3 ${timeLeft > 0 ? "" : "animate-spin-slow"}`} />
            {t("tryAgain")}
          </Button>

          <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
            Frequency: 429.00 MHz // Buffer Overflow
          </div>
        </div>
      </div>

      {/* Side Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.03)_100%)]"></div>
    </div>
  );
}