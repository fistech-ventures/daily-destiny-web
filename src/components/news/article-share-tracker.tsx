"use client";

import { useEffect } from "react";
import { trackArticleShare } from "@/lib/api";

/**
 * Fires a single "view" event for an article when mounted.
 *
 * `sessionId` is a per-tab UUID stored in sessionStorage. It resets when the
 * tab is closed, so each new tab counts as a new session. The backend can use
 * it to deduplicate repeated views from the same session (e.g. refreshes).
 */
export default function ArticleShareTracker({
  articleId,
}: {
  articleId: string;
}) {
  useEffect(() => {
    if (!articleId) return;

    // Generate or retrieve a per-tab session ID
    let sessionId = sessionStorage.getItem("dd_session_id");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("dd_session_id", sessionId);
    }

    trackArticleShare(articleId, sessionId);
  }, [articleId]);

  return null;
}
