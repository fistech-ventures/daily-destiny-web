// src/components/shared/ad-banner.tsx
// Reusable advertisement banner styled like the FeatureBanner component

import React from "react";

interface AdBannerProps {
  imageUrl?: string;
  linkUrl?: string;
  altText?: string;
  className?: string;
}

const AdBanner = ({
  imageUrl,
  linkUrl,
  altText = "Advertisement",
  className = "",
}: AdBannerProps) => {
  const defaultAdImage =
    "https://placehold.co/1200x200/1a66ca/ffffff?text=Advertisement";

  const bannerContent = (
    <div
      className={`relative w-full h-[100px] sm:h-[140px] md:h-[250px] overflow-hidden bg-[#cbd5e1] rounded-sm ${className}`}
    >
      <img
        src={imageUrl || defaultAdImage}
        alt={altText}
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );

  if (linkUrl) {
    return (
      <a
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {bannerContent}
      </a>
    );
  }

  return bannerContent;
};

export default AdBanner;
