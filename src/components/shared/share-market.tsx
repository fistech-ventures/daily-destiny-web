"use client";

import { motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";

const STOCKS = [
  { name: "ANWARGALV", price: "2.9", change: "3.18%", up: true },
  { name: "AOL", price: "0.2", change: "1.30%", up: true },
  { name: "APEXFOODS", price: "8.1", change: "3.72%", up: true },
  { name: "APEXFOOT", price: "3.9", change: "2.19%", up: true },
  { name: "APEXSPINN", price: "7.5", change: "4.14%", up: true },
  { name: "ARAMIT", price: "0.3", change: "0.19%", up: false },
  { name: "ARAMITCEM", price: "-0.1", change: "-0.90%", up: false },
  { name: "ARGONDENIM", price: "0.3", change: "1.85%", up: true },
];

export default function ShareMarket() {
  const tickerData = [...STOCKS, ...STOCKS];

  const tShare = useTranslations("shareMarket");

  return (
    <div className="container w-full lg:py-6 py-2 overflow-hidden">
      <div className="">
        <div className="relative flex h-14 w-full items-center overflow-hidden border-y bg-white shadow-sm rounded-md">
          <div className="z-20 flex h-full items-center bg-primary px-4 font-semibold text-primary-foreground whitespace-nowrap shadow-[4px_0px_10px_rgba(0,0,0,0.1)] text-sm">
            {tShare("title")}
          </div>

          {/* Framer Motion Container */}
          <div className="flex flex-1 overflow-hidden">
            <motion.div
              className="flex whitespace-nowrap py-2"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                ease: "linear",
                duration: 20, // Adjust speed here (higher = slower)
                repeat: Infinity,
              }}
              // Pause animation on hover
              whileHover={{ animationPlayState: "paused" }}
            >
              {tickerData.map((stock, i) => (
                <div
                  key={i}
                  className="flex items-center lg:gap-3 gap-2 lg:px-8 px-4 border-r border-gray-100 last:border-r-0"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 tracking-tight">
                      {stock.name}
                    </span>
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <span className="text-slate-600">{stock.price}</span>
                      <span
                        className={stock.up ? "text-green-600" : "text-red-500"}
                      >
                        {stock.change}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-1 rounded-full ${stock.up ? "bg-green-50" : "bg-red-50"}`}
                  >
                    {stock.up ? (
                      <ArrowUp
                        className="h-4 w-4 text-green-600"
                        strokeWidth={3}
                      />
                    ) : (
                      <ArrowDown
                        className="h-4 w-4 text-red-500"
                        strokeWidth={3}
                      />
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
