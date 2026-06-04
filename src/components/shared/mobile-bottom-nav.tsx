"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, Video } from "lucide-react";
import { useTranslations } from "next-intl";

const navigationItems = [
  { key: "home", href: "/", icon: Home },
  { key: "recent", href: "/recent", icon: Clock },
  { key: "video", href: "/video", icon: Video },
];

const locales = ["en", "bn"];

export function MobileBottomNav() {
  const t = useTranslations("navLinks");
  const pathname = usePathname();

  const strippedPathname = locales.reduce(
    (p, locale) =>
      p.startsWith(`/${locale}`) ? p.replace(`/${locale}`, "") || "/" : p,
    pathname
  );

  const isActive = (href: string) => {
    if (href === "/") return strippedPathname === "/" || strippedPathname === "";
    return strippedPathname.startsWith(href);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-[0_-4px_18px_-10px_rgba(0,0,0,0.1)] pb-safe">
      <nav className="flex items-center justify-around h-16">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive(item.href)
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
                }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{t(item.key)}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}