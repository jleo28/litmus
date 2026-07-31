"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/useAppStore";
import { buildWhatNow } from "@/lib/whatNow";
import { buildDrafts } from "@/lib/draftEmail";
import SummaryBar from "@/components/results/SummaryBar";
import CheckRow from "@/components/results/CheckRow";
import CompletenessCard from "@/components/results/CompletenessCard";
import WhatNowCard from "@/components/results/WhatNowCard";
import Sidebar from "@/components/results/Sidebar";
import EmailDraftOverlay from "@/components/results/EmailDraftOverlay";

export default function ResultsScreen() {
  const router = useRouter();
  const result = useAppStore((s) => s.currentResult);
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});
  const [emailOpen, setEmailOpen] = useState(false);
  const [draftIndex, setDraftIndex] = useState(0);

  if (!result) {
    return (
      <div className="py-16 text-center">
        <p className="text-[15px] text-body-muted">
          There&apos;s nothing checked yet.{" "}
          <button
            onClick={() => router.push("/")}
            className="bg-transparent border-0 p-0 text-accent cursor-pointer border-b border-[oklch(0.48_0.075_250_/_0.3)]"
          >
            Paste an offer to get started.
          </button>
        </p>
      </div>
    );
  }

  const isLetter = result.docType === "letter";
  const offerColLabel = isLetter ? "Your letter" : "This listing";
  const whatNow = buildWhatNow(result.checks, result.docType);
  const drafts = buildDrafts(result.fields, result.standing, result.checks, result.docType);

  return (
    <div className="pt-11 pb-12 grid grid-cols-[minmax(0,1fr)_296px] gap-14 items-start animate-lit-in">
      <div className="min-w-0">
        <SummaryBar checks={result.checks} docType={result.docType} employer={result.fields.employer} />

        <div className="flex flex-col">
          {result.checks.map((check, i) => (
            <CheckRow
              key={check.key}
              check={check}
              index={i}
              offerColLabel={offerColLabel}
              open={!!openRows[check.key]}
              onToggle={() => setOpenRows((p) => ({ ...p, [check.key]: !p[check.key] }))}
            />
          ))}
        </div>

        <CompletenessCard items={result.completeness} docType={result.docType} />
        <WhatNowCard
          content={whatNow}
          onOpenDraft={(index) => {
            setDraftIndex(index);
            setEmailOpen(true);
          }}
        />
      </div>

      <Sidebar result={result} />

      {emailOpen && (
        <EmailDraftOverlay
          drafts={drafts}
          initialIndex={draftIndex}
          onClose={() => setEmailOpen(false)}
        />
      )}
    </div>
  );
}
