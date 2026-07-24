// src/components/shared/ad-banner.tsx
// Reusable advertisement banner — supports API-driven ads via pageType+position
// as well as slotKey-based static config for backward compatibility.

"use client";

import React from "react";
import type { AdSlotKey } from "@/lib/ad-slots";
import { getSlotConfig } from "@/lib/ad-slots";
import { useAds } from "@/hooks/use-ads";
import type { PageType, Ad } from "@/lib/ads-types";

interface AdBannerProps {
  /**
   * API-driven: page type this ad appears on.
   * When provided alongside `position`, the component fetches ads from
   * the backend API instead of using the static slot config.
   *
   * Example:
   *   <AdBanner pageType="homePage" position="Home-TopBanner" />
   */
  pageType?: PageType;
  /**
   * API-driven: named position on the page.
   * Must be paired with `pageType`.
   */
  position?: string;
  /**
   * Legacy: named ad slot — looks up image, aspect ratio, alt text, link from
   * the centralized ad-slots config.
   *
   * Example:
   *   <AdBanner slotKey="homepage-hero-banner" />
   */
  slotKey?: AdSlotKey;
  /** Override / custom image URL (takes precedence over API data) */
  imageUrl?: string;
  /** Override link URL */
  linkUrl?: string;
  /** Override alt text */
  altText?: string;
  /** Extra class names */
  className?: string;
  /**
   * Override CSS aspect-ratio value, e.g. "6.5/1", "16/9", "2/1", "3/2".
   * When provided, overrides the default fixed-height behavior
   * and makes the banner height responsive based on its width.
   */
  aspectRatio?: string;
  /** Force-hide this ad banner. When true, renders nothing. */
  hidden?: boolean;
}

/**
 * Placeholder shown when no ad is available.
 */
const DEV_PLACEHOLDER =
  "https://placehold.co/1200x200/1a66ca/ffffff?text=Advertisement";

/** Default alt text when nothing more descriptive is available. */
const FALLBACK_ALT = "Advertisement";

// ── Ad type renderers ──────────────────────────────────────

/** Render an IMAGE-type ad */
function ImageAd({ ad }: { ad: Ad }) {
  return (
    <img
      src={ad.imageUrl || DEV_PLACEHOLDER}
      alt={ad.title || FALLBACK_ALT}
      className="w-full h-full object-contain"
      loading="lazy"
    />
  );
}

/** Render a VIDEO-type ad (autoplay, muted, loop) */
function VideoAd({ ad }: { ad: Ad }) {
  return (
    <video
      src={ad.videoUrl || undefined}
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-contain"
      aria-label={ad.title || FALLBACK_ALT}
    />
  );
}

/** Render an EMBEDED-type ad (iframe / third-party script) */
function EmbedAd({ ad }: { ad: Ad }) {
  if (!ad.scriptEmbedCode) {
    return <ImageAd ad={ad} />;
  }
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      dangerouslySetInnerHTML={{ __html: ad.scriptEmbedCode }}
    />
  );
}

/** Render a single ad based on its type */
function AdContent({ ad }: { ad: Ad }) {
  switch (ad.type) {
    case "VIDEO":
      return <VideoAd ad={ad} />;
    case "EMBEDED":
      return <EmbedAd ad={ad} />;
    case "ANIMATION":
    case "IMAGE":
    default:
      return <ImageAd ad={ad} />;
  }
}

// ── Main component ────────────────────────────────────────

const AdBanner = ({
  pageType,
  position,
  slotKey,
  imageUrl: explicitImageUrl,
  linkUrl: explicitLinkUrl,
  altText: explicitAltText,
  className: explicitClassName = "",
  aspectRatio: explicitAspectRatio,
  hidden: explicitHidden,
}: AdBannerProps) => {
  // ── Determine rendering mode ──────────────────────────
  const isApiMode = Boolean(pageType && position);
  const isLegacyMode = Boolean(slotKey);

  // ── API mode: fetch ads from backend ──────────────────
  const { data: apiAds } = useAds(
    isApiMode
      ? { pageType: pageType!, position: position!, enabled: true }
      : { enabled: false },
  );
  const apiAd = apiAds && apiAds.length > 0 ? apiAds[0] : null;

  // ── Legacy mode: resolve from static config ────────────
  const slotConfig = isLegacyMode && slotKey ? getSlotConfig(slotKey) : null;

  // ── Hidden check ──────────────────────────────────────
  const isHidden = explicitHidden ?? slotConfig?.hidden ?? false;
  if (isHidden) return null;

  // ── Resolve ad content ────────────────────────────────
  let resolvedImageUrl: string;
  let resolvedLinkUrl: string | undefined;
  let resolvedAltText: string;
  let resolvedAspectRatio: string | undefined;
  let resolvedClassName: string;

  if (isApiMode && apiAd) {
    // API mode: ad data from backend
    resolvedImageUrl = explicitImageUrl || apiAd.imageUrl || DEV_PLACEHOLDER;
    resolvedLinkUrl = explicitLinkUrl || apiAd.redirectUrl || undefined;
    resolvedAltText = explicitAltText || apiAd.title || FALLBACK_ALT;
    resolvedAspectRatio = explicitAspectRatio || undefined;
    resolvedClassName = explicitClassName;
  } else if (isLegacyMode && slotConfig) {
    // Legacy mode: static config
    resolvedImageUrl = explicitImageUrl || slotConfig.imageUrl;
    resolvedLinkUrl = explicitLinkUrl || slotConfig.linkUrl;
    resolvedAltText = explicitAltText || slotConfig.altText || FALLBACK_ALT;
    resolvedAspectRatio = explicitAspectRatio || slotConfig.aspectRatio;
    resolvedClassName = [slotConfig.className ?? "", explicitClassName]
      .filter(Boolean)
      .join(" ");
  } else if (explicitImageUrl) {
    // Manual override mode (no API, no slot)
    resolvedImageUrl = explicitImageUrl;
    resolvedLinkUrl = explicitLinkUrl;
    resolvedAltText = explicitAltText || FALLBACK_ALT;
    resolvedAspectRatio = explicitAspectRatio;
    resolvedClassName = explicitClassName;
  } else {
    // Fallback: show placeholder
    resolvedImageUrl = DEV_PLACEHOLDER;
    resolvedLinkUrl = explicitLinkUrl;
    resolvedAltText = explicitAltText || FALLBACK_ALT;
    resolvedAspectRatio = explicitAspectRatio;
    resolvedClassName = explicitClassName;
  }

  const heightClasses = resolvedAspectRatio
    ? ""
    : "h-[100px] sm:h-[140px] md:h-[250px]";

  const aspectStyle: React.CSSProperties | undefined = resolvedAspectRatio
    ? { aspectRatio: resolvedAspectRatio }
    : undefined;

  // ── Build banner content ──────────────────────────────
  const bannerContent = (
    <div
      className={`relative w-full ${heightClasses} overflow-hidden bg-[#cbd5e1] rounded-sm ${resolvedClassName}`}
      style={aspectStyle}
    >
      {isApiMode && apiAd ? (
        <AdContent ad={apiAd} />
      ) : (
        <img
          src={resolvedImageUrl}
          alt={resolvedAltText}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      )}
    </div>
  );

  if (resolvedLinkUrl) {
    return (
      <a
        href={resolvedLinkUrl}
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
