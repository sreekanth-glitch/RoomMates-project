"use client";

import { Suspense } from "react";
import Hero from "@/components/Hero";
import AllRooms from "@/components/AllRooms";

const HomePage = () => {
  return (
    <main>
      <Hero />

      <Suspense fallback={<p className="mt-4 text-center">Loading rooms...</p>}>
        <AllRooms />
      </Suspense>
    </main>
  );
};

export default HomePage;
