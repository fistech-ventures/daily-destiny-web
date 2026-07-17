// src/components/shared/ad-banner.tsx
// Reusable advertisement banner styled like the FeatureBanner component

import React from "react";

interface AdBannerProps {
  imageUrl?: string;
  linkUrl?: string;
  altText?: string;
  className?: string;
  /**
   * Optional CSS aspect-ratio value, e.g. "6.5/1", "16/9", "2/1", "3/2".
   * When provided, overrides the default fixed-height behavior
   * and makes the banner height responsive based on its width.
   */
  aspectRatio?: string;
}

const AdBanner = ({
  imageUrl,
  linkUrl,
  altText = "Advertisement",
  className = "",
  aspectRatio,
}: AdBannerProps) => {
  const defaultAdImage =
    "https://placehold.co/1200x200/1a66ca/ffffff?text=Advertisement";

  const heightClasses = aspectRatio
    ? ""
    : "h-[100px] sm:h-[140px] md:h-[250px]";

  // Use inline style for aspect-ratio to avoid Tailwind class parser
  // issues with decimal values like "6.5/1"
  const aspectStyle: React.CSSProperties | undefined = aspectRatio
    ? { aspectRatio }
    : undefined;

  const bannerContent = (
    <div
      className={`relative w-full ${heightClasses} overflow-hidden bg-[#cbd5e1] rounded-sm ${className}`}
      style={aspectStyle}
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
