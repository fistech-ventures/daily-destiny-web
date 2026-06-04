"use client";

import { useTranslations } from "next-intl";
import SimpleErrorWithNews from "./simple-error-with-news";

export default function NotFoundContent() {
  const tCommon = useTranslations("common");

  return (
    <div className="min-h-screen flex flex-col">
      <SimpleErrorWithNews
        title={tCommon("notFoundNews")}
        description={tCommon("notFoundNewsDescription")}
        showHomeButton={true}
      />
    </div>
  );
}