"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useRef } from "react";
import Link from "next/link";

export default function Headline({ headlines }: { headlines: { title: string, code: string, category: string }[] }) {
  const tCommon = useTranslations("common");
  const [isHovering, setIsHovering] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const animFrameRef = useRef<number>(null);
  const lastTimeRef = useRef<number>(null);
  const DURATION = 150000;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const totalWidth = el.scrollWidth / 2;
    const pixelsPerMs = totalWidth / DURATION;

    const animate = (timestamp: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      xRef.current -= pixelsPerMs * delta;

      // Reset when one full cycle is done
      if (Math.abs(xRef.current) >= totalWidth) {
        xRef.current = 0;
      }

      el.style.transform = `translateX(${xRef.current}px)`;
      animFrameRef.current = requestAnimationFrame(animate);
    };

    if (!isHovering) {
      lastTimeRef.current = null;
      animFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isHovering]);

  return (
    <div className="no-print sticky top-0 z-50 w-full bg-background flex items-center overflow-hidden h-8 lg:h-10 border-b border-primary">
      <div className="z-10 flex bg-primary px-2 lg:px-10 h-full items-center gap-2 shrink-0 shadow-[4px_0_10px_rgba(0,0,0,0.1)]">
        <h2 className="text-primary-foreground text-sm lg:text-base font-bold uppercase tracking-wider">
          {tCommon("headline")}
        </h2>
      </div>

      {headlines.length === 0 ? (
        <div className="flex px-4 items-center">
          <p className="text-muted-foreground text-sm italic">
            {tCommon("noDataAvailable")}
          </p>
        </div>
      ) : (
        <div
          className="relative flex-1 overflow-hidden h-full flex items-center"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="absolute inset-y-0 left-0 w-8 bg-linear-to-r from-background to-transparent z-5" />
          <div className="absolute inset-y-0 right-0 w-8 bg-linear-to-l from-background to-transparent z-5" />

          {/* Wrap in a plain div, skip Framer Motion entirely */}
          <div ref={containerRef} className="flex gap-8 items-center">
            {/* Duplicate headlines for seamless loop */}
            {[...headlines, ...headlines].map((headline, index) => {
              if (!headline || !headline.category || !headline.code) return null;
              return (
                <Link
                  href={`/news/${headline.category}/${headline.code}`}
                  key={index}
                  className="text-sm lg:text-lg font-semibold hover:text-primary transition-colors whitespace-nowrap flex items-center gap-2 group"
                >
                  <span className="text-primary opacity-50 group-hover:opacity-100">
                    •
                  </span>
                  {headline.title}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
