import React from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { VideoArticle } from "@/lib/api";
// import { formatRelativeTime } from "@/utils/date-formatter";

interface VideoCardProps {
  video: VideoArticle;
  variant?: "default" | "small" | "featured"| "slider";
}

const getThumbnail = (video: VideoArticle): string => {
  if (video.source === "youtube" && video.key) {
    return `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`;
  }
  return video.coverImage || "/placeholder.jpg";
};

export default function VideoCard({
  video,
  variant = "default",
}: VideoCardProps) {
  const thumbnail = video.coverImage || getThumbnail(video);
  const isFeatured = variant === "featured";
  const isSlider = variant === "slider";

  return (
    <Link href={`/video/${video.slug}`} className="group block w-full">
      <div className={`flex flex-col ${isFeatured ? "gap-4" : isSlider ? "gap-2" : variant === "small" ? "gap-2" : "gap-3"}`}>
        <div
          className={`relative aspect-video w-full overflow-hidden rounded-md shadow-sm border border-gray-100 ${isFeatured ? "ring-1 ring-gray-100 shadow-md" : ""}`}
        >
          <img
            src={thumbnail}
            alt={video.title}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            sizes={
              isFeatured
                ? "(max-width: 1024px) 100vw, 800px"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            }
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`flex items-center justify-center rounded-full bg-white/90 shadow-xl transition-all duration-300 group-hover:bg-white group-hover:scale-110 ${variant === "small" ? "h-10 w-10" : isFeatured ? "h-16 w-16" : "h-12 w-12"}`}
            >
              <Play
                className={`fill-primary text-primary ${variant === "small" ? "h-5 w-5 ml-0.5" : isFeatured ? "h-8 w-8 ml-1.5" : "h-6 w-6 ml-1"}`}
              />
            </div>
          </div>
        </div>

        <div className={`flex flex-col gap-1.5 ${isFeatured ? "px-0" : "px-1"}`}>
          {/* Video Title */}
          <h3
            className={`font-bold leading-[1.3] text-gray-900 transition-colors duration-200 group-hover:text-primary ${
              isFeatured ? "text-lg lg:text-2xl" : variant === "small" ? "text-base" : "text-lg md:text-xl"
            }`}
          >
            {video.title}
          </h3>

          <p className="text-sm font-medium leading-normal text-gray-600 transition-colors">
            {video.excerpt}
          </p>

          {/* FIXED: Formatted Date */}
          <p className="text-xs text-gray-400 font-medium">
            {new Date(video.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </Link>
  );
}



// import React from "react";
// import Link from "next/link";
// import { Play } from "lucide-react";
// import { VideoArticle } from "@/lib/api";

// interface VideoCardProps {
//   video: VideoArticle;
//   variant?: "default" | "small" | "featured" | "slider";
// }

// const getThumbnail = (video: VideoArticle): string => {
//   if (video.source === "youtube" && video.key) {
//     return `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`;
//   }
//   return video.coverImage || "/placeholder.jpg";
// };

// export default function VideoCard({
//   video,
//   variant = "default",
// }: VideoCardProps) {
//   const thumbnail = video.coverImage || getThumbnail(video);
//   const isFeatured = variant === "featured";
//   const isSlider = variant === "slider";

//   return (
//     <Link href={`/video/${video.slug}`} className="group block w-full">
//       <div className={`flex flex-col ${isFeatured ? "gap-4" : isSlider ? "gap-2" : variant === "small" ? "gap-2" : "gap-3"}`}>
        
//         {/* Thumbnail Container */}
//         <div
//           className={`relative w-full overflow-hidden rounded-md transition-shadow duration-300
//             ${isSlider ? "aspect-[4/3] shadow-sm border border-gray-100" : "aspect-video"}
//             ${isFeatured ? "ring-1 ring-gray-100 shadow-md" : "shadow-sm border border-gray-100"}
//           `}
//         >
//           <img
//             src={thumbnail}
//             alt={video.title}
//             className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
//             sizes={
//               isFeatured
//                 ? "(max-width: 1024px) 100vw, 800px"
//                 : isSlider
//                 ? "280px"
//                 : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
//             }
//           />
          
//           {/* Play Icon Layout Customization */}
//           {isSlider ? (
//             /* Top-Left Red Play Button mimicking the reference screenshot */
//             <div className="absolute top-2 left-2 z-10 flex items-center justify-center h-7 w-7 rounded-full bg-red-600 shadow-md ring-2 ring-white transition-transform group-hover:scale-110">
//               <Play className="fill-white text-white h-3.5 w-3.5 ml-0.5" />
//             </div>
//           ) : (
//             /* Center-aligned default play icon overlay */
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div
//                 className={`flex items-center justify-center rounded-full bg-white/90 shadow-xl transition-all duration-300 group-hover:bg-white group-hover:scale-110 ${
//                   variant === "small" ? "h-10 w-10" : isFeatured ? "h-16 w-16" : "h-12 w-12"
//                 }`}
//               >
//                 <Play
//                   className={`fill-primary text-primary ${
//                     variant === "small" ? "h-5 w-5 ml-0.5" : isFeatured ? "h-8 w-8 ml-1.5" : "h-6 w-6 ml-1"
//                   }`}
//                 />
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Text Section */}
//         <div className={`flex flex-col gap-1.5 ${isFeatured ? "px-0" : "px-1"}`}>
//           {/* Title */}
//           <h3
//             className={`font-bold leading-[1.4] text-gray-900 transition-colors duration-200 group-hover:text-red-600 text-center
//               ${isSlider ? "text-base line-clamp-2 min-h-[2.8rem]" : isFeatured ? "text-lg lg:text-2xl" : variant === "small" ? "text-base" : "text-lg md:text-xl"}
//             `}
//           >
//             {video.title}
//           </h3>

//           {/* Description Excerpt & Meta Info for Slider view */}
//           {isSlider && (
//             <div className="flex flex-col gap-2 mt-1">
//               {/* Fallback to summary property or fallback excerpt text */}
//               <p className="text-sm text-gray-600 text-center line-clamp-3 leading-relaxed">
//                 {video.summary || video.description || ""}
//               </p>
//               {video.date && (
//                 <span className="text-xs text-gray-400 text-center mt-1">
//                   {/* formatRelativeTime(video.date) */}
//                   ৫ ঘণ্টা আগে
//                 </span>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </Link>
//   );
// }