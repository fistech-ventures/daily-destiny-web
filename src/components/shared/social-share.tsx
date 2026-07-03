"use client";

import { usePathname } from "next/navigation";
import {
  Facebook,
  Linkedin,
  Printer,
  Link as LinkIcon,
  MessageCircleMore,
} from "lucide-react";
import { toast } from "sonner";
import { trackArticleShare } from "@/lib/api";

interface SocialShareProps {
  title: string;
  /** Optional — when provided, share events are tracked via the API */
  articleId?: string;
}

/** Generate or retrieve a per-tab session ID stored in sessionStorage */
function getSessionId(): string {
  let sessionId = sessionStorage.getItem("dd_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("dd_session_id", sessionId);
  }
  return sessionId;
}

// Custom X (formerly Twitter) Icon to match your image exactly
const XIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
  </svg>
);

const SocialShare = ({ title, articleId }: SocialShareProps) => {
  const pathname = usePathname();
  const origin = process.env.NEXT_PUBLIC_SITE_URL;

  const fullUrl = `${origin}${pathname}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
  };

  const handleShare = (link: string) => {
    if (articleId) {
      trackArticleShare(articleId, getSessionId());
    }
    window.open(link, "_blank", "width=600,height=400,noopener,noreferrer");
  };

  const handlePrint = () => {
    if (articleId) {
      trackArticleShare(articleId, getSessionId());
    }
    window.print();
  };

  const handleCopyLink = () => {
    if (articleId) {
      trackArticleShare(articleId, getSessionId());
    }
    navigator.clipboard.writeText(fullUrl);
    toast.success("Copied to clipboard!");
  };

  if (!origin) return <div className="h-15 mb-8" />;

  return (
    <div className="flex items-center gap-4 mb-4 py-4 border-y border-gray-100 print:hidden">
      {/* Facebook - Light Blue Bg */}
      <button
        onClick={() => handleShare(shareLinks.facebook)}
        className="p-2 lg:p-3 rounded-full bg-brand-light text-brand hover-bg-brand transition-all cursor-pointer"
        title="Share on Facebook"
      >
        <Facebook size={20} fill="currentColor" stroke="none" />
      </button>

      {/* X (Twitter) - Light Gray Bg */}
      <button
        onClick={() => handleShare(shareLinks.x)}
        className="p-2 lg:p-3 rounded-full bg-brand-light text-brand hover-bg-brand transition-all cursor-pointer"
        title="Share on X"
      >
        <XIcon size={16} />
      </button>

      {/* LinkedIn - Specific Blue Bg */}
      <button
        onClick={() => handleShare(shareLinks.linkedin)}
        className="p-2 lg:p-3 rounded-full bg-brand-light text-brand hover-bg-brand transition-all cursor-pointer"
        title="Share on LinkedIn"
      >
        <Linkedin size={20} fill="currentColor" stroke="none" />
      </button>

      {/* WhatsApp - Light Green Bg */}
      <button
        onClick={() => handleShare(shareLinks.whatsapp)}
        className="p-2 lg:p-3 rounded-full bg-brand-light text-brand hover-bg-brand transition-all cursor-pointer"
        title="Share on WhatsApp"
      >
        <MessageCircleMore size={20} />
      </button>

      {/* Print - Classic Gray Bg */}
      <button
        onClick={handlePrint}
        className="p-2 lg:p-3 rounded-full bg-brand-light text-brand hover-bg-brand transition-all cursor-pointer"
        title="Print Article"
      >
        <Printer size={20} />
      </button>

      {/* Copy Link - White/Gray Bg */}
      <button
        onClick={handleCopyLink}
        className="p-2 lg:p-3 rounded-full bg-brand-light text-brand hover-bg-brand transition-all cursor-pointer"
        title="Copy Link"
      >
        <LinkIcon size={20} />
      </button>
    </div>
  );
};

export default SocialShare;
