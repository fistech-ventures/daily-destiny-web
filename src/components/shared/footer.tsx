"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Facebook, Instagram, Linkedin, Newspaper, Users, Youtube } from "lucide-react";
import SocialIcon from "./SocialIcon";

interface FooterLink {
  name: string;
  href: string;
}

export function Footer() {
  const tFooter = useTranslations("footer");
  const locale = useLocale();

  // Get company info based on locale
  const companyInfo =
    locale === "bn"
      ? {
          name: tFooter("companyInfoBn.name"),
          subtitle: tFooter("companyInfoBn.subtitle"),
          address: tFooter("companyInfoBn.address"),
          phone: tFooter("companyInfoBn.phone"),
          email: tFooter("companyInfoBn.email"),
        }
      : {
          name: tFooter("companyInfoEn.name"),
          subtitle: tFooter("companyInfoEn.subtitle"),
          address: tFooter("companyInfoEn.address"),
          phone: tFooter("companyInfoEn.phone"),
          email: tFooter("companyInfoEn.email"),
        };

  return (
    <footer className="border-t border-gray-800 pt-12 pb-6 text-gray-400 select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Main Grid Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-16 pb-10 border-b border-gray-800">
          {/* Section 1: Brand Logo & Short Intro */}
          <div className="lg:col-span-3 space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/images/footerlogo.png"
                alt="Ekhon TV"
                height={70}
                width={140}
                className="h-auto w-auto  "
              />
            </Link>
            <p className="text-base text-primary leading-relaxed font-medium">
              {companyInfo.subtitle}
            </p>
          </div>

          {/* Section 2: Contact Info */}
          <div className="lg:col-span-3 flex flex-col gap-2">
            <h3 className="font-bold text-black text-base md:text-base tracking-wide uppercase border-l-2 border-red-600 pl-3">
              {companyInfo.name}
            </h3>
            <p className="text-base text-black whitespace-pre-line leading-relaxed mt-1">
              {companyInfo.address}
            </p>
            <div className="mt-2 flex flex-col gap-1 text-base text-black">
              <span className="hover:text-primary transition-colors cursor-pointer">
                {companyInfo.phone}
              </span>
              <span className="hover:text-primary transition-colors cursor-pointer text-nowrap">
                {companyInfo.email}
              </span>
            </div>
          </div>

          {/* Section 3: Quick Links */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h3 className="font-bold text-black text-base md:text-base tracking-wide uppercase border-l-2 border-red-600 pl-3">
              {locale === "bn" ? "কুইক লিংক" : "Quick Links"}
            </h3>
            <div className="grid grid-cols-1 gap-2 mt-1">
              {tFooter
                .raw("links.quickLinks")
                .map((link: FooterLink, index: number) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-base text-black hover:translate-x-1 transition-all duration-200 block"
                  >
                    {link.name}
                  </Link>
                ))}
            </div>
          </div>

          {/* Section 4: Social Communities Hub */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h3 className="font-bold text-black text-base md:text-base tracking-wide uppercase border-l-2 border-red-600 pl-3">
              {tFooter("socialLabel") || "আমাদের সাথে যুক্ত থাকুন"}
            </h3>

            {/* <div className="flex items-center gap-3 mt-1">
              <Link
                href="https://www.facebook.com/DailyDestinyBD"
                target="_blank"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-800 text-gray-300 hover:bg-[#0066da] hover:text-white hover:scale-110 transition-all shadow-sm"
                aria-label="Facebook link"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="https://www.youtube.com/@DailyDestinyBD"
                target="_blank"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-800 text-gray-300 hover:bg-[#ff0000] hover:text-white hover:scale-110 transition-all shadow-sm"
                aria-label="YouTube link"
              >
                <Youtube className="h-4 w-4" />
              </Link>
            </div> */}

            <div className="relative flex items-center gap-1.5 md:gap-2.5">
              {/* ════════════════════════════════════════════════
                                ১. মোস্ট ইম্পর্ট্যান্ট ৩টি আইকন (মোবাইল ও ডেস্কটপ সবখানেই দেখাবে)
                                ════════════════════════════════════════════════ */}

              {/* Facebook */}
              <SocialIcon
                bgColor="#1877F2"
                href="https://www.facebook.com/DailyDestinyBD"
              >
                <Facebook
                  size={16}
                  color="#ffffff"
                  fill="#ffffff"
                  className="stroke-[1] md:h-[18px] md:w-[18px]"
                />
              </SocialIcon>

              {/* YouTube */}
              <SocialIcon
                bgColor="#FF0000"
                href="https://www.youtube.com/@DailyDestinyBD"
              >
                <Youtube
                  size={16}
                  color="#FF0000"
                  fill="#ffffff"
                  className="stroke-[1] md:h-[18px] md:w-[18px]"
                />
              </SocialIcon>

              {/* LinkedIn */}
              <SocialIcon bgColor="#0A66C2" href="https://linkedin.com">
                <Linkedin
                  size={16}
                  color="#ffffff"
                  fill="#ffffff"
                  className="stroke-[1] md:h-[18px] md:w-[18px]"
                />
              </SocialIcon>

              {/* ════════════════════════════════════════════════
                                ২. বাকি আইকনগুলো (মোবাইলে হাইড থাকবে, শুধু md স্ক্রিন থেকে দেখাবে)
                                ════════════════════════════════════════════════ 
                              */}

              {/* Facebook Group */}
              <div className="hidden md:block">
                <SocialIcon
                  bgColor="#1877F2"
                  href="https://facebook.com/groups"
                >
                  <Users
                    size={16}
                    color="#ffffff"
                    className="stroke-[2] md:h-[18px] md:w-[18px]"
                  />
                </SocialIcon>
              </div>

              {/* TikTok */}
              <div className="hidden md:block">
                <SocialIcon bgColor="#000000" href="https://tiktok.com">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 md:h-4 md:w-4"
                    fill="#ffffff"
                  >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.61 4.18 1.15 1.21 2.76 1.93 4.41 2.02v3.62c-1.68-.03-3.32-.57-4.68-1.57-.18-.13-.34-.28-.5-.43v6.33c.03 2.87-1.4 5.63-3.89 7.07-2.73 1.63-6.29 1.41-8.79-.54-2.58-1.95-3.64-5.39-2.54-8.5 1.01-2.99 3.94-5.07 7.13-5.05.12 0 .24 0 .36.01v3.74c-1.3-.12-2.6.43-3.41 1.45-.96 1.16-1.12 2.84-.41 4.17.67 1.34 2.14 2.13 3.64 1.94 1.52-.14 2.76-1.34 2.96-2.85.04-.31.05-.62.05-.93V.02z" />
                  </svg>
                </SocialIcon>
              </div>

              
            </div>

            {/* Sub Legal Row under Social Block */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-4 mt-auto">
              {tFooter
                .raw("links.legal")
                .map((link: FooterLink, index: number) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-base text-gray-500 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Developer Credits */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3 text-base text-gray-500 font-medium">
          <p>
            {tFooter("copyright", { year: new Date().getFullYear() }) ||
              `© ${new Date().getFullYear()} সর্বস্বত্ব সংরক্ষিত`}
          </p>
          <Link
            href="https://fistech.org"
            target="_blank"
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <span>{tFooter("developed") || "Developed by"}</span>
            <span className="text-gray-400 font-bold hover:underline hover:text-primary">
              Fistech Ventures
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
