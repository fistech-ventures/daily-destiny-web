"use client";

import { motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface Stock {
  no: string;
  tradingCode: string;
  ltp: number;
  high: number;
  low: number;
  closep: number;
  ycp: number;
  change: number;
  trade: number;
  value: number;
  volume: number;
  status: "up" | "down";
  changePercentage: number;
}

export default function ShareMarket() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const tShare = useTranslations("shareMarket");

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await fetch("https://dse-scraper.ekhon.tv/get-stock-data");
        const data = await res.json();

        // Limit the number shown in ticker if needed
        setStocks(data.data?.slice(0, 20) || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStocks();
  }, []);

  const tickerData = [...stocks, ...stocks];

  return (
    <div className="container w-full overflow-hidden py-2 lg:py-6">
      <div className="relative flex h-14 w-full items-center overflow-hidden rounded-md border-y bg-white shadow-sm">
        <div className="z-20 flex h-full items-center whitespace-nowrap bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[4px_0px_10px_rgba(0,0,0,0.1)]">
          {tShare("title")}
        </div>

        <div className="flex flex-1 overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap py-2"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 30,
              repeat: Infinity,
            }}
          >
            {tickerData.map((stock, i) => {
              const isUp = stock.status === "up";

              return (
                <div
                  key={`${stock.tradingCode}-${i}`}
                  className="flex items-center gap-2 border-r border-gray-100 px-4 lg:gap-3 lg:px-8"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold tracking-tight text-slate-800">
                      {stock.tradingCode}
                    </span>

                    <div className="flex items-center gap-2 text-xs font-medium">
                      <span className="text-slate-600">
                        {stock.ltp.toFixed(2)}
                      </span>

                      <span
                        className={isUp ? "text-green-600" : "text-red-500"}
                      >
                        {stock.changePercentage.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div
                    className={`rounded-full p-1 ${
                      isUp ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    {isUp ? (
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
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}