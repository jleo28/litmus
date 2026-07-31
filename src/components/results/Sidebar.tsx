"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/useAppStore";
import { CurrentResult } from "@/lib/types";
import { assignColumn } from "@/lib/checkFlow";
import { buildSummaryText } from "@/lib/summaryText";

interface SidebarProps {
  result: CurrentResult;
}

export default function Sidebar({ result }: SidebarProps) {
  const router = useRouter();
  const signedIn = useAppStore((s) => s.auth.signedIn);
  const saveCheck = useAppStore((s) => s.saveCheck);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const isLetter = result.docType === "letter";

  function handleSave() {
    if (!signedIn) {
      router.push("/signin");
      return;
    }
    saveCheck({
      board: isLetter ? "offer" : "jd",
      docType: result.docType,
      fields: result.fields,
      standing: result.standing,
      schoolId: result.schoolId,
      checks: result.checks,
      completeness: result.completeness,
      column: assignColumn(result.checks),
    });
    setSaved(true);
    router.push("/tracker");
  }

  function handleCopy() {
    const text = buildSummaryText(result.fields, result.docType, result.checks);
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  return (
    <aside className="flex flex-col gap-3.5 sticky top-6">
      <div data-noprint="1" className="bg-surface-raised border border-[rgba(28,27,25,.1)] rounded-[6px] p-5">
        <div className="font-sans font-semibold text-[10px] tracking-[.09em] uppercase text-faint mb-3.5">
          Keep a record
        </div>
        <button
          onClick={handleSave}
          className="w-full text-left px-3.5 py-3 rounded-[4px] bg-ink text-[#fbfaf8] border border-ink cursor-pointer text-[13.5px] font-medium mb-2 hover:bg-[#332f2a]"
        >
          {saved ? "Saved to tracker ✓" : "Save to tracker"}
        </button>
        <button
          onClick={handleCopy}
          className="w-full text-left px-3.5 py-3 rounded-[4px] bg-transparent text-ink-2 border border-[rgba(28,27,25,.2)] cursor-pointer text-[13.5px] mb-2 hover:border-[rgba(28,27,25,.4)]"
        >
          {copied ? "Copied ✓" : "Copy the summary"}
        </button>
        <button
          onClick={() => window.print()}
          className="w-full text-left px-3.5 py-3 rounded-[4px] bg-transparent text-ink-2 border border-[rgba(28,27,25,.2)] cursor-pointer text-[13.5px] hover:border-[rgba(28,27,25,.4)]"
        >
          Print / save as PDF
        </button>
      </div>

      <div className="bg-surface-raised border border-[rgba(28,27,25,.1)] rounded-[6px] p-5">
        <div className="font-sans font-semibold text-[10px] tracking-[.09em] uppercase text-faint mb-[13px]">
          What Litmus checked
        </div>
        <div className="flex flex-col gap-[11px]">
          {[
            { label: "Document", value: isLetter ? "Offer letter" : "Job listing" },
            { label: "Employer", value: result.fields.employer },
            { label: "Dates", value: `${result.fields.start} – ${result.fields.end}` },
            { label: "Hours", value: result.fields.hours || "Not stated" },
            { label: "Location", value: result.fields.location },
            {
              label: "Standing",
              value: result.standing.year + (result.standing.finalSemester === "yes" ? " · final semester" : ""),
            },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-0.5">
              <span className="text-[11px] text-faintest tracking-[.02em]">{item.label}</span>
              <span className="text-[12.5px] text-ink-2 font-normal leading-[1.4]">{item.value}</span>
            </div>
          ))}
        </div>
        <button
          data-noprint="1"
          onClick={() => router.push("/confirm")}
          className="mt-4 bg-transparent border-0 p-0 text-[12.5px] text-muted cursor-pointer border-b border-[rgba(28,27,25,.2)] hover:text-ink"
        >
          Edit these values
        </button>
      </div>

      <div data-noprint="1" className="text-[11.5px] leading-[1.5] text-faintest px-1">
        Rule values shown are as published for 2026–27 and pending OIS verification.
      </div>
    </aside>
  );
}
