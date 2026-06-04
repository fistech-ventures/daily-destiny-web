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

interface SocialShareProps {
  title: string;
}

// Custom X (formerly Twitter) Icon to match your image exactly
const XIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
  </svg>
);

const SocialShare = ({ title }: SocialShareProps) => {
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

  const openPopup = (link: string) => {
    window.open(link, "_blank", "width=600,height=400,noopener,noreferrer");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl);
    toast.success("Copied to clipboard!");
  };

  if (!origin) return <div className="h-15 mb-8" />;

  return (
    <div className="flex items-center gap-4 mb-4 py-4 border-y border-gray-100 print:hidden">
      {/* Facebook - Light Blue Bg */}
      <button
        onClick={() => openPopup(shareLinks.facebook)}
        className="p-2 lg:p-3 rounded-full bg-[#E7F0FF] text-[#1877F2] hover:bg-blue-200 transition-all cursor-pointer"
        title="Share on Facebook"
      >
        <Facebook size={20} fill="currentColor" stroke="none" />
      </button>

      {/* X (Twitter) - Light Gray Bg */}
      <button
        onClick={() => openPopup(shareLinks.x)}
        className="p-2 lg:p-3 rounded-full bg-[#E7E7E8] text-black hover:bg-gray-300 transition-all cursor-pointer"
        title="Share on X"
      >
        <XIcon size={16} />
      </button>

      {/* LinkedIn - Specific Blue Bg */}
      <button
        onClick={() => openPopup(shareLinks.linkedin)}
        className="p-2 lg:p-3 rounded-full bg-[#E5EEFF] text-[#0077B5] hover:bg-blue-200 transition-all cursor-pointer"
        title="Share on LinkedIn"
      >
        <Linkedin size={20} fill="currentColor" stroke="none" />
      </button>

      {/* WhatsApp - Light Green Bg */}
      <button
        onClick={() => openPopup(shareLinks.whatsapp)}
        className="p-2 lg:p-3 rounded-full bg-[#E7F9ED] text-[#24b459] hover:bg-green-200 transition-all cursor-pointer"
        title="Share on WhatsApp"
      >
        <MessageCircleMore size={20} />
      </button>

      {/* Print - Classic Gray Bg */}
      <button
        onClick={() => window.print()}
        className="p-2 lg:p-3 rounded-full bg-[#EBECEF] text-[#374151] hover:bg-gray-300 transition-all cursor-pointer"
        title="Print Article"
      >
        <Printer size={20} />
      </button>

      {/* Copy Link - White/Gray Bg */}
      <button
        onClick={copyToClipboard}
        className="p-2 lg:p-3 rounded-full bg-[#F3F4F6] text-[#4B5563] hover:bg-gray-200 transition-all cursor-pointer"
        title="Copy Link"
      >
        <LinkIcon size={20} />
      </button>
    </div>
  );
};

export default SocialShare;
