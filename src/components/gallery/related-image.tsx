import React from "react";
import Image from "next/image";
// import { formatRelativeTime } from "@/utils/date-formatter";
import { Article } from "@/lib/types";

interface IProps {
  item: Article;
}

export default function ImageCard({ item }: IProps) {

  return (
    <div className="group cursor-pointer overflow-hidden rounded-2xl bg-[#F8F9FA] p-3 transition-all hover:shadow-md">
      {/* Image Container */}
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl">
        <Image
          src={item.coverImage || item.medias?.[0]?.url || "/placeholder.jpg"}
          alt={item.medias?.[0]?.caption || item.title}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content Section */}
      <div className="mt-3 space-y-1 px-1">
        {/* <p className="text-sm font-medium text-[#B37B2F]">
          {formatRelativeTime(item.date)}
        </p> */}
        <h3 className="line-clamp-2 text-xs md:text-base font-semibold text-[#1A1A1A] transition-colors group-hover:text-blue-600">
          {item.title}
        </h3>
      </div>
    </div>
  );
}
