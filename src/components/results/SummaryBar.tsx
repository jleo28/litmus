import { CheckResult, DocType } from "@/lib/types";
import { summarizeChecks, buildSummaryLead } from "@/lib/checkFlow";

interface SummaryBarProps {
  checks: CheckResult[];
  docType: DocType;
  employer: string;
}

export default function SummaryBar({ checks, docType, employer }: SummaryBarProps) {
  const { label, isClear } = summarizeChecks(checks);
  const lead = buildSummaryLead(checks, docType);
  const isLetter = docType === "letter";

  return (
    <div className="border-b border-[rgba(28,27,25,.14)] pb-[26px]">
      <div className="font-sans font-semibold text-[10px] tracking-[.09em] uppercase text-faint mb-3.5">
        {isLetter ? "Offer letter" : "Job listing"} · {employer}
      </div>
      <div
        className="font-serif text-[40px] leading-[1.1] font-normal tracking-[-0.022em] mb-2.5"
        style={{ color: isClear ? "oklch(0.42 0.09 155)" : "#1c1b19" }}
      >
        {label}
      </div>
      <div className="text-[16px] leading-[1.5] text-label max-w-[56ch] text-pretty">{lead}</div>
      <div className="flex gap-[11px] items-start mt-5 px-4 py-3.5 bg-surface-raised border border-[rgba(28,27,25,.12)] rounded-[5px] max-w-[62ch]">
        <span className="font-sans font-semibold text-[12px] text-accent leading-[1.5]">i</span>
        <span className="text-[13.5px] leading-[1.55] text-body">
          This checks your offer against your school&apos;s published CPT rules.{" "}
          <strong className="font-semibold">It is not an eligibility decision</strong>, confirm with
          OIS before acting.
        </span>
      </div>
    </div>
  );
}
