"use client";

import { ArrowRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MarketPrice } from "@/lib/types";


export default function MarketPriceWidget({
  marketPricing,
}: {
  marketPricing: MarketPrice[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!marketPricing || marketPricing.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % marketPricing.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [marketPricing, marketPricing?.length]);

  // Safe fallback if index parsing executes while array is still mounting
  const currentItem = marketPricing?.[index];

  return (
    <div className="flex items-center h-full w-full p-3 border-x border-gray-100 bg-gray-50/50 select-none">
      <div className="relative overflow-hidden w-full h-full flex items-center">
        {marketPricing && marketPricing.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 h-full"
            >
              {/* Image Box Container */}
              <div className="w-10 h-8 shrink-0 flex items-center justify-center overflow-hidden bg-white border border-gray-100 rounded">
                <img
                  src={currentItem?.image || "https://placehold.co/48x40?text=ERR"}
                  alt={currentItem?.titleBn || currentItem?.title || ""}
                  className="object-contain w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/48x40?text=ERR";
                  }}
                />
              </div>

              {/* Product Details Section */}
              <div className="flex flex-col justify-center min-w-[75px]">
                <div className="flex items-center gap-1">
                  <span className="w-[3px] h-3 bg-[#C91F26] rounded-xs block shrink-0" />
                  <h3 className="text-xs font-bold text-gray-800 leading-none">
                    {currentItem?.titleBn || currentItem?.title || ""}
                  </h3>
                </div>
                <p className="text-xs font-black text-[#1e3a8a] mt-0.5 leading-none">
                  {currentItem?.priceRange || ""}
                </p>
              </div>

              {/* Compact Right Arrow Navigation */}
              <Link
                href="/pricing"
                className="flex items-center justify-center p-1 rounded-full text-gray-400 hover:text-[#C91F26] transition-colors ml-1 shrink-0"
                title="বিস্তারিত"
              >
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </motion.div>
          </AnimatePresence>
        ) : (
          /* Smooth Pulse loader to prevent layout shifts while Vercel awaits the data */
          <div className="flex items-center gap-2 h-full animate-pulse w-full">
            <div className="w-10 h-8 bg-gray-200 rounded" />
            <div className="flex-1 space-y-1">
              <div className="h-2 bg-gray-200 rounded w-16" />
              <div className="h-2 bg-gray-200 rounded w-12" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// export default function MarketPriceWidget({
//   marketPricing,
// }: {
//   marketPricing: MarketPrice[];
// }) {
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     if (!marketPricing || marketPricing.length === 0) return;
//     const timer = setInterval(() => {
//       setIndex((prevIndex) => (prevIndex + 1) % marketPricing.length);
//     }, 3000);
//     return () => clearInterval(timer);
//   }, [marketPricing, marketPricing?.length]);

//   if (!marketPricing || marketPricing.length === 0) return null;

//   const currentItem = marketPricing[index];

//   return (
//     <div className="flex items-center h-full p-3 border-x border-gray-100 bg-gray-50/50 select-none">
//       <div className="relative overflow-hidden w-full h-full flex items-center">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: 5 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -5 }}
//             transition={{ duration: 0.3 }}
//             className="flex items-center gap-3 h-full"
//           >
//             {/* Image Box Container */}
//             <div className="w-10 h-8 shrink-0 flex items-center justify-center overflow-hidden bg-white border border-gray-100 rounded">
//               <img
//                 src={currentItem?.image || "https://placehold.co/48x40?text=ERR"}
//                 alt={currentItem?.titleBn || currentItem?.title || ""}
//                 className="object-contain w-full h-full"
//                 onError={(e) => {
//                   (e.target as HTMLImageElement).src = "https://placehold.co/48x40?text=ERR";
//                 }}
//               />
//             </div>

//             {/* Product Details Section */}
//             <div className="flex flex-col justify-center min-w-[75px]">
//               <div className="flex items-center gap-1">
//                 {/* Red Badge Indicator */}
//                 <span className="w-[3px] h-3 bg-[#C91F26] rounded-xs block shrink-0" />
//                 <h3 className="text-xs font-bold text-gray-800 leading-none">
//                   {currentItem?.titleBn || currentItem?.title || ""}
//                 </h3>
//               </div>
//               <p className="text-xs font-black text-[#1e3a8a] mt-0.5 leading-none">
//                 {currentItem?.priceRange || ""}
//               </p>
//             </div>

//             {/* Compact Right Arrow Navigation */}
//             <Link
//               href="/pricing"
//               className="flex items-center justify-center p-1 rounded-full text-gray-400 hover:text-[#C91F26] transition-colors ml-1 shrink-0"
//               title="বিস্তারিত"
//             >
//               <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
//             </Link>
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { ArrowRight } from "lucide-react";
// import { useTranslations } from "next-intl";
// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// import Link from "next/link";
// import { MarketPrice } from "@/lib/types";

// export default function MarketPriceWidget({
//   marketPricing,
// }: {
//   marketPricing: MarketPrice[];
// }) {
//   const tArticle = useTranslations("article");
//   const tCommon = useTranslations("common");
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     if (!marketPricing || marketPricing.length === 0) return;
//     const timer = setInterval(() => {
//       setIndex((prevIndex) => (prevIndex + 1) % marketPricing.length);
//     }, 3000);
//     return () => clearInterval(timer);
//   }, [marketPricing, marketPricing?.length]);

//   if (!marketPricing || marketPricing.length === 0) {
//     return (
//       <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 lg:space-y-3">
//         {/* Header */}
//         <div className="flex justify-between items-center border-l-4 border-primary pl-3">
//           <h2 className="text-xl font-bold text-gray-800">
//             {tArticle("bazarPricing")}
//           </h2>
//           <Link
//             href="/pricing"
//             className="flex items-center gap-1 text-primary cursor-pointer hover:underline"
//           >
//             <span className="text-sm font-medium">{tArticle("more")}</span>
//             <ArrowRight className="w-4 h-4" />
//           </Link>
//         </div>

//         <div className="py-8 flex items-center justify-center">
//           <p className="text-sm font-medium text-gray-500">{tCommon("noDataAvailable")}</p>
//         </div>
//       </div>
//     );
//   }

//   const currentItem = marketPricing[index];
//   return (
//     <div className="p-1 bg-white  border-gray-100 lg:space-y-3">


//       {/* Carousel Area */}
//       <div className="relative overflow-hidden">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, x: 10 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -10 }}
//             transition={{ duration: 0.5 }}
//             className="flex items-center gap-3"
//           >
//             {/* img Section */}
//             <div className="relative w-15 h-15 aspect-square rounded-xl shrink-0 overflow-hidden">
//               <img
//                 src={
//                   currentItem?.image || "https://placehold.co/200x200"
//                 }
//                 alt={currentItem?.title || ""}
//                 className="object-contain w-3/4 aspect-square rounded-xl p-2"
//               />
//             </div>

//             {/* Info Section */}
//             <div className="flex flex-col gap-1">
//               <h3 className="text-sm font-semibold text-gray-700">
//                 {currentItem?.title || ""}{" "}
//               </h3>
//               <p className="text-xs font-medium text-gray-900">
//                 {currentItem?.priceRange || ""}{" "}
//               </p>
//             </div>
//             <div className="h-24 flex items-center justify-center">
//               <Link
//                 href="/pricing"
//                 className="flex items-center gap-1 text-primary cursor-pointer hover:underline"
//               >
//                 <span className="text-xs font-medium">{tArticle("more")}</span>
//                 <ArrowRight className="w-3 h-3" />
//               </Link>
//             </div>
//           </motion.div>
//         </AnimatePresence>

//       </div>
//     </div>
//   );
// }
