"use client";

import { useTranslations } from "next-intl";
import { Settings } from "lucide-react";

export default function Maintenance() {
  const t = useTranslations("maintenance");

  return (
    <div className="fixed inset-0 z-9999 min-h-screen w-full overflow-hidden bg-[#F8F9FE] flex items-center justify-center">

      {/* 1. TV Static & Scanlines (Consistent with the others) */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('https://media.giphy.com/media/oEI9uWUzn938w/giphy.gif')]"></div>
      <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.03)_50%)] bg-size-[100%_6px]"></div>

      {/* 2. Content Container */}
      <div className="relative z-20 container px-6 flex flex-col items-center">

        {/* Large Watermark Text */}
        <h1 className="absolute text-[80px] sm:text-[120px] md:text-[200px] font-black tracking-tighter text-[#1A1A1D] opacity-[0.03] select-none uppercase">
          {t("status") || "OFF-AIR"}
        </h1>

        <div className="relative z-30 flex flex-col items-center gap-10 max-w-2xl text-center">

          {/* Rotating Gear / Tuning Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#d22330] blur-2xl opacity-10 animate-pulse"></div>
            <div className="relative border-4 border-[#1A1A1D] p-8 bg-white shadow-xl">
              <Settings className="h-16 w-16 text-[#d22330] animate-[spin_8s_linear_infinite]" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-block border-2 border-[#d22330] text-[#d22330] px-6 py-1 text-sm font-bold uppercase tracking-[0.4em]">
              Station Maintenance
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-[#1A1A1D] uppercase tracking-tight">
              {t("title")}
            </h2>

            <div className="flex items-center justify-center gap-2">
              <div className="h-2 w-2 bg-[#d22330]"></div>
              <div className="h-[2px] w-32 bg-[#1A1A1D]/10"></div>
              <div className="h-2 w-2 bg-[#d22330]"></div>
            </div>

            <p className="mx-auto max-w-lg text-[#5E627B] text-base md:text-xl leading-relaxed italic">
              {t("description")}
            </p>
          </div>

          {/* Broadcast Test Bars (The classic TV pattern) */}
          <div className="mt-12 flex h-8 w-64 overflow-hidden border border-[#1A1A1D]/10 shadow-inner">
            <div className="flex-1 bg-white"></div>
            <div className="flex-1 bg-yellow-400"></div>
            <div className="flex-1 bg-cyan-400"></div>
            <div className="flex-1 bg-green-500"></div>
            <div className="flex-1 bg-magenta-500"></div>
            <div className="flex-1 bg-red-600"></div>
            <div className="flex-1 bg-blue-700"></div>
            <div className="flex-1 bg-black"></div>
          </div>

          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400">
            Please Stand By // We will be right back
          </p>
        </div>
      </div>

      {/* Frame Vignette */}
      <div className="absolute inset-0 pointer-events-none border-20 border-[#F8F9FE] shadow-[inset_0_0_100px_rgba(0,0,0,0.02)]"></div>
    </div>
  );
}