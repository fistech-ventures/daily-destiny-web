"use client";

import { TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Trending({
  trendingTopics,
}: {
  trendingTopics: string[];
}) {
  const tArticle = useTranslations("article");
  const tCommon = useTranslations("common");
  const [isHovering, setIsHovering] = React.useState(false);

  const increasedTrendingTopics = [...trendingTopics, ...trendingTopics];

  return (
    <div className="w-full max-w-full min-w-0 p-3 bg-background rounded-md flex flex-col gap-2">
      <div className="flex justify-center bg-primary py-1 rounded-md text-primary-foreground items-center gap-2 shrink-0">
        <TrendingUp />
        <h2 className="text-center text-base font-semibold">
          {tArticle("trending")}
        </h2>
      </div>

      {trendingTopics.length === 0 ? (
        <div className="flex justify-center items-center py-4">
          <p className="text-gray-500 text-sm font-medium">
            {tCommon("noDataAvailable")}
          </p>
        </div>
      ) : (
        <div
          className="relative overflow-hidden whitespace-nowrap mask-fade w-full pointer-events-auto"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <motion.div
            className="flex gap-3 w-fit"
            animate={{
              x: isHovering ? undefined : ["0%", "-50%"],
            }}
            transition={{
              ease: "linear",
              duration: 20,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            {increasedTrendingTopics.map((data, index) => (
              <Link
                href={`/topic/${data}`}
                key={`${data}-${index}`}
                className="text-sm font-semibold text-primary-foreground shrink-0 bg-primary px-3 py-1 rounded-md inline-block"
              >
                {data}
              </Link>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}
