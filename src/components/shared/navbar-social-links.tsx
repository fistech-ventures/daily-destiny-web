"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  Facebook,
  Youtube,
  Linkedin,
  Users,
  Instagram,
  Newspaper,
  X,
  MoreHorizontal,
} from "lucide-react";
import SocialIcon from "./SocialIcon";

interface NavbarSocialLinksProps {
  isPopupOpen: boolean;
  setIsPopupOpen: (open: boolean) => void;
  variant?: "navbar" | "hamburger"; // Added prop to separate layout types safely
}

export function NavbarSocialLinks({
  isPopupOpen,
  setIsPopupOpen,
  variant = "navbar",
}: NavbarSocialLinksProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // ════════════════════════════════════════════════
  // অরিজিনাল হ্যামবার্গার/ফুটার ২-রো লেআউট (No flinching, items wrap evenly)
  // ════════════════════════════════════════════════
  if (variant === "hamburger") {
    return (
      <div className="flex flex-col items-center gap-4 w-full py-2">
        {/* Row 1: Top 5 Icons */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3">
          {/* Facebook */}
          <SocialIcon bgColor="#1877F2" href="https://www.facebook.com/DailyDestinyBD">
            <Facebook size={16} color="#ffffff" fill="#ffffff" className="stroke-[1] h-[18px] w-[18px]" />
          </SocialIcon>

          {/* YouTube */}
          <SocialIcon bgColor="#FF0000" href="https://www.youtube.com/@DailyDestinyBD">
            <Youtube size={16} color="#FF0000" fill="#ffffff" className="stroke-[1] h-[18px] w-[18px]" />
          </SocialIcon>

          {/* LinkedIn */}
          <SocialIcon bgColor="#0A66C2" href="https://linkedin.com">
            <Linkedin size={16} color="#ffffff" fill="#ffffff" className="stroke-[1] h-[18px] w-[18px]" />
          </SocialIcon>

          {/* Facebook Group */}
          <SocialIcon bgColor="#1877F2" href="https://facebook.com/groups">
            <Users size={16} color="#ffffff" className="stroke-[2] h-[18px] w-[18px]" />
          </SocialIcon>

          {/* TikTok */}
          <SocialIcon bgColor="#000000" href="https://tiktok.com">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 md:h-4 md:w-4" fill="#ffffff">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.61 4.18 1.15 1.21 2.76 1.93 4.41 2.02v3.62c-1.68-.03-3.32-.57-4.68-1.57-.18-.13-.34-.28-.5-.43v6.33c.03 2.87-1.4 5.63-3.89 7.07-2.73 1.63-6.29 1.41-8.79-.54-2.58-1.95-3.64-5.39-2.54-8.5 1.01-2.99 3.94-5.07 7.13-5.05.12 0 .24 0 .36.01v3.74c-1.3-.12-2.6.43-3.41 1.45-.96 1.16-1.12 2.84-.41 4.17.67 1.34 2.14 2.13 3.64 1.94 1.52-.14 2.76-1.34 2.96-2.85.04-.31.05-.62.05-.93V.02z" />
            </svg>
          </SocialIcon>
        </div>

        {/* Row 2: Bottom 3 Icons */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3">
          {/* WhatsApp */}
          <SocialIcon bgColor="#25D366" href="https://wa.me/yournumber">
            <svg viewBox="0 0 24 24" className="h-4 w-4 md:h-[18px] md:w-[18px]" fill="#ffffff">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.66.986 3.292 1.481 4.757 1.482 5.327 0 9.663-4.329 9.665-9.645.001-2.577-1.002-5.001-2.822-6.822-1.82-1.82-4.244-2.822-6.824-2.823-5.332 0-9.669 4.33-9.672 9.648-.001 1.55.422 3.064 1.223 4.385l-.973 3.553 3.646-.956zM17.41 14.39c-.314-.157-1.857-.916-2.143-1.02-.287-.104-.496-.157-.704.157-.208.313-.807 1.02-1.01 1.25-.202.23-.404.26-.718.103-1.385-.694-2.43-1.226-3.394-2.875-.253-.432.253-.4.723-1.343.078-.157.039-.294-.02-.41-.058-.117-.496-1.196-.679-1.64-.179-.43-.362-.372-.496-.372l-.423-.008c-.147 0-.387.055-.589.274-.202.219-.77.752-.77 1.833 0 1.08.788 2.124.898 2.274.11.15 1.55 2.366 3.753 3.32.524.227.933.363 1.253.465.527.168 1.006.144 1.384.088.422-.062 1.857-.76 2.119-1.458.262-.697.262-1.294.183-1.42-.078-.125-.287-.203-.6-.36z" />
            </svg>
          </SocialIcon>

          {/* Pinterest */}
          <SocialIcon bgColor="#BD081C" href="https://pinterest.com">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 md:h-4 md:w-4" fill="#ffffff">
              <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.091.377-.293 1.194-.332 1.358-.052.211-.174.256-.401.151-1.495-.696-2.43-2.882-2.43-4.636 0-3.774 2.743-7.24 7.907-7.24 4.152 0 7.379 2.959 7.379 6.913 0 4.123-2.599 7.44-6.207 7.44-1.212 0-2.35-.63-2.74-1.373l-.748 2.848c-.27 1.039-1.001 2.342-1.488 3.132C10.166 23.889 11.066 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
            </svg>
          </SocialIcon>

          {/* Instagram */}
          <SocialIcon bgColor="#E1306C" href="https://instagram.com">
            <Instagram size={16} color="#ffffff" className="stroke-[2] md:h-[18px] md:w-[18px]" />
          </SocialIcon>

          {/* Google News */}
          <SocialIcon bgColor="#4285F4" href="https://news.google.com">
            <Newspaper size={16} color="#ffffff" className="stroke-[2] md:h-[18px] md:w-[18px]" />
          </SocialIcon>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════
  // স্ট্যান্ডার্ড সিঙ্গেল-লাইন লেআউট (Navbar View with Desktop Support)
  // ════════════════════════════════════════════════
  return (
    <>
      <div className="relative flex items-center gap-1.5 md:gap-2.5">
        {/* ১. মোস্ট ইম্পর্ট্যান্ট ৩টি আইকন (সবখানেই দেখাবে) */}
        <SocialIcon bgColor="#1877F2" href="https://www.facebook.com/DailyDestinyBD">
          <Facebook size={16} color="#ffffff" fill="#ffffff" className="stroke-[1] md:h-[18px] md:w-[18px]" />
        </SocialIcon>

        <SocialIcon bgColor="#FF0000" href="https://www.youtube.com/@DailyDestinyBD">
          <Youtube size={16} color="#FF0000" fill="#ffffff" className="stroke-[1] md:h-[18px] md:w-[18px]" />
        </SocialIcon>

        <SocialIcon bgColor="#0A66C2" href="https://linkedin.com">
          <Linkedin size={16} color="#ffffff" fill="#ffffff" className="stroke-[1] md:h-[18px] md:w-[18px]" />
        </SocialIcon>

        {/* ২. বাকি আইকনগুলো (ডেস্কটপে সিঙ্গেল লাইনে থাকবে, মোবাইলে হাইড) */}
        <div className="hidden md:block">
          <SocialIcon bgColor="#1877F2" href="https://facebook.com/groups">
            <Users size={16} color="#ffffff" className="stroke-[2] md:h-[18px] md:w-[18px]" />
          </SocialIcon>
        </div>

        <div className="hidden md:block">
          <SocialIcon bgColor="#000000" href="https://tiktok.com">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 md:h-4 md:w-4" fill="#ffffff">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.61 4.18 1.15 1.21 2.76 1.93 4.41 2.02v3.62c-1.68-.03-3.32-.57-4.68-1.57-.18-.13-.34-.28-.5-.43v6.33c.03 2.87-1.4 5.63-3.89 7.07-2.73 1.63-6.29 1.41-8.79-.54-2.58-1.95-3.64-5.39-2.54-8.5 1.01-2.99 3.94-5.07 7.13-5.05.12 0 .24 0 .36.01v3.74c-1.3-.12-2.6.43-3.41 1.45-.96 1.16-1.12 2.84-.41 4.17.67 1.34 2.14 2.13 3.64 1.94 1.52-.14 2.76-1.34 2.96-2.85.04-.31.05-.62.05-.93V.02z" />
            </svg>
          </SocialIcon>
        </div>

        <div className="hidden md:block">
          <SocialIcon bgColor="#25D366" href="https://wa.me/yournumber">
            <svg viewBox="0 0 24 24" className="h-4 w-4 md:h-[18px] md:w-[18px]" fill="#ffffff">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.66.986 3.292 1.481 4.757 1.482 5.327 0 9.663-4.329 9.665-9.645.001-2.577-1.002-5.001-2.822-6.822-1.82-1.82-4.244-2.822-6.824-2.823-5.332 0-9.669 4.33-9.672 9.648-.001 1.55.422 3.064 1.223 4.385l-.973 3.553 3.646-.956zM17.41 14.39c-.314-.157-1.857-.916-2.143-1.02-.287-.104-.496-.157-.704.157-.208.313-.807 1.02-1.01 1.25-.202.23-.404.26-.718.103-1.385-.694-2.43-1.226-3.394-2.875-.253-.432.253-.4.723-1.343.078-.157.039-.294-.02-.41-.058-.117-.496-1.196-.679-1.64-.179-.43-.362-.372-.496-.372l-.423-.008c-.147 0-.387.055-.589.274-.202.219-.77.752-.77 1.833 0 1.08.788 2.124.898 2.274.11.15 1.55 2.366 3.753 3.32.524.227.933.363 1.253.465.527.168 1.006.144 1.384.088.422-.062 1.857-.76 2.119-1.458.262-.697.262-1.294.183-1.42-.078-.125-.287-.203-.6-.36z" />
            </svg>
          </SocialIcon>
        </div>

        <div className="hidden lg:block">
          <SocialIcon bgColor="#BD081C" href="https://pinterest.com">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 md:h-4 md:w-4" fill="#ffffff">
              <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.091.377-.293 1.194-.332 1.358-.052.211-.174.256-.401.151-1.495-.696-2.43-2.882-2.43-4.636 0-3.774 2.743-7.24 7.907-7.24 4.152 0 7.379 2.959 7.379 6.913 0 4.123-2.599 7.44-6.207 7.44-1.212 0-2.35-.63-2.74-1.373l-.748 2.848c-.27 1.039-1.001 2.342-1.488 3.132C10.166 23.889 11.066 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
            </svg>
          </SocialIcon>
        </div>

        <div className="hidden md:block">
          <SocialIcon bgColor="#E1306C" href="https://instagram.com">
            <Instagram size={16} color="#ffffff" className="stroke-[2] md:h-[18px] md:w-[18px]" />
          </SocialIcon>
        </div>

        <div className="hidden md:block">
          <SocialIcon bgColor="#4285F4" href="https://news.google.com">
            <Newspaper size={16} color="#ffffff" className="stroke-[2] md:h-[18px] md:w-[18px]" />
          </SocialIcon>
        </div>

        {/* ৩. "More" বাটন (শুধু মোবাইল স্ক্রিনের সাধারণ নেভবারে দেখাবে) */}
        <button
          onClick={() => setIsPopupOpen(!isPopupOpen)}
          className="md:hidden w-9 h-9 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-transform active:scale-95 text-white shadow-sm"
          aria-label="Show more social links"
        >
          {isPopupOpen ? <X size={18} /> : <MoreHorizontal size={18} />}
        </button>
      </div>

      {/* ৪. মোবাইল পপ-আপ ওভারলে মেনু */}
      {mounted && isPopupOpen
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center md:hidden pointer-events-auto">
              <div
                onClick={() => setIsPopupOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
              />

              <div
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 bg-white border border-gray-200 rounded-[24px] p-8 pt-10 shadow-2xl flex flex-col items-center gap-5 animate-in fade-in zoom-in-75 slide-in-from-bottom-4 duration-300 ease-out"
              >
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>

                {/* Row 1: Top 5 Icons */}
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <SocialIcon bgColor="#1877F2" href="https://facebook.com/groups">
                    <Users size={18} color="#ffffff" className="stroke-[2]" />
                  </SocialIcon>

                  <SocialIcon bgColor="#000000" href="https://tiktok.com">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#ffffff">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.61 4.18 1.15 1.21 2.76 1.93 4.41 2.02v3.62c-1.68-.03-3.32-.57-4.68-1.57-.18-.13-.34-.28-.5-.43v6.33c.03 2.87-1.4 5.63-3.89 7.07-2.73 1.63-6.29 1.41-8.79-.54-2.58-1.95-3.64-5.39-2.54-8.5 1.01-2.99 3.94-5.07 7.13-5.05.12 0 .24 0 .36.01v3.74c-1.3-.12-2.6.43-3.41 1.45-.96 1.16-1.12 2.84-.41 4.17.67 1.34 2.14 2.13 3.64 1.94 1.52-.14 2.76-1.34 2.96-2.85.04-.31.05-.62.05-.93V.02z" />
                    </svg>
                  </SocialIcon>

                  <SocialIcon bgColor="#25D366" href="https://wa.me/yournumber">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#ffffff">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.66.986 3.292 1.481 4.757 1.482 5.327 0 9.663-4.329 9.665-9.645.001-2.577-1.002-5.001-2.822-6.822-1.82-1.82-4.244-2.822-6.824-2.823-5.332 0-9.669 4.33-9.672 9.648-.001 1.55.422 3.064 1.223 4.385l-.973 3.553 3.646-.956zM17.41 14.39c-.314-.157-1.857-.916-2.143-1.02-.287-.104-.496-.157-.704.157-.208.313-.807 1.02-1.01 1.25-.202.23-.404.26-.718.103-1.385-.694-2.43-1.226-3.394-2.875-.253-.432.253-.4.723-1.343.078-.157.039-.294-.02-.41-.058-.117-.496-1.196-.679-1.64-.179-.43-.362-.372-.496-.372l-.423-.008c-.147 0-.387.055-.589.274-.202.219-.77.752-.77 1.833 0 1.08.788 2.124.898 2.274.11.15 1.55 2.366 3.753 3.32.524.227.933.363 1.253.465.527.168 1.006.144 1.384.088.422-.062 1.857-.76 2.119-1.458.262-.697.262-1.294.183-1.42-.078-.125-.287-.203-.6-.36z" />
                    </svg>
                  </SocialIcon>

                  <SocialIcon bgColor="#BD081C" href="https://pinterest.com">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#ffffff">
                      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.091.377-.293 1.194-.332 1.358-.052.211-.174.256-.401.151-1.495-.696-2.43-2.882-2.43-4.636 0-3.774 2.743-7.24 7.907-7.24 4.152 0 7.379 2.959 7.379 6.913 0 4.123-2.599 7.44-6.207 7.44-1.212 0-2.35-.63-2.74-1.373l-.748 2.848c-.27 1.039-1.001 2.342-1.488 3.132C10.166 23.889 11.066 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                    </svg>
                  </SocialIcon>

                  <SocialIcon bgColor="#E1306C" href="https://instagram.com">
                    <Instagram size={18} color="#ffffff" className="stroke-[2]" />
                  </SocialIcon>
                </div>

                {/* Row 2: Bottom 1 Icon Centered */}
                <div className="flex items-center justify-center gap-3">
                  <SocialIcon bgColor="#4285F4" href="https://news.google.com">
                    <Newspaper size={18} color="#ffffff" className="stroke-[2]" />
                  </SocialIcon>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}