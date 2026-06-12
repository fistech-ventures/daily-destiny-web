// "use client";

// import React from "react";
// import { SAMPLE_PAGES } from "./PaperSlider";

// interface MainPageProps {
//   activeIndex: number;
// }

// const MainPage: React.FC<MainPageProps> = ({ activeIndex }) => {
//   const currentPage = SAMPLE_PAGES[activeIndex];

//   if (!currentPage) return null;

//   return (
//     /* 1. h-full overflow-y-auto allows independent internal scrolling.
//       2. 'scrollbar-none' (or standard hidden properties) strips away the visual scrollbar line.
//     */
//     <div className="w-full h-full overflow-y-auto bg-gray-100 rounded-lg [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
//       {/* By setting max-w-4xl or max-w-5xl, the image renders at a massive high-res width,
//         which naturally forces the height to extend up to 3x the container height.
//       */}
//       <div className="mx-auto max-w-5xl bg-white shadow-lg my-2">
//         <img
//           src={currentPage.fullImage}
//           alt={`Page ${currentPage.pageNumber}`}
//           className="w-full h-auto select-none"
//           loading="eager"
//           draggable={false}
//         />
//       </div>
//     </div>
//   );
// };

// export default MainPage;
"use client";

import React from "react";
import { SAMPLE_PAGES } from "./PaperSlider";

interface MainPageProps {
  activeIndex: number;
}

const MainPage: React.FC<MainPageProps> = ({ activeIndex }) => {
  const currentPage = SAMPLE_PAGES[activeIndex];

  if (!currentPage) return null;

  return (
    /* - w-full h-full: Locks the reader box cleanly inside the center viewport frame.
      - overflow-y-auto: Keeps scrolling trapped locally inside this container.
      - [scrollbar-width:none]...: Strips visual scrollbars completely.
    */
    <div className="w-full h-full overflow-y-auto bg-gray-100 rounded-lg [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* By forcing the image wrapper block to a massive max-width (e.g., max-w-[1600px] or larger),
        the natural aspect ratio of a newspaper will expand its height up to thousands of pixels.
        Alternatively, you can fix the height explicitly using h-[8500px] if desired.
      */}
      <div className="mx-auto max-w-[1400px] bg-white shadow-lg my-4 flex justify-center">
        <img
          src={currentPage.fullImage}
          alt={`Page ${currentPage.pageNumber}`}
          /* w-full h-auto allows the image to stretch sharply across the desktop width viewport, 
            producing a massive high-res surface area for zooming and reading clear text.
          */
          className="w-full h-auto select-none block"
          loading="eager"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default MainPage;