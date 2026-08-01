import { DocType, EMPTY_FIELDS, Fields, MissingMap } from "@/lib/types";
import { US_STATE_CODES } from "@/lib/usStates";

const DATE_SRC =
  "(?:(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\\.?\\s+\\d{1,2},?\\s+\\d{4})|(?:\\d{1,2}\\/\\d{1,2}\\/\\d{2,4})";
const DATE_RE = new RegExp(DATE_SRC, "gi");
const RANGE_RE = new RegExp(`(${DATE_SRC})\\s*(?:[-–]|to)\\s*(${DATE_SRC})`, "i");
const START_ANCHOR_RE = new RegExp(
  `(?:start(?:s|ing|\\s+date)?|begin(?:s|ning)?|from)[^.\\n]{0,60}?(${DATE_SRC})`,
  "i",
);
const END_ANCHOR_RE = new RegExp(
  `(?:end(?:s|ing|\\s+date)?|through|until|last\\s+day)[^.\\n]{0,60}?(${DATE_SRC})`,
  "i",
);

const HOURS_RE = /(\d{1,3})\s*(?:[-–]\s*(\d{1,3}))?\s*hours?\s*(?:per|a|\/)?\s*week/i;

const LOCATION_RE = /\b([A-Z][A-Za-z.' ]{1,28}?),\s*([A-Z]{2})\b/g;

function extractDates(raw: string): { start: string; end: string } {
  const range = raw.match(RANGE_RE);
  if (range) return { start: range[1], end: range[2] };

  const startAnchor = raw.match(START_ANCHOR_RE);
  const endAnchor = raw.match(END_ANCHOR_RE);
  if (startAnchor || endAnchor) {
    return { start: startAnchor?.[1] ?? "", end: endAnchor?.[1] ?? "" };
  }

  const all = raw.match(DATE_RE) ?? [];
  return { start: all[0] ?? "", end: all[1] ?? "" };
}

function extractHours(raw: string): string {
  const match = raw.match(HOURS_RE);
  if (!match) return "";
  const [, first, second] = match;
  return second ? `${first}–${second} hrs/wk` : `${first} hrs/wk`;
}

function extractLocation(raw: string): string {
  LOCATION_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = LOCATION_RE.exec(raw))) {
    const [, city, state] = match;
    if (US_STATE_CODES.has(state.toUpperCase()) && !/^\d/.test(city)) {
      return `${city.trim()}, ${state.toUpperCase()}`;
    }
  }
  return "";
}

function extractEmployer(raw: string, isLetter: boolean): string {
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return "";

  if (isLetter) {
    const first = lines[0];
    return /^\d/.test(first) ? "" : first;
  }

  const first = lines[0];
  const commaIdx = first.indexOf(",");
  if (commaIdx > -1) return first.slice(commaIdx + 1).trim();

  const seekMatch = raw.match(/\b([A-Z][\w&.,'\-\s]{2,50}?)\s+is\s+(?:seeking|hiring)/);
  if (seekMatch) return seekMatch[1].trim();

  return first;
}

/** Best-effort v1 extraction: regex and keyword heuristics, not an NLP model.
 * Anything it can't find comes back blank and flagged in `missing`, by design. */
export function extractFields(raw: string, docType: DocType): { fields: Fields; missing: MissingMap } {
  if (!raw.trim()) return { fields: EMPTY_FIELDS, missing: {} };

  const isLetter = docType === "letter";
  const { start, end } = extractDates(raw);
  const fields: Fields = {
    employer: extractEmployer(raw, isLetter),
    start,
    end,
    hours: extractHours(raw),
    location: extractLocation(raw),
  };

  const missing: MissingMap = {};
  (Object.keys(fields) as (keyof Fields)[]).forEach((key) => {
    if (!fields[key].trim()) missing[key] = true;
  });

  return { fields, missing };
}
