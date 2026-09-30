"use client";

import { useEffect, useState } from "react";

export default function LocationTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }) +
          "." +
          String(now.getMilliseconds()).padStart(3, "0"),
      );
    };

    updateTime();

    const interval = setInterval(updateTime, 1);

    return () => clearInterval(interval);
  }, []);

  return (
    <p className="mt-1 font-mono text-[9px] text-neutral-400">
      <span className="text-primary">■</span> Hyderabad, India · {time}
    </p>
  );
}