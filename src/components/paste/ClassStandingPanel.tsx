"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import { LEVELS, YEARS } from "@/lib/standingOptions";
import OptionButton from "@/components/ui/OptionButton";

interface ClassStandingPanelProps {
  ready: boolean;
  onCheck: () => void;
}

export default function ClassStandingPanel({ ready, onCheck }: ClassStandingPanelProps) {
  const standing = useAppStore((s) => s.flow.standing);
  const setLevel = useAppStore((s) => s.setLevel);
  const setYear = useAppStore((s) => s.setYear);
  const setFinalSemester = useAppStore((s) => s.setFinalSemester);
  const raw = useAppStore((s) => s.flow.raw);

  const yearOptions = YEARS[standing.level] ?? [];

  return (
    <aside className="bg-surface-raised border border-[rgba(28,27,25,.1)] rounded-[6px] p-6">
      <div className="font-sans font-semibold text-[10px] tracking-[.09em] uppercase text-faint mb-1.5">
        Required
      </div>
      <div className="font-serif text-[20px] font-medium tracking-[-0.01em] mb-1.5">
        Your class standing
      </div>
      <p className="text-[12.5px] leading-[1.5] text-muted mb-5">
        It changes the hours rule: final-semester students may qualify for full-time.
      </p>

      <div className="flex flex-col gap-5">
        <div>
          <div className="text-[11.5px] font-medium text-label mb-2">1 · Level</div>
          <div className="flex flex-col gap-1.5">
            {LEVELS.map(([value, label]) => (
              <OptionButton
                key={value}
                selected={standing.level === value}
                onClick={() => setLevel(value)}
                className="text-left px-3 py-2.5 text-[13px]"
              >
                {label}
              </OptionButton>
            ))}
          </div>
        </div>

        {standing.level && (
          <div className="animate-lit-in">
            <div className="text-[11.5px] font-medium text-label mb-2">2 · Year</div>
            <div className="flex flex-wrap gap-1.5">
              {yearOptions.map((label) => (
                <OptionButton
                  key={label}
                  selected={standing.year === label}
                  onClick={() => setYear(label)}
                  className="px-[11px] py-[7px] text-[12.5px]"
                >
                  {label}
                </OptionButton>
              ))}
            </div>
          </div>
        )}

        {standing.year && (
          <div className="animate-lit-in">
            <div className="text-[11.5px] font-medium text-label mb-1">
              3 · Is this your final semester?
            </div>
            <p className="text-[11.5px] leading-[1.45] text-faint mb-2">
              Graduating at the end of it.
            </p>
            <div className="flex gap-1.5">
              {(
                [
                  ["yes", "Yes"],
                  ["no", "No"],
                ] as const
              ).map(([value, label]) => (
                <OptionButton
                  key={value}
                  selected={standing.finalSemester === value}
                  onClick={() => setFinalSemester(value)}
                  className="px-[18px] py-[7px] text-[12.5px]"
                >
                  {label}
                </OptionButton>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onCheck}
        disabled={!ready}
        className={`w-full mt-6 py-[13px] text-[14px] font-medium rounded-[4px] border ${
          ready
            ? "bg-ink text-[#fbfaf8] border-ink cursor-pointer hover:bg-[#332f2a]"
            : "bg-[#eceae5] text-[#b0ada6] border-transparent cursor-default"
        }`}
      >
        Check this offer.
      </button>
      <div className="text-[11.5px] text-faintest mt-2.5 text-center min-h-[16px]">
        {ready
          ? "Nothing is stored or sent to your school."
          : raw.trim()
            ? "Answer all three above."
            : "Paste an offer and answer all three above."}
      </div>
    </aside>
  );
}
