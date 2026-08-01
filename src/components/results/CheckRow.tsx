"use client";

import { CheckResult } from "@/lib/types";
import { STATUS_STYLES } from "@/lib/statusStyles";

interface CheckRowProps {
  check: CheckResult;
  index: number;
  offerColLabel: string;
  open: boolean;
  onToggle: () => void;
}

export default function CheckRow({ check, index, offerColLabel, open, onToggle }: CheckRowProps) {
  const style = STATUS_STYLES[check.status];
  const offerColor = check.status === "pass" ? "#3d3b37" : style.chipColor;

  return (
    <div
      className="px-5 py-6 -mx-5 border-b border-[rgba(28,27,25,.08)]"
      style={{ background: style.rowTint }}
    >
      <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-[22px] items-start">
        <div className="flex flex-col gap-[7px] pt-[3px]">
          <span
            className="font-sans font-semibold text-[9.5px] tracking-[.11em] uppercase text-center py-1 rounded-[3px]"
            style={{ background: style.chipBg, color: style.chipColor, border: `1px solid ${style.chipBorder}` }}
          >
            {check.status}
          </span>
          <span className="font-sans font-semibold text-[9.5px] tracking-[.06em] text-faintest text-center">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="min-w-0">
          <div className="font-serif text-[21px] font-medium tracking-[-0.01em] mb-3.5">
            {check.title}
          </div>

          <div className="grid grid-cols-2 border border-[rgba(28,27,25,.1)] rounded-[4px] bg-surface-input overflow-hidden max-w-[640px]">
            <div className="px-[15px] py-[11px] border-r border-[rgba(28,27,25,.1)]">
              <div className="font-sans font-semibold text-[9.5px] tracking-[.09em] uppercase text-faintest mb-1">
                {offerColLabel}
              </div>
              <div className="text-[13.5px] font-medium" style={{ color: offerColor }}>
                {check.offerValue}
              </div>
            </div>
            <div className="px-[15px] py-[11px]">
              <div className="font-sans font-semibold text-[9.5px] tracking-[.09em] uppercase text-faintest mb-1">
                Your school&apos;s rule
              </div>
              <div className="text-[13.5px] font-medium text-label">{check.ruleValue}</div>
            </div>
          </div>

          <div className="flex gap-2.5 mt-[13px] max-w-[640px]">
            <span className="font-sans font-semibold text-[11px] text-faintest leading-[1.6]">→</span>
            <span className="text-[13.5px] leading-[1.6] text-body text-pretty">{check.nextStep}</span>
          </div>

          <button
            onClick={onToggle}
            className="mt-[13px] inline-flex items-center gap-1.5 bg-transparent border-0 p-0 font-sans font-semibold text-[11px] text-accent cursor-pointer border-b border-[oklch(0.48_0.075_250_/_0.25)] hover:text-accent-hover"
          >
            <span>OIS, {check.source.name}</span>
            <span>{open ? "−" : "+"}</span>
          </button>

          {open && (
            <div
              className="mt-3 max-w-[640px] bg-surface-raised border border-[rgba(28,27,25,.1)] rounded-r-[4px] px-4 py-3.5"
              style={{ borderLeft: "2px solid oklch(0.48 0.075 250 / 0.45)" }}
            >
              <div className="font-serif text-[14.5px] font-semibold leading-[1.6] text-ink-2">
                &ldquo;{check.source.quote}&rdquo;
              </div>
              <div className="flex items-center gap-3 mt-[11px] font-sans font-semibold text-[10px] text-faint flex-wrap">
                <span>{check.source.cite}</span>
                <a href={check.source.url ?? "#"}>Open on your school&apos;s OIS site ↗</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
