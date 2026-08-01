"use client";

import { useEffect, useState } from "react";

interface LoadingSequenceProps {
  lines: string[];
  onDone: () => void;
  tickMs?: number;
}

export default function LoadingSequence({ lines, onDone, tickMs = 260 }: LoadingSequenceProps) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      if (i > lines.length) {
        clearInterval(timer);
        onDone();
      } else {
        setIdx(i);
      }
    }, tickMs);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="py-[150px] flex flex-col items-center gap-[26px] animate-lit-in">
      <div className="font-serif text-[26px] font-normal tracking-[-0.01em]">
        Comparing against your school&apos;s published rules…
      </div>
      <div className="flex flex-col gap-[9px] w-[340px]">
        {lines.map((label, i) => {
          const done = idx > i;
          const active = idx === i;
          return (
            <div
              key={label}
              className={`flex items-center gap-[11px] font-sans font-semibold text-[12px] ${active ? "animate-lit-pulse" : ""}`}
              style={{
                color: done ? "#2a2825" : "#a3a09a",
                opacity: idx >= i ? 1 : 0.35,
              }}
            >
              <span>{done ? "✓" : "·"}</span>
              <span>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
