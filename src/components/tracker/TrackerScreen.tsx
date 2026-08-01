"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/useAppStore";
import { buildTrackerSubtitle } from "@/lib/checkFlow";
import { TRACKER_COLUMNS, EMPTY_COLUMN_COPY } from "@/lib/trackerColumns";
import { TrackerBoard } from "@/lib/types";
import TrackerCard from "@/components/tracker/TrackerCard";

export default function TrackerScreen() {
  const router = useRouter();
  const [board, setBoard] = useState<TrackerBoard>("jd");
  const boardChecks = useAppStore((s) => s.boardChecks);
  const loadFlowFromSaved = useAppStore((s) => s.loadFlowFromSaved);

  const checks = boardChecks(board);

  function handleRecheck(id: string) {
    const saved = checks.find((c) => c.id === id);
    if (!saved) return;
    loadFlowFromSaved(saved);
    router.push("/confirm");
  }

  return (
    <div className="pt-11 pb-14 animate-lit-in">
      <div className="flex items-end gap-7 flex-wrap mb-[26px]">
        <div className="min-w-0">
          <div className="font-sans font-semibold text-[10px] tracking-[.09em] uppercase text-faint mb-3">
            Your checks
          </div>
          <h1 className="font-serif text-[34px] leading-[1.15] font-normal tracking-[-0.02em] mb-2">
            {board === "jd" ? "Listings you're considering" : "Offers you've received"}
          </h1>
          <p className="text-[14px] leading-[1.55] text-body-muted max-w-[64ch] text-pretty">
            {buildTrackerSubtitle(board, checks)}
          </p>
        </div>
        <div className="ml-auto flex gap-1.5">
          {(
            [
              ["jd", "Job listings"],
              ["offer", "Offers"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setBoard(value)}
              className={`px-[15px] py-[9px] text-[13px] rounded-[4px] cursor-pointer whitespace-nowrap border ${
                board === value
                  ? "bg-ink text-[#fbfaf8] border-ink font-medium"
                  : "bg-surface-input text-label border-[rgba(28,27,25,.16)] font-normal"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 items-start">
        {TRACKER_COLUMNS.map((col) => {
          const cards = checks.filter((c) => c.column === col.key);
          return (
            <div
              key={col.key}
              className="min-w-0 rounded-[6px] px-4 pt-4 pb-[18px]"
              style={{
                background: col.key === "clear" ? "#fbfaf8" : `oklch(0.988 0.012 ${col.hue})`,
                border: `1px solid oklch(0.9 0.03 ${col.hue})`,
              }}
            >
              <div className="flex items-baseline gap-2.5 pb-3.5 border-b border-[rgba(28,27,25,.08)] mb-3.5">
                <span
                  className="font-sans font-semibold text-[10px] tracking-[.09em] uppercase"
                  style={{ color: `oklch(0.45 0.1 ${col.hue})` }}
                >
                  {col.title}
                </span>
                <span className="font-sans font-semibold text-[10px] text-faintest ml-auto">
                  {cards.length}
                </span>
              </div>
              <div className="text-[12px] leading-[1.5] text-muted pb-3.5 text-pretty">{col.blurb}</div>
              <div className="flex flex-col gap-2.5">
                {cards.map((c) => (
                  <TrackerCard key={c.id} check={c} hue={col.hue} onRecheck={() => handleRecheck(c.id)} />
                ))}
                {!cards.length && (
                  <div className="border border-dashed border-[rgba(28,27,25,.18)] rounded-[5px] px-3.5 py-[18px] text-[12.5px] text-faintest text-center">
                    {EMPTY_COLUMN_COPY[col.key]}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4.5 mt-6.5 flex-wrap">
        <button
          onClick={() => router.push("/")}
          className="px-5 py-3 text-[13.5px] font-medium rounded-[4px] cursor-pointer bg-ink text-[#fbfaf8] border border-ink hover:bg-[#332f2a]"
        >
          Check another offer
        </button>
        <span className="text-[12.5px] leading-[1.5] text-faint max-w-[70ch] text-pretty">
          Cards move columns on their own when you re-check them, so an amended letter or a confirmed
          hours number lands where it belongs. Nothing here is an eligibility decision, and none of it
          is shared with your school.
        </span>
      </div>
    </div>
  );
}
