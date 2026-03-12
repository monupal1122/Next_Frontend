"use client";

import { useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdBannerProps {
  /** Your AdSense ad-slot ID  (e.g. "1234567890") */
  adSlot: string;
  /** Ad format — maps directly to data-ad-format */
  adFormat?: "auto" | "rectangle" | "horizontal" | "vertical";
  /** Whether the ad should be fully responsive */
  responsive?: boolean;
  /** Optional Tailwind / CSS classes for the wrapper div */
  className?: string;
}

// ─── Global type declaration for the AdSense push helper ─────────────────────
// Google doesn't ship TypeScript types for adsbygoogle, so we use a simple any[].
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * AdBanner
 *
 * Renders a single Google AdSense ad unit.
 *
 * Usage:
 *   <AdBanner adSlot="1234567890" adFormat="auto" responsive />
 *
 * How to replace placeholders:
 *   1. Open `src/app/layout.tsx` and replace `ca-pub-XXXXXXXXXXXXXXXX`
 *      with your real Publisher ID (found in AdSense → Account → Account info).
 *   2. Pass your real Ad Slot ID to the `adSlot` prop wherever you use <AdBanner>.
 */
export default function AdBanner({
  adSlot,
  adFormat = "auto",
  responsive = true,
  className = "",
}: AdBannerProps) {
  // Track whether we have already called adsbygoogle.push() for this instance.
  // This prevents double-initialisation when React re-renders the component
  // during client-side navigation (Strict Mode or layout remounts).
  const initialised = useRef(false);

  useEffect(() => {
    // Guard: only run once per mount, and only in the browser.
    if (initialised.current) return;
    initialised.current = true;

    try {
      // Cast to `any[]` so TypeScript allows `.push({})`.
      // Google doesn't ship types for this global.
      (window.adsbygoogle as unknown[]).push({});
    } catch (err) {
      // Swallow errors in dev / ad-blocked environments so the page
      // doesn't break when AdSense is unavailable.
      console.warn("[AdBanner] AdSense push failed:", err);
    }
  }, []); // Empty deps → runs once after the first client-side render.

  return (
    <div className={`adsense-wrapper overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
