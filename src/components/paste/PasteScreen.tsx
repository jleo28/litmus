"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/useAppStore";
import { detectDocType } from "@/lib/extraction/detectDocType";
import { extractFields } from "@/lib/extraction/extractFields";
import { computeSignature } from "@/lib/checkFlow";
import { SAMPLES } from "@/lib/samples";
import ClassStandingPanel from "@/components/paste/ClassStandingPanel";
import SchoolWordCycle from "@/components/paste/SchoolWordCycle";
import TrackerPromptCard from "@/components/paste/TrackerPromptCard";
import LoadingSequence from "@/components/shared/LoadingSequence";

export default function PasteScreen() {
  const router = useRouter();
  const raw = useAppStore((s) => s.flow.raw);
  const standing = useAppStore((s) => s.flow.standing);
  const lastSig = useAppStore((s) => s.flow.lastSig);
  const setRaw = useAppStore((s) => s.setRaw);
  const setFields = useAppStore((s) => s.setFields);
  const setDocType = useAppStore((s) => s.setDocType);

  const [checking, setChecking] = useState(false);
  const [uploadNote, setUploadNote] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const detected = detectDocType(raw);
  const isLetter = detected === "letter";
  const docShort = isLetter ? "letter" : "listing";
  const ready = raw.trim().length > 0 && !!standing.level && !!standing.year && !!standing.finalSemester;

  function handleCheck() {
    const fresh = detectDocType(raw);
    const { fields, missing } = extractFields(raw, fresh);
    setFields(fields, missing);
    setDocType(fresh);

    const sig = computeSignature(fields, fresh, standing);
    if (lastSig && lastSig === sig) {
      router.push("/confirm");
    } else {
      setChecking(true);
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (file.type === "text/plain") {
      file.text().then(setRaw);
      setUploadNote("");
      return;
    }
    setUploadNote(
      "Litmus can't read PDF or DOCX files yet, paste the text instead.",
    );
  }

  if (checking) {
    return (
      <LoadingSequence
        lines={[
          `Reading the ${docShort}`,
          "Matching the CPT term",
          "Comparing dates and deadlines",
          "Comparing weekly hours",
          "Checking the commute zone",
        ]}
        onDone={() => router.push("/confirm")}
      />
    );
  }

  return (
    <div className="py-16 pb-12 grid grid-cols-[minmax(0,1fr)_316px] gap-16 items-start animate-lit-in">
      <div className="min-w-0">
        <h1 className="font-serif text-[44px] leading-[1.12] font-normal tracking-[-0.02em] mb-3.5">
          Check an offer against
          <br />
          <span className="whitespace-nowrap">
            <SchoolWordCycle /> CPT rules.
          </span>
        </h1>
        <p className="text-[15.5px] leading-[1.55] text-body-muted mb-8 max-w-[52ch] text-pretty">
          Paste a listing or an offer letter. Litmus compares the hours, dates
          and location against your school&apos;s published rules and tells
          you exactly where they collide, before you spend weeks on it.
        </p>

        <label htmlFor="offer" className="block text-[12.5px] font-medium text-label mb-2">
          Paste the job listing or offer letter
        </label>
        <div className="relative">
          <textarea
            id="offer"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder="Paste the full text here: title, employer, dates, hours, and work location."
            className="w-full h-[252px] resize-y px-[22px] py-5 text-[14px] leading-[1.6] text-ink bg-surface-input border border-[rgba(28,27,25,.16)] rounded-[5px] outline-none shadow-[0_1px_2px_rgba(28,27,25,.04)] focus:border-[oklch(0.48_0.075_250_/_0.55)] focus:shadow-[0_0_0_3px_oklch(0.48_0.075_250_/_0.09)]"
          />
          <span className="absolute right-3.5 bottom-3 font-sans font-semibold text-[10px] text-faintest">
            {raw.length ? `${raw.length.toLocaleString()} chars` : ""}
          </span>
        </div>

        <div className="min-h-[26px] mt-2.5">
          {detected && raw.trim().length > 40 && (
            <div className="flex items-center gap-2.5 text-[12.5px] text-body-muted">
              <span className="font-sans font-semibold text-[9.5px] tracking-[.1em] uppercase px-2 py-1 rounded-[3px] bg-accent-bg text-accent whitespace-nowrap">
                {isLetter ? "Reading an offer letter" : "Reading a job listing"}
              </span>
              <span className="text-faint">
                {isLetter
                  ? "Holding it to the standard for a letter submitted to OIS."
                  : "Postings often leave out hours, that's expected, and I'll say so rather than guess."}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4.5 mt-2 flex-wrap">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={handleFile}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-transparent border border-dashed border-[rgba(28,27,25,.22)] rounded-[4px] px-3 py-1.5 text-[12.5px] text-body-muted cursor-pointer hover:border-[rgba(28,27,25,.4)] hover:text-ink"
          >
            <span className="font-sans font-semibold text-[13px] leading-none">↑</span>
            <span>or upload a PDF / DOCX</span>
          </button>
          <div className="flex items-center gap-2.5 text-[12.5px] text-faint">
            <span>Try a sample:</span>
            {SAMPLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setRaw(s.raw)}
                className="bg-transparent border-0 p-0 text-[12.5px] text-accent border-b border-[oklch(0.48_0.075_250_/_0.3)] cursor-pointer hover:text-accent-hover"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        {uploadNote && (
          <p className="text-[11.5px] text-faint mt-2">{uploadNote}</p>
        )}
      </div>

      <div className="flex flex-col gap-3.5">
        <ClassStandingPanel ready={ready} onCheck={handleCheck} />
        <TrackerPromptCard />
      </div>
    </div>
  );
}
