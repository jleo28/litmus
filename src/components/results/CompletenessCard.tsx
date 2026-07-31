import { CompletenessItem, DocType } from "@/lib/types";

interface CompletenessCardProps {
  items: CompletenessItem[];
  docType: DocType;
}

export default function CompletenessCard({ items, docType }: CompletenessCardProps) {
  const isLetter = docType === "letter";
  const missingCount = items.filter((i) => !i.ok).length;

  const lead =
    (isLetter
      ? "Your school requires all six of these in the letter you submit. "
      : "A posting isn't a letter, but these are the six elements the letter will need, and this is what the posting already gives you. ") +
    (missingCount ? `${missingCount} ${missingCount === 1 ? "item is" : "items are"} missing.` : "All six are present.");

  return (
    <div className="mt-[34px] border border-[rgba(28,27,25,.12)] rounded-[6px] bg-surface-raised overflow-hidden">
      <div className="px-6 pt-5 pb-4 border-b border-[rgba(28,27,25,.08)]">
        <div className="font-serif text-[21px] font-medium tracking-[-0.01em]">
          Offer-letter completeness
        </div>
        <div className="text-[13px] leading-[1.5] text-muted mt-[5px] max-w-[62ch]">{lead}</div>
      </div>
      <div className="grid grid-cols-2">
        {items.map((item, i) => (
          <div
            key={item.label}
            className="flex items-baseline gap-[11px] px-6 py-[13px] border-[rgba(28,27,25,.06)]"
            style={{
              borderBottomWidth: 1,
              borderRightWidth: i % 2 === 0 ? 1 : 0,
            }}
          >
            <span
              className="font-sans font-semibold text-[11px] w-[9px] flex-none"
              style={{ color: item.ok ? "oklch(0.5 0.09 155)" : "oklch(0.52 0.13 25)" }}
            >
              {item.ok ? "✓" : "✕"}
            </span>
            <div>
              <div className="text-[13.5px] text-ink-2">{item.label}</div>
              {item.note && (
                <div className="text-[11.5px] mt-[3px]" style={{ color: "oklch(0.5 0.09 40)" }}>
                  {item.note}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
