"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/useAppStore";
import { buildChecks } from "@/lib/rules/engine";
import { buildCompleteness } from "@/lib/rules/completeness";
import { getSchool } from "@/lib/rules/schools";
import { computeSignature } from "@/lib/checkFlow";
import { FieldKey } from "@/lib/types";
import LoadingSequence from "@/components/shared/LoadingSequence";

const FIELD_DEFS: { key: FieldKey; label: string; hint: (isLetter: boolean) => string; placeholder: string }[] = [
  { key: "employer", label: "Employer", hint: () => "Legal name as it appears on the letter", placeholder: "Acme Inc." },
  { key: "start", label: "Start date", hint: () => "First day of work", placeholder: "Aug 24, 2026" },
  { key: "end", label: "End date", hint: () => "Last day of work", placeholder: "Dec 11, 2026" },
  {
    key: "hours",
    label: "Weekly hours",
    hint: (isLetter) => (isLetter ? "A single number, not a range" : "Often absent from public postings, fine to leave blank"),
    placeholder: "20 hrs/wk",
  },
  { key: "location", label: "Work location", hint: () => "City and state of the physical site", placeholder: "Los Angeles, CA" },
];

export default function ConfirmScreen() {
  const router = useRouter();
  const raw = useAppStore((s) => s.flow.raw);
  const docType = useAppStore((s) => s.flow.docType);
  const standing = useAppStore((s) => s.flow.standing);
  const fields = useAppStore((s) => s.flow.fields);
  const missing = useAppStore((s) => s.flow.missing);
  const lastSig = useAppStore((s) => s.flow.lastSig);
  const setField = useAppStore((s) => s.setField);
  const setDocType = useAppStore((s) => s.setDocType);
  const setLastSig = useAppStore((s) => s.setLastSig);
  const setCurrentResult = useAppStore((s) => s.setCurrentResult);

  const [checking, setChecking] = useState(false);

  const isLetter = docType === "letter";
  const docShort = isLetter ? "letter" : "listing";

  function handleRun() {
    const school = getSchool("usc");
    const checks = buildChecks(fields, standing, docType, school, new Date());
    const completeness = buildCompleteness(fields, docType, raw);
    setCurrentResult({ docType, raw, fields, standing, schoolId: school.id, checks, completeness });

    const sig = computeSignature(fields, docType, standing);
    if (lastSig && lastSig === sig) {
      router.push("/results");
    } else {
      setLastSig(sig);
      setChecking(true);
    }
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
        onDone={() => router.push("/results")}
      />
    );
  }

  return (
    <div className="py-[52px] pb-12 max-w-[820px] animate-lit-in">
      <div className="font-sans font-semibold text-[10px] tracking-[.09em] uppercase text-faint mb-2.5">
        Step 2 of 3
      </div>
      <h1 className="font-serif text-[34px] leading-[1.15] font-normal tracking-[-0.02em] mb-3">
        {isLetter ? "Here's what I pulled from your offer letter." : "Here's what I pulled from the listing."}
      </h1>
      <p className="text-[15px] leading-[1.55] text-body-muted mb-5 max-w-[56ch]">
        Fix anything I got wrong before we check. Everything below is editable.
      </p>

      <div className="flex items-center gap-3 mb-[30px] flex-wrap">
        <span className="font-sans font-semibold text-[9.5px] tracking-[.1em] uppercase px-[9px] py-[5px] rounded-[3px] bg-accent-bg text-accent whitespace-nowrap">
          {isLetter ? "Reading an offer letter" : "Reading a job listing"}
        </span>
        <span className="text-[12.5px] text-faint">
          {isLetter ? "Held to the standard OIS applies to a letter." : "Judged as a posting, not a signed offer."}
        </span>
        <button
          onClick={() => setDocType(isLetter ? "jd" : "letter")}
          className="bg-transparent border-0 p-0 text-[12.5px] text-accent border-b border-[oklch(0.48_0.075_250_/_0.3)] cursor-pointer hover:text-accent-hover"
        >
          {isLetter ? "It's a job listing, actually" : "It's an offer letter, actually"}
        </button>
      </div>

      {missing.hours && (
        <div className="flex gap-3 items-start bg-[oklch(0.975_0.03_85)] border border-[oklch(0.86_0.06_85)] rounded-[5px] px-4 py-3.5 mb-[26px]">
          <span className="font-sans font-semibold text-[11px] tracking-[.06em] uppercase text-[oklch(0.48_0.1_70)] whitespace-nowrap pt-px">
            Not found
          </span>
          <span className="text-[13.5px] leading-[1.5] text-body">
            {isLetter
              ? "I couldn't find weekly hours in this letter. OIS won't accept a letter without exact hours, add the number if you know it, and ask for an amended letter either way."
              : "I couldn't find weekly hours in this listing, most public postings leave them out. Add a number if the recruiter has told you one; leave it blank and Litmus will flag the hours check as unresolved instead of guessing."}
          </span>
        </div>
      )}

      <div className="bg-surface-raised border border-[rgba(28,27,25,.1)] rounded-[6px] overflow-hidden">
        {FIELD_DEFS.map((def, i) => {
          const flagged = !!missing[def.key] && !fields[def.key].trim();
          return (
            <div
              key={def.key}
              className={`grid grid-cols-[210px_minmax(0,1fr)] gap-6 items-center px-6 py-[17px] ${
                i < FIELD_DEFS.length - 1 ? "border-b border-[rgba(28,27,25,.07)]" : ""
              }`}
            >
              <div>
                <div className="text-[13px] font-medium text-label">{def.label}</div>
                <div className="text-[11.5px] text-faint mt-0.5">{def.hint(isLetter)}</div>
              </div>
              <div>
                <input
                  value={fields[def.key]}
                  onChange={(e) => setField(def.key, e.target.value)}
                  placeholder={def.placeholder}
                  className="w-full px-[13px] py-2.5 text-[13.5px] text-ink rounded-[4px] outline-none focus:border-[oklch(0.48_0.075_250_/_0.55)] focus:shadow-[0_0_0_3px_oklch(0.48_0.075_250_/_0.09)]"
                  style={{
                    background: flagged ? "oklch(0.985 0.02 85)" : "#fdfdfc",
                    border: `1px solid ${flagged ? "oklch(0.82 0.08 85)" : "rgba(28,27,25,.16)"}`,
                  }}
                />
                {flagged && (
                  <div className="text-[11.5px] mt-1.5" style={{ color: "oklch(0.48 0.1 70)" }}>
                    {isLetter
                      ? "couldn't find this, the letter needs it."
                      : "couldn't find this, add it, or leave blank and we'll flag the check."}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-5 mt-7">
        <button
          onClick={handleRun}
          className="px-[26px] py-[13px] text-[14px] font-medium rounded-[4px] cursor-pointer bg-ink text-[#fbfaf8] border border-ink hover:bg-[#332f2a]"
        >
          Run the check.
        </button>
        <button
          onClick={() => router.push("/")}
          className="bg-transparent border-0 p-0 text-[13px] text-muted cursor-pointer border-b border-[rgba(28,27,25,.2)] hover:text-ink"
        >
          Back to the paste
        </button>
      </div>
    </div>
  );
}
