"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const bannerImages = [
  "https://i.pinimg.com/736x/68/5b/85/685b854bc8425671c330b0688bcb70f5.jpg",
  "https://i.pinimg.com/736x/41/79/14/417914dfe06ee3efcec71fcc0f33230a.jpg",
  "https://i.pinimg.com/736x/4a/d8/65/4ad8654774bd8740fef5352f15cb2209.jpg",
];

export default function ProfileBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (currentIndex + 1) % bannerImages.length;

      setNextIndex(next);
      setIsAnimating(true);

      setTimeout(() => {
        setCurrentIndex(next);
        setNextIndex(null);
        setIsAnimating(false);
      }, 800);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="border-b border-white/10 p-3 sm:p-4">
      <div className="relative h-[110px] w-full overflow-hidden rounded-sm sm:h-[120px]">
        
        {/* Current image - ALWAYS stays underneath */}
        <Image
          src={bannerImages[currentIndex]}
          alt="Profile banner"
          fill
          sizes="(max-width: 640px) 100vw, 1200px"
          className="object-cover"
        />

        {/* New image - comes from TOP over the old image */}
        {nextIndex !== null && (
          <div
            className={`absolute inset-0 ${
              isAnimating
                ? "[clip-path:inset(0_0_0_0)]"
                : "[clip-path:inset(100%_0_0_0)]"
            } transition-[clip-path] duration-[800ms] ease-in-out`}
          >
            <Image
              src={bannerImages[nextIndex]}
              alt="Profile banner"
              fill
              sizes="(max-width: 640px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}