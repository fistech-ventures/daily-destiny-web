import React from "react";
import Maintenance from "@/components/application/maintenance";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export const metadata = {
  title: "Under Maintenance | Daily Destiny",
  robots: { index: false, follow: false },
};

export default async function MaintenancePage() {
  const messages = await getMessages({ locale: "en" });

  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <Maintenance />
    </NextIntlClientProvider>
  );
}
