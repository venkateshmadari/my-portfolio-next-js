"use client";

import { useEffect, useState } from "react";

const profiles = ["https://static.vecteezy.com/system/resources/thumbnails/057/507/977/small_2x/anime-character-design-free-vector.jpg", "https://media.licdn.com/dms/image/v2/D5635AQHX5NhC3uI9bw/profile-framedphoto-shrink_200_200/B56Z3KhdYAH4AY-/0/1777219262238?e=1791367200&v=beta&t=g_r_Y6anFyVESoh6loS4M8OIp8ZvJYPDJ59uReNYktA"];

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
      />
    </div>
  );
}