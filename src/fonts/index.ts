import localFont from "next/font/local";

export const solaimanLipi = localFont({
  src: [
    {
      path: "./SolaimanLipi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./SolaimanLipi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-solaiman-lipi",
});
