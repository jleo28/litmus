"use client";

import { useMemo, useState } from "react";
import { useAuthUser } from "@/lib/supabase/useAuthUser";
import { kbSchoolFromEmail } from "@/lib/knowledge-base";
import { RULE_CATEGORY_ORDER, KBRule } from "@/lib/knowledge-base/types";
import { searchRules } from "@/lib/knowledge-base/search";
import { STATUS_STYLES } from "@/lib/statusStyles";
import { parseISODateLocal, formatDisplayDate } from "@/lib/dates";

const SEVERITY_LABEL: Record<KBRule["severity"], string> = {
  blocker: "Blocker",
  warning: "Depends",
};

const SEVERITY_STYLE: Record<KBRule["severity"], { bg: string; color: string }> = {
  blocker: { bg: STATUS_STYLES.blocker.chipBg, color: STATUS_STYLES.blocker.chipColor },
  warning: { bg: STATUS_STYLES.warning.chipBg, color: STATUS_STYLES.warning.chipColor },
};

function displayDate(iso: string): string {
  return formatDisplayDate(parseISODateLocal(iso));
}

export default function RulebookScreen() {
  const { user } = useAuthUser();
  const school = useMemo(() => kbSchoolFromEmail(user?.email), [user]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const matches = useMemo(() => searchRules(school.rules, query), [school, query]);
  const isSearching = query.trim().length > 0;
  const autoExpand = isSearching && matches.length > 0 && matches.length <= 3;

  const groups = RULE_CATEGORY_ORDER.map((category) => ({
    category,
    rules: matches.filter((r) => r.category === category),
  })).filter((g) => g.rules.length > 0);

  const lastReviewed = school.changelog[0]?.date;

  function toggle(id: string) {
    setOpen((p) => ({ ...p, [id]: !p[id] }));
  }

  return (
    <div className="pt-11 pb-[72px] max-w-[800px] mx-auto animate-lit-in">
      <div className="font-sans font-semibold text-[10px] tracking-[.09em] uppercase text-faint mb-3">
        Rulebook · {school.short}
      </div>
      <h1 className="font-serif text-[34px] leading-[1.15] font-normal tracking-[-0.02em] mb-3">
        Every rule Litmus checks against
      </h1>
      <p className="text-[14px] leading-[1.6] text-body-muted max-w-[58ch] mb-7 text-pretty">
        These are the clauses behind your results, taken from {school.office}. Each one shows the
        school&apos;s own wording and when we last read it on the source.
      </p>

      <div className="flex items-center gap-3.5 flex-wrap py-[14px] border-t border-b border-[rgba(28,27,25,.1)] mb-6">
        <span className="text-[22px] text-ink">{school.ruleCount}</span>
        <span className="text-[12.5px] text-muted">
          rules on file, covering {school.coverage.confident.join(", ")}
        </span>
        {lastReviewed && (
          <span className="ml-auto text-[12.5px] text-faint whitespace-nowrap">
            Last reviewed {displayDate(lastReviewed)}
          </span>
        )}
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search the rules: hours, location, letterhead…"
        className="w-full px-[13px] py-[11px] text-[13.5px] text-ink bg-surface-input border border-[rgba(28,27,25,.16)] rounded-[4px] outline-none focus:border-[oklch(0.48_0.075_250_/_0.55)] focus:shadow-[0_0_0_3px_oklch(0.48_0.075_250_/_0.09)]"
      />
      <div className="text-[13px] leading-[1.5] text-muted mt-2.5 mb-6 min-h-[18px] text-pretty">
        {isSearching &&
          (matches.length > 0
            ? `${matches.length} of ${school.rules.length} rules mention "${query.trim()}"`
            : `No rule on file mentions "${query.trim()}". That may be a gap rather than an answer.`)}
      </div>

      <div className="flex flex-col">
        {groups.map((group) => (
          <div key={group.category} className="mb-6">
            <div className="font-sans font-semibold text-[10px] tracking-[.09em] uppercase text-faint pb-2 border-b border-[rgba(28,27,25,.1)] mb-1">
              {group.category} · {group.rules.length}
            </div>
            {group.rules.map((rule) => {
              const isOpen = autoExpand || !!open[rule.id];
              const severity = SEVERITY_STYLE[rule.severity];
              return (
                <div key={rule.id} className="border-b border-[rgba(28,27,25,.08)]">
                  <button
                    onClick={() => toggle(rule.id)}
                    className="w-full flex items-start gap-4 py-4 text-left bg-transparent border-0 cursor-pointer hover:bg-surface-raised"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] leading-[1.5] text-ink">{rule.summary}</div>
                      {rule.stale && (
                        <div className="text-[12px] text-faintest mt-1.5">
                          Needs a recheck, last confirmed {displayDate(rule.verified)}.
                        </div>
                      )}
                    </div>
                    <span
                      className="font-sans font-semibold text-[9.5px] tracking-[.09em] uppercase px-2 py-[3px] rounded-[3px] flex-none"
                      style={{ background: severity.bg, color: severity.color }}
                    >
                      {SEVERITY_LABEL[rule.severity]}
                    </span>
                    <span className="font-sans font-semibold text-[13px] text-faint flex-none w-3 text-center">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="pb-4 -mt-1">
                      <blockquote className="bg-surface-raised border border-[rgba(28,27,25,.1)] rounded-r-[4px] px-4 py-3.5 text-[13.5px] leading-[1.6] text-ink-2 m-0" style={{ borderLeft: "2px solid rgba(28,27,25,.32)" }}>
                        &ldquo;{rule.quote}&rdquo;
                      </blockquote>
                      <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-y-1.5 gap-x-3 mt-3 text-[12px]">
                        <span className="text-faintest">Source</span>
                        <a href={rule.url} target="_blank" rel="noreferrer">
                          {rule.cite} ↗
                        </a>
                        <span className="text-faintest">Verified</span>
                        <span className="text-body">
                          {displayDate(rule.verified)} · effective {displayDate(rule.effective)}
                        </span>
                        <span className="text-faintest">Decides</span>
                        <span className="text-body">
                          {rule.powers.length ? rule.powers.join(", ") : "Nothing yet, recorded for completeness"}
                        </span>
                        <span className="text-faintest">Reference</span>
                        <a href={rule.url} target="_blank" rel="noreferrer">
                          {rule.id} ↗
                        </a>
                      </div>
                      {rule.staleNote && (
                        <div className="text-[12.5px] leading-[1.5] mt-3 max-w-[62ch]" style={{ color: "oklch(0.5 0.1 75)" }}>
                          {rule.staleNote}
                        </div>
                      )}
                      {rule.caveat && (
                        <div className="text-[12.5px] leading-[1.5] mt-3 max-w-[62ch] text-accent">
                          {rule.caveat}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-10 bg-surface-raised border border-[rgba(28,27,25,.1)] rounded-[6px] px-[22px] py-5">
        <div className="font-serif text-[19px] font-medium tracking-[-0.01em] mb-2.5">
          What Litmus does not know
        </div>
        <p className="text-[13px] leading-[1.55] text-body mb-3 text-pretty">{school.coverage.note}</p>
        <ul className="list-none p-0 m-0 flex flex-col gap-1.5">
          {school.coverage.gaps.map((gap) => (
            <li key={gap} className="text-[13px] leading-[1.5] text-body-muted pl-4 relative text-pretty">
              <span className="absolute left-0">·</span>
              {gap}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <div className="font-sans font-semibold text-[10px] tracking-[.09em] uppercase text-faint mb-3">
          How this ruleset has changed
        </div>
        <div className="flex flex-col gap-3">
          {school.changelog.map((entry) => (
            <div key={entry.date} className="grid grid-cols-[96px_minmax(0,1fr)] gap-3">
              <span className="font-sans font-semibold text-[11px] text-faintest whitespace-nowrap">
                {displayDate(entry.date)}
              </span>
              <span className="text-[13px] leading-[1.55] text-body text-pretty">{entry.text}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[12.5px] leading-[1.5] text-faint max-w-[62ch] mt-10 text-pretty">
        Rules are recorded from the school&apos;s published documents, quoted as written, and rechecked
        against the source. If a clause here disagrees with what your school tells you, your school is
        right, and we want to know.
      </p>
    </div>
  );
}
