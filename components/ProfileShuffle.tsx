"use client";

import { useEffect, useState } from "react";

const profiles = [
  "https://static.vecteezy.com/system/resources/thumbnails/057/507/977/small_2x/anime-character-design-free-vector.jpg",
  "/profile-2.png",
];

export default function ProfileShuffle() {
  const [profileIndex, setProfileIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProfileIndex((prev) => (prev + 1) % profiles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-neutral-800">
      <img
        src={profiles[profileIndex]}
        alt="Profile"
        className="size-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
