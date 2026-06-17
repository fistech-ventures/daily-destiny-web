import { generateHomeMetadata } from "@/lib/metadata";
import { SchemaGenerator } from "@/lib/schema";
import "./global.css";
import { solaimanLipi } from "@/fonts";

import { getGlobalConfigs } from "@/lib/api";
import { GlobalConfig } from "@/lib/types";

export const metadata = generateHomeMetadata({ locale: "en", path: "/" });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let globalConfigs: GlobalConfig | null = null;
  try {
    const res = await getGlobalConfigs();
    globalConfigs = res?.data;
  } catch (err) {
    console.error("Failed to fetch global configs in layout:", err);
  }

  const trackingScripts = globalConfigs?.trackingScripts || [];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const siteName = globalConfigs?.identity?.name;
  const orgSchema = SchemaGenerator.organization({
    name: siteName as string,
    url: siteUrl as string,
    logo: globalConfigs?.identity?.logo,
    sameAs: Object.values(globalConfigs?.identity?.socialUrls || {}).filter(
      Boolean,
    ),
  });
  const websiteSchema = SchemaGenerator.website({
    name: siteName as string,
    url: siteUrl as string,
    searchUrl: `${siteUrl}/search`,
  });

  return (
    <html lang="bn" className={solaimanLipi.variable} suppressHydrationWarning>
      <body
        className={`${solaimanLipi.className} antialiased overflow-x-hidden`}
      >
        <script
          id="organization-ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          id="website-ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}

        {trackingScripts.length > 0 && (
          <div
            style={{ display: "none" }}
            dangerouslySetInnerHTML={{ __html: trackingScripts.join("\n") }}
          />
        )}
      </body>
    </html>
  );
}