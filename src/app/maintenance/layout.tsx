import type { Metadata } from "next";
import { Noto_Serif_Bengali } from "next/font/google";
import "@/app/global.css";

const poppins = Noto_Serif_Bengali({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Under Maintenance | Prime Tv",
  description: "We are currently under maintenance. Please check back soon.",
};

export default function MaintenanceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${poppins.className} antialiased min-h-screen bg-[#F8F9FE]`}>
      {children}
    </div>
  );
}
