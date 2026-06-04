import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";


interface ImageStorySidebarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  images: any[];
  t: (key: string) => string;
}

export default function VideoSidebar({ images, t }: ImageStorySidebarProps) {
  return (
    <aside className="flex flex-col gap-8">
      <div>
        <div className="flex justify-between items-center border-l-4 border-primary pl-4 mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
            {t("imagePageTitle")}
          </h2>
          <Link
            href="/gallery"
            className="flex items-center gap-1 text-gray-500 hover:text-primary transition-colors group"
          >
            <span className="text-sm font-semibold">{t("more")}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="bg-primary/40 rounded-md p-3 border-2 shadow-sm flex flex-col gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {images.slice(0, 5).map((image: any) => (
            <div key={image.id} className="">
              <Link href={`/gallery/${image.code}`} className="group flex gap-4 items-center">
                <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-white shadow-sm">
                  <img 
                    width={100}
                    height={100}
                    src={image.images?.[0]?.url || "/placeholder.jpg"}
                    alt={image.title}
                    className="w-full h-full object-contain transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-primary" />
                    </div>
                  </div>
                </div>
                <h3 className="text-base font-bold text-gray-900 line-clamp-3 leading-snug group-hover:text-primary transition-colors">
                  {image.title}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
