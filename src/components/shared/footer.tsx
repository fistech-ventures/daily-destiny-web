import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

import { Facebook, Youtube } from "lucide-react";

interface FooterLink {
  name: string;
  href: string;
}

export function Footer() {
  const tFooter = useTranslations("footer");
  const locale = useLocale();

  // Get company info based on locale
  const companyInfo = locale === 'bn' 
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
    <footer className="bg-white border-t border-gray-100 py-5 lg:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
          {/* Section 1: Logo */}
          <div className="lg:col-span-3 space-y-2 lg:space-y-4">
            <div className="flex justify-center lg:justify-start">
              <Link href="/" className="block">
                <img
                  src="/images/logo.png"
                  alt="Ekhon TV"
                  height={80}
                  width={160}
                  className="h-auto w-auto max-w-45"
                />
              </Link>
            </div>
            <p className="text-gray-800 text-sm font-medium">
              {companyInfo.subtitle}
            </p>
          </div>

          {/* Section 2: Company Info */}
          <div className="lg:col-span-3 flex flex-col gap-1 lg:border-l lg:border-gray-900/10 lg:pl-8 h-full">
            <h3 className="font-bold text-gray-900 text-sm md:text-base">
              {companyInfo.name}
            </h3>
            <p className="text-gray-800 text-sm font-medium">
              {companyInfo.subtitle}
            </p>
            <p className="text-gray-700 text-xs md:text-sm whitespace-pre-line leading-relaxed mt-1">
              {companyInfo.address}
            </p>
            <div className="mt-4 flex flex-col gap-0.5">
              <p className="text-gray-500 text-xs md:text-sm font-medium">
                {companyInfo.phone}
              </p>
              <p className="text-gray-500 text-xs md:text-sm font-medium">
                {companyInfo.email}
              </p>
            </div>
          </div>

          {/* Section 3: Quick Links */}
          <div className="lg:col-span-3 flex flex-col gap-1 lg:border-l lg:border-gray-900/10 lg:pl-8 h-full">
            <h3 className="font-bold text-gray-900 text-sm md:text-base mb-2">
              {locale === 'bn' ? 'কুইক লিংক' : 'Quick Links'}
            </h3>
            <div className="space-y-1">
              {tFooter.raw("links.quickLinks").map((link: FooterLink, index: number) => (
                <Link
                  key={index}
                  href={link.href}
                  className="block text-gray-600 hover:text-primary text-sm md:text-base transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Section 4: Social Media & Legal Links */}
          <div className="lg:col-span-3 flex flex-col gap-6 lg:pl-8">
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                {tFooter("socialLabel")}
              </h3>
              <div className="flex items-center gap-5">
                <Link
                  href="https://www.facebook.com/primetv360"
                  target="_blank"
                  className="text-gray-900 hover:text-primary transition-colors"
                >
                  <Facebook className="h-6 w-6" />
                </Link>
                <Link
                  href="https://www.youtube.com/@primetv-com"
                  target="_blank"
                  className="text-gray-900 hover:text-primary transition-colors"
                >
                  <Youtube className="h-6 w-6" />
                </Link>
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-transparent flex gap-6 lg:justify-start">
              {tFooter.raw("links.legal").map((link: FooterLink, index: number) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-gray-500 hover:text-gray-900 text-sm font-medium border-b border-gray-400 pb-0.5 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-center lg:mt-10 mt-5 mb-16 lg:mb-0 p-2 lg:p-4 rounded-md bg-primary text-white">
          <p className="text-base lg:text-lg font-semibold">
            {tFooter("copyright", { year: new Date().getFullYear() })}
          </p>
          <Link
            href="https://quicksoftltd.com"
            target="_blank"
            className="text-base lg:text-lg font-semibold"
          >
            {tFooter("developed")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
