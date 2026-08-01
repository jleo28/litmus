import { WhatNowContent } from "@/lib/whatNow";

interface WhatNowCardProps {
  content: WhatNowContent;
  onOpenDraft: (index: number) => void;
}

export default function WhatNowCard({ content, onOpenDraft }: WhatNowCardProps) {
  return (
    <div className="mt-[34px] border border-[rgba(28,27,25,.16)] rounded-[6px] bg-surface-input overflow-hidden">
      <div className="px-6 pt-[22px] pb-[18px]">
        <div className="font-sans font-semibold text-[10px] tracking-[.09em] uppercase text-faint mb-3">
          What now?
        </div>
        <div className="font-serif text-[26px] leading-[1.2] font-medium tracking-[-0.015em] mb-2 max-w-[34ch] text-pretty">
          {content.headline}
        </div>
        <div className="text-[14px] leading-[1.55] text-body max-w-[60ch] text-pretty">{content.body}</div>
      </div>
      <div className="border-t border-[rgba(28,27,25,.08)]">
        {content.steps.map((step, i) => (
          <div
            key={step.title}
            className="grid grid-cols-[26px_minmax(0,1fr)_auto] gap-4 items-center px-6 py-4 border-b border-[rgba(28,27,25,.06)]"
          >
            <span className="font-sans font-semibold text-[10.5px] text-faintest">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <div className="text-[14px] font-medium text-ink mb-[3px]">{step.title}</div>
              <div className="text-[12.5px] leading-[1.5] text-muted text-pretty">{step.detail}</div>
            </div>
            {step.action && (
              <button
                onClick={() => {
                  if (step.print) window.print();
                  else if (step.openDraftIndex !== undefined) onOpenDraft(step.openDraftIndex);
                }}
                className="whitespace-nowrap px-[15px] py-[9px] text-[12.5px] font-medium rounded-[4px] cursor-pointer bg-ink text-[#fbfaf8] border border-ink hover:bg-[#332f2a]"
              >
                {step.action}
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="px-6 py-[14px] bg-surface-inset text-[12px] leading-[1.5] text-muted">
        {content.foot}
      </div>
    </div>
  );
}
