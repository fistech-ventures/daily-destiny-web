"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MainPage from './MainPage';

// 💡 Export the pages array so other files can import it cleanly
export const SAMPLE_PAGES = [
  { id: 1, pageNumber: '১', section: 'প্রধান পাতা', thumbnail: '/daily-destiny-e-paper/1.jpg', fullImage: '/daily-destiny-e-paper/1.jpg' },
  { id: 2, pageNumber: '২', section: 'পাতা ২', thumbnail: '/daily-destiny-e-paper/2.jpg', fullImage: '/daily-destiny-e-paper/2.jpg' },
  { id: 3, pageNumber: '৩', section: 'পাতা ৩', thumbnail: '/daily-destiny-e-paper/3.jpg', fullImage: '/daily-destiny-e-paper/3.jpg' },
  { id: 4, pageNumber: '৪', section: 'পাতা ৪', thumbnail: '/daily-destiny-e-paper/4.jpg', fullImage: '/daily-destiny-e-paper/4.jpg' },
  { id: 5, pageNumber: '৫', section: 'পাতা ৫', thumbnail: '/daily-destiny-e-paper/5.jpg', fullImage: '/daily-destiny-e-paper/5.jpg' },
  { id: 6, pageNumber: '৬', section: 'পাতা ৬', thumbnail: '/daily-destiny-e-paper/6.jpg', fullImage: '/daily-destiny-e-paper/6.jpg' },
  { id: 7, pageNumber: '৭', section: 'পাতা ৭', thumbnail: '/daily-destiny-e-paper/7.jpg', fullImage: '/daily-destiny-e-paper/7.jpg' },
  { id: 8, pageNumber: '৮', section: 'পাতা ৮', thumbnail: '/daily-destiny-e-paper/8.jpg', fullImage: '/daily-destiny-e-paper/8.jpg' },
  { id: 9, pageNumber: '৯', section: 'ব্ল্যাক CTP (০২-০৭)', thumbnail: '/daily-destiny-e-paper/Page%2002-07%20Black%20CTP.jpg', fullImage: '/daily-destiny-e-paper/Page%2002-07%20Black%20CTP.jpg' },
  { id: 10, pageNumber: '১০', section: 'কালার CTP (০৪-০৫)', thumbnail: '/daily-destiny-e-paper/Page%2004-05%20Colour%20CTP.jpg', fullImage: '/daily-destiny-e-paper/Page%2004-05%20Colour%20CTP.jpg' },
  { id: 11, pageNumber: '১১', section: 'কালার CTP (০৬-০৩)', thumbnail: '/daily-destiny-e-paper/Page%2006-03%20Colour%20CTP.jpg', fullImage: '/daily-destiny-e-paper/Page%2006-03%20Colour%20CTP.jpg' },
  { id: 12, pageNumber: '১২', section: 'CTP পাতা ২ (০৮-০১)', thumbnail: '/daily-destiny-e-paper/Page%2008-01%20CTP%202.jpg', fullImage: '/daily-destiny-e-paper/Page%2008-01%20CTP%202.jpg' },
];

const PaperSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (activeIndex < SAMPLE_PAGES.length - 1) setActiveIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (activeIndex > 0) setActiveIndex(prev => prev - 1);
  };

  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const activeThumb = thumbnailContainerRef.current.children[activeIndex];
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeIndex]);

  return (
    <div className="flex flex-col h-screen bg-[#f4f4f4] text-gray-800 select-none">
      
      {/* 1. TOP BAR / HEADER */}
      <div className="flex items-center justify-between px-6 py-2 bg-white shadow-sm border-b">
        <span className="text-sm font-semibold text-gray-600">
          {SAMPLE_PAGES[activeIndex].section} (পৃষ্ঠা: {SAMPLE_PAGES[activeIndex].pageNumber})
        </span>
        <div className="text-xs text-gray-400">E-Paper Viewer</div>
      </div>

      {/* 2. MAIN VIEW AREA */}
      <div className="relative flex-1 flex items-center justify-center px-6 md:px-16 lg:px-24 py-10 overflow-hidden">
        
        <button 
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className={`absolute left-4 md:left-6 z-10 p-3 rounded-full bg-red-600 text-white shadow-lg transition-all ${
            activeIndex === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-red-700 active:scale-95'
          }`}
        >
          <ChevronLeft size={24} />
        </button>

        {/* 💡 Pass down activeIndex as a prop */}
        <MainPage activeIndex={activeIndex} />

        <button 
          onClick={handleNext}
          disabled={activeIndex === SAMPLE_PAGES.length - 1}
          className={`absolute right-4 md:right-6 z-10 p-3 rounded-full bg-red-600 text-white shadow-lg transition-all ${
            activeIndex === SAMPLE_PAGES.length - 1 ? 'opacity-0 pointer-events-none' : 'hover:bg-red-700 active:scale-95'
          }`}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* 3. BOTTOM THUMBNAIL STRIP */}
      <div className="bg-[#2a2a2a] p-4 border-t border-gray-700">
        <div 
          ref={thumbnailContainerRef}
          className="flex gap-3 overflow-x-auto py-2 px-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent scroll-smooth snap-x"
          style={{ scrollbarWidth: 'thin' }}
        >
          {SAMPLE_PAGES.map((page, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={page.id}
                onClick={() => setActiveIndex(index)}
                className={`flex-none w-20 md:w-24 cursor-pointer snap-center transition-all duration-200 ${
                  isActive ? 'scale-105' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <div className={`relative aspect-[2/3] bg-gray-800 rounded border-2 overflow-hidden ${
                  isActive ? 'border-red-500 shadow-lg shadow-red-500/20' : 'border-transparent'
                }`}>
                  <img src={page.thumbnail} alt={`Thumb ${page.pageNumber}`} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-[10px] text-white text-center py-0.5 truncate px-1">
                    {page.pageNumber} : {page.section}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default PaperSlider;