"use client";

import { useEffect } from "react";
import ErrorDisplay from "@/components/application/error-display";
import TooManyRequests from "@/components/application/too-many-requests";
import Maintenance from "@/components/application/maintenance";

interface GlobalErrorProps {
  error: Error & { digest?: string; statusCode?: number; retryAfter?: number };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Error Boundary caught:", error);
  }, [error]);

  const is429 =
    error.statusCode === 429 ||
    error.message?.includes("429") ||
    error.digest?.includes("429");

  const is503 =
    error.statusCode === 503 ||
    error.message?.includes("503") ||
    error.digest?.includes("503") ||
    error.statusCode === 502 ||
    error.message?.includes("502") ||
    error.digest?.includes("502");

  if (is429) {
    return <TooManyRequests error={error} reset={reset} />;
  }

  if (is503) {
    return <Maintenance />;
  }

  return <ErrorDisplay error={error} reset={reset} />;
}
