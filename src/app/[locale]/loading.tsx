"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F8F9FE]">
      <div className="relative flex flex-col items-center gap-6">
        {/* Pulsing Logo */}
        <div className="relative h-24 w-24 md:h-32 md:w-32 animate-pulse flex items-center justify-center bg-white rounded-full p-4 shadow-sm">
          <img
            src="/images/logo.png"
            alt="Prime TV Loading..."
            className="object-contain"
            loading="eager"
          />
          {/* Circular Spinner around the logo */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-l-primary animate-spin opacity-50"></div>
        </div>
        
        {/* Loading Text / Bar */}
        <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-[progress_1.5s_ease-in-out_infinite]"></div>
        </div>
      </div>
      
      {/* Required keyframe animation for the progress bar */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress {
          0% {
            width: 0%;
            transform: translateX(-100%);
          }
          50% {
            width: 70%;
          }
          100% {
            width: 0%;
            transform: translateX(200%);
          }
        }
      `}} />
    </div>
  );
}
