"use client";

import { useState } from "react";
import { EmailDraft } from "@/lib/draftEmail";

interface EmailDraftOverlayProps {
  drafts: EmailDraft[];
  initialIndex: number;
  onClose: () => void;
}

export default function EmailDraftOverlay({ drafts, initialIndex, onClose }: EmailDraftOverlayProps) {
  const [index, setIndex] = useState(Math.min(initialIndex, drafts.length - 1));
  const [copied, setCopied] = useState(false);
  const draft = drafts[index];

  function handleCopy() {
    navigator.clipboard?.writeText(`Subject: ${draft.subject}\n\n${draft.body}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  return (
    <div
      data-noprint="1"
      className="fixed inset-0 z-40 bg-[rgba(28,27,25,.42)] flex items-center justify-center p-10"
    >
      <div onClick={onClose} className="absolute inset-0" />
      <div className="relative w-full max-w-[760px] max-h-[86vh] overflow-auto bg-surface-input border border-[rgba(28,27,25,.16)] rounded-[8px] shadow-[0_24px_60px_rgba(28,27,25,.28)] animate-lit-pop">
        <div className="flex items-start gap-5 px-6 pt-[22px] pb-4 border-b border-[rgba(28,27,25,.09)]">
          <div className="min-w-0">
            <div className="font-sans font-semibold text-[10px] tracking-[.09em] uppercase text-faint mb-2">
              Draft: nothing is sent for you
            </div>
            <div className="font-serif text-[24px] font-medium tracking-[-0.015em]">
              {draft.label === "To OIS" ? "Email to your international office" : `Email to ${draft.label.replace("To the ", "")}`}
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-auto flex-none bg-transparent border border-[rgba(28,27,25,.16)] rounded-[4px] w-[30px] h-[30px] text-[14px] text-body-muted cursor-pointer hover:border-[rgba(28,27,25,.4)] hover:text-ink"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-1.5 px-6 pt-3.5 flex-wrap">
          {drafts.map((d, i) => (
            <button
              key={d.label}
              onClick={() => setIndex(i)}
              className={`px-[13px] py-[7px] text-[12.5px] rounded-[4px] cursor-pointer border ${
                i === index
                  ? "bg-ink text-[#fbfaf8] border-ink font-medium"
                  : "bg-surface-input text-label border-[rgba(28,27,25,.16)] font-normal"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="px-6 pt-4 pb-1">
          <div className="flex flex-col gap-px border border-[rgba(28,27,25,.12)] rounded-[5px] overflow-hidden bg-[rgba(28,27,25,.06)]">
            <div className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 px-3.5 py-[11px] bg-surface-raised text-[13px]">
              <span className="text-faintest">To</span>
              <span className="text-ink-2">{draft.to}</span>
            </div>
            <div className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 px-3.5 py-[11px] bg-surface-raised text-[13px]">
              <span className="text-faintest">Subject</span>
              <span className="text-ink-2 font-medium">{draft.subject}</span>
            </div>
            <div className="px-4 py-[18px] bg-surface-input text-[13.5px] leading-[1.65] text-ink-2 whitespace-pre-wrap">
              {draft.body}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 px-6 pt-4 pb-[22px] flex-wrap">
          <button
            onClick={handleCopy}
            className="px-[18px] py-[11px] text-[13.5px] font-medium rounded-[4px] cursor-pointer bg-ink text-[#fbfaf8] border border-ink hover:bg-[#332f2a]"
          >
            {copied ? "Copied ✓" : "Copy the draft"}
          </button>
        </div>
      </div>
    </div>
  );
}
