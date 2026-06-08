import React, { ReactNode } from "react";

interface SocialIconProps {
  bgColor: string;
  href: string;
  children: ReactNode;
}

export default function SocialIcon({
  bgColor,
  href,
  children,
}: SocialIconProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
      style={{ backgroundColor: bgColor }}
    >
      {children}
    </a>
  );
}