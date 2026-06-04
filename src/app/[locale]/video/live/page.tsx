"use client";

import { useTranslations } from "next-intl";
import { Radio } from "lucide-react";

export default function LivePage() {
  const t = useTranslations("livePage");

  return (
    <div className="relative w-full h-[80vh] overflow-hidden bg-[#F8F9FE] flex items-center justify-center rounded-2xl border border-gray-100 shadow-sm mt-4">
      {/* 1. TV Static & Scanlines */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('https://media.giphy.com/media/oEI9uWUzn938w/giphy.gif')]"></div>
      <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.03)_50%)] bg-[length:100%_6px]"></div>

      {/* 2. Content Container */}
      <div className="relative z-20 px-6 flex flex-col items-center">
        {/* Large Watermark Text */}
        <h1 className="absolute top-[20%] text-[60px] sm:text-[100px] md:text-[160px] font-black tracking-tighter text-[#1A1A1D] opacity-[0.03] select-none uppercase pointer-events-none -translate-y-1/2 whitespace-nowrap">
          {t("status")}
        </h1>

        <div className="relative z-30 flex flex-col items-center gap-8 max-w-2xl text-center">
          {/* Signal Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#d22330] blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative border-4 border-[#1A1A1D] p-6 bg-white shadow-xl">
              <Radio className="h-12 w-12 text-[#d22330] animate-pulse" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="inline-block border-2 border-[#d22330] text-[#d22330] px-6 py-1 text-xs md:text-sm font-bold uppercase tracking-[0.4em]">
              {t("badge")}
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-[#1A1A1D] uppercase tracking-tight">
              {t("title")}
            </h2>

            <div className="flex items-center justify-center gap-2">
              <div className="h-1.5 w-1.5 bg-[#d22330]"></div>
              <div className="h-[2px] w-24 bg-[#1A1A1D]/10"></div>
              <div className="h-1.5 w-1.5 bg-[#d22330]"></div>
            </div>

            <p className="mx-auto max-w-md text-[#5E627B] text-base md:text-lg leading-relaxed italic">
              {t("description")}
            </p>
          </div>

          {/* Broadcast Test Bars */}
          <div className="mt-8 flex h-6 w-48 lg:w-64 overflow-hidden border border-[#1A1A1D]/10 shadow-inner">
            <div className="flex-1 bg-white"></div>
            <div className="flex-1 bg-yellow-400"></div>
            <div className="flex-1 bg-cyan-400"></div>
            <div className="flex-1 bg-green-500"></div>
            <div className="flex-1 bg-magenta-500"></div>
            <div className="flex-1 bg-red-600"></div>
            <div className="flex-1 bg-blue-700"></div>
            <div className="flex-1 bg-black"></div>
          </div>

          <p className="mt-4 text-[10px] sm:text-xs font-bold uppercase tracking-[0.5em] text-gray-400">
            {t("footer")}
          </p>
        </div>
      </div>

      {/* Frame Vignette */}
      <div className="absolute inset-0 pointer-events-none border-[12px] border-white/60 shadow-[inset_0_0_60px_rgba(0,0,0,0.03)] rounded-2xl"></div>
    </div>
  );
}
