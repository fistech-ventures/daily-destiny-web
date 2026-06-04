import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
  const blockedBots = ["AhrefsBot", "SemrushBot", "DotBot"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/login/",
          "/auth/",
          "/search?",
        ],
      },
      {
        userAgent: "facebookexternalhit",
        allow: "/",
      },
      {
        userAgent: "Twitterbot",
        allow: "/",
      },
      {
        userAgent: "LinkedInBot",
        allow: "/",
      },
      ...blockedBots.map((bot) => ({
        userAgent: bot,
        disallow: "/",
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
