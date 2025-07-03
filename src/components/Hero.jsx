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

<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-sans px-2 w-full max-w-full">
  <h1 className="text-base text-white sm:text-2xl md:text-[3.20rem] font-semibold mb-3 sm:mb-5 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.7)] leading-snug">
    The Indian's Number 1 Roomshare Site
  </h1>

  <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-[10px] w-full max-w-xs sm:max-w-2xl mx-auto">
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onKeyDown={handleKeyPress}
      placeholder="Search for your looking city"
      className="w-[80%] p-1 sm:p-2.5 border bg-white rounded-md text-sm text-black placeholder-[#1c4475] focus:outline-none"
    />
    <button
      onClick={handleSearch}
      className="w-[30%] sm:w-auto px-3 py-1 text-sm bg-[#1c4475] text-[#f39a3c] border-none rounded-md sm:rounded-r-md cursor-pointer transition duration-300 hover:bg-[#0f2947] active:scale-95"
    >
      Search
    </button>
  </div>
</div>


    </div>
  );
};

export default Hero;
