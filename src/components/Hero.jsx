'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Hero = () => {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    const trimmed = search.trim();
    if (trimmed) {
      router.push(`/city?city=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="relative w-full overflow-hidden">
      <Image
        src="/33114356.jpg"
        alt="RoomMate logo"
        width={1920}
        height={700}
        priority
        className="w-full h-auto"
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white font-sans px-4 w-full">
        <h1 className="text-xl sm:text-3xl md:text-[3.20rem] font-bold mb-5 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.7)] leading-tight">
          The Indian's Number 1 Roomshare Site
        </h1>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-[10px] max-w-2xl mx-auto w-full px-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Search for your looking city"
            className="w-[70%] sm:w-2/3 p-[10px] border bg-white rounded-md text-sm text-black placeholder-[#1c4475]"
          />
          <button
            onClick={handleSearch}
            className="w-[20%] sm:w-auto px-4 py-[10px] text-sm bg-[#1c4475] text-[#f39a3c] border-none rounded-md sm:rounded-r-md cursor-pointer transition transform duration-300 hover:bg-[#0f2947] active:scale-95"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
