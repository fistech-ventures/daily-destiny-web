// import React from 'react';
// import { SAMPLE_PAGES } from './PaperSlider';

// interface MainPageProps {
//   activeIndex: number;
// }

// const MainPage: React.FC<MainPageProps> = ({ activeIndex }) => {
//   const currentPage = SAMPLE_PAGES[activeIndex];

//   // Safeguard in case data mapping fails temporarily
//   if (!currentPage) return null;

//   return (
//     /* 💡 Wrap directly in the layout container instead of an unstyled parent div 
//           to keep Next.js/Tailwind's height metrics unbroken */
//     <div className="w-full max-w-4xl h-full flex justify-center items-center bg-white shadow-2xl rounded-sm overflow-auto border border-gray-200">
//       <img 
//         src={currentPage.fullImage} 
//         alt={`Page ${currentPage.pageNumber}`} 
//         className="max-w-full max-h-full object-contain pointer-events-none"
//       />
//     </div>
//   );
// };

// export default MainPage;
import React, { useState, useRef } from 'react';
import { SAMPLE_PAGES } from './PaperSlider';

interface MainPageProps {
  activeIndex: number;
}

const MainPage: React.FC<MainPageProps> = ({ activeIndex }) => {
  const currentPage = SAMPLE_PAGES[activeIndex];
  const containerRef = useRef<HTMLDivElement>(null);

  // States to manage zoom visibility and coordinate positions
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  if (!currentPage) return null;
  const uniquePageId = `5049${currentPage.id}`;

  // Handle calculation for the 4x magnification position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Calculate cursor percentage coordinates relative to the container boundaries
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPos({ x, y });
  };

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
      className="w-full max-w-4xl h-full flex justify-center items-center bg-white shadow-2xl rounded-sm overflow-hidden border border-gray-200 relative cursor-zoom-in"
      id={`image_layer_${uniquePageId}`}
      data-pgids={uniquePageId}
    >
      {/* 1. Base Image Layer (Normal Display View) */}
      <img 
        id={`pg_id_${uniquePageId}`}
        src={currentPage.fullImage} 
        alt={`Page ${currentPage.pageNumber}`} 
        className={`max-w-full max-h-full object-contain pointer-events-none transition-opacity duration-200 ${
          isZoomed ? 'opacity-0' : 'opacity-100'
        }`}
        data-page-id={uniquePageId}
        data-pageno={currentPage.pageNumber}
        data-pgname={currentPage.section}
        data-sequence={currentPage.id}
      />

      {/* 2. 4x Zoomed-In Overlay Layer */}
      {isZoomed && (
        <div 
          className="absolute inset-0 w-full h-full bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: `url(${currentPage.fullImage})`,
            backgroundSize: '400%', // 💡 Sets the precise 4x zoom level
            backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`, // Focus tracking
          }}
        />
      )}
    </div>
  );
};

export default MainPage;