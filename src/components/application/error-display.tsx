"use client";

import { useTranslations } from "next-intl";
import SimpleErrorWithNews from "./simple-error-with-news";

interface ErrorDisplayProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorDisplay({ reset }: ErrorDisplayProps) {
  const t = useTranslations("common");

  return (
    <div className="min-h-screen flex flex-col">
      <SimpleErrorWithNews
        title={t("notFoundNews") || "Oops! Something went wrong"}
        description={t("notFoundNewsDescription") || "We're experiencing a technical issue. Our team has been notified."}
        actionText={t("backToHome") || "Try Again"}
        onAction={reset}
        showHomeButton={true}
      />
    </div>
  );
}