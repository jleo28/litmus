"use client";

import { SavedCheck } from "@/lib/types";
import { buildTrackerReason } from "@/lib/checkFlow";
import { formatShortDate } from "@/lib/dates";

interface TrackerCardProps {
  check: SavedCheck;
  hue: number;
  onRecheck: () => void;
}

export default function TrackerCard({ check, hue, onRecheck }: TrackerCardProps) {
  const reason = buildTrackerReason(check.checks, check.column);
  const meta = [
    `${check.fields.start} – ${check.fields.end}`,
    check.fields.hours || "Hours not stated",
    check.fields.location || "Location not stated",
  ];

  return (
    <div
      onClick={onRecheck}
      className="bg-surface-input border border-[rgba(28,27,25,.12)] rounded-[5px] px-[15px] py-3.5 cursor-pointer shadow-[0_1px_2px_rgba(28,27,25,.04)] hover:border-[rgba(28,27,25,.28)] hover:shadow-[0_3px_10px_rgba(28,27,25,.07)]"
    >
      <div className="flex items-baseline gap-2 mb-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full flex-none"
          style={{ background: `oklch(0.55 0.13 ${hue})` }}
        />
        <span className="text-[13.5px] font-medium text-ink leading-[1.35]">
          {check.title || check.fields.employer}
        </span>
      </div>
      <div className="text-[12.5px] text-body-muted mb-[9px]">{check.fields.employer}</div>
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {meta.map((m) => (
          <span
            key={m}
            className="font-sans font-semibold text-[9.5px] tracking-[.03em] text-muted border border-[rgba(28,27,25,.12)] rounded-[3px] px-1.5 py-1 whitespace-nowrap"
          >
            {m}
          </span>
        ))}
      </div>
      <div
        className="text-[12px] leading-[1.5] mb-2.5 text-pretty"
        style={{ color: check.column === "clear" ? "#5f5c56" : "#4a4640" }}
      >
        {reason}
      </div>
      <div className="flex items-center gap-2.5 font-sans font-semibold text-[9.5px] tracking-[.05em] uppercase text-faintest">
        <span>Checked {formatShortDate(new Date(check.checkedAt))}</span>
        <span className="ml-auto text-accent">Re-check</span>
      </div>
    </div>
  );
}
