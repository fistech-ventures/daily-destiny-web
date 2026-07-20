// src/components/shared/ad-banner.tsx
// Reusable advertisement banner — supports slotKey variant system
// as well as manual overrides for backward compatibility.

import React from "react";
import type { AdSlotKey } from "@/lib/ad-slots";
import { getSlotConfig } from "@/lib/ad-slots";

interface AdBannerProps {
  /**
   * Named ad slot — looks up image, aspect ratio, alt text, link from
   * the centralized ad-slots config.  Can be overridden by passing any
   * of the explicit props below.
   *
   * Example:
   *   <AdBanner slotKey="homepage-hero-banner" />
   */
  slotKey?: AdSlotKey;
  /** Override / custom image URL (takes precedence over slot config) */
  imageUrl?: string;
  /** Override link URL */
  linkUrl?: string;
  /** Override alt text */
  altText?: string;
  /** Extra class names (merged with slot config defaults) */
  className?: string;
  /**
   * Override CSS aspect-ratio value, e.g. "6.5/1", "16/9", "2/1", "3/2".
   * When provided, overrides the default fixed-height behavior
   * and makes the banner height responsive based on its width.
   */
  aspectRatio?: string;
  /**
   * Force-hide this ad banner. Takes precedence over the slot config's
   * `hidden` flag. When true, the component renders nothing.
   *
   * This is the prop an admin panel toggle would set.
   */
  hidden?: boolean;
}

/**
 * Placeholder shown during development when neither `slotKey`
 * nor `imageUrl` is provided — makes it obvious an ad is missing.
 */
const DEV_PLACEHOLDER =
  "https://placehold.co/1200x200/1a66ca/ffffff?text=Advertisement";

/** Default alt text when nothing more descriptive is available. */
const FALLBACK_ALT = "Advertisement";

/**
 * Return the image URL to use, giving priority to:
 * 1. Explicit `imageUrl` prop
 * 2. Slot config's `imageUrl`
 * 3. A local real ad if a slotKey was given but no explicit image
 * 4. A labelled dev placeholder otherwise
 */
function resolveImage(
  explicitImageUrl: string | undefined,
  slotConfigImage: string | undefined,
  slotKey: AdSlotKey | undefined,
): string {
  if (explicitImageUrl) return explicitImageUrl;
  if (slotConfigImage) return slotConfigImage;
  // Only fall back to a real ad when a slot was intentionally chosen
  if (slotKey) return "/advertise/sspl-add1525-245.jpeg";
  return DEV_PLACEHOLDER;
}

const AdBanner = ({
  slotKey,
  imageUrl: explicitImageUrl,
  linkUrl: explicitLinkUrl,
  altText: explicitAltText,
  className: explicitClassName = "",
  aspectRatio: explicitAspectRatio,
  hidden: explicitHidden,
}: AdBannerProps) => {
  // ── Resolve config from slotKey ──────────────────────────
  const slotConfig = slotKey ? getSlotConfig(slotKey) : null;

  // Props: slot config as base, then explicit props override
  const imageUrl = resolveImage(explicitImageUrl, slotConfig?.imageUrl, slotKey);
  const linkUrl = explicitLinkUrl ?? slotConfig?.linkUrl;
  const altText = explicitAltText ?? slotConfig?.altText ?? FALLBACK_ALT;
  const aspectRatio = explicitAspectRatio ?? slotConfig?.aspectRatio;

  // ── Hidden check: explicit prop wins, then slot config, then visible ──
  const isHidden = explicitHidden ?? slotConfig?.hidden ?? false;
  if (isHidden) return null;

  // Merge className: slot defaults + caller overrides
  const resolvedClassName = [slotConfig?.className ?? "", explicitClassName]
    .filter(Boolean)
    .join(" ");

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
      className={`relative w-full ${heightClasses} overflow-hidden bg-[#cbd5e1] rounded-sm ${resolvedClassName}`}
      style={aspectStyle}
    >
      <img
        src={imageUrl}
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
