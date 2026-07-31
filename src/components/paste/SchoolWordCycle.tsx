"use client";

import { useEffect, useState } from "react";
import { SCHOOL_WORDS } from "@/lib/standingOptions";

export default function SchoolWordCycle() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      const timeout = setTimeout(() => {
        setIdx((p) => (p + 1) % SCHOOL_WORDS.length);
        setVisible(true);
      }, 260);
      return () => clearTimeout(timeout);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="italic inline-block transition-opacity duration-[260ms]"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {SCHOOL_WORDS[idx]}
    </span>
  );
}
