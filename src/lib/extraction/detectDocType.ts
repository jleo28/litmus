import { DocType } from "@/lib/types";

const LETTER_HINTS = [
  "dear ", "pleased to offer", "offer letter", "we are excited to offer",
  "sign and return", "your acceptance", "sincerely,", "this letter",
];
const JD_HINTS = [
  "is seeking", "is hiring", "responsibilities include", "apply online",
  "careers site", "we are looking for", "job description", "qualifications",
];

/** Keyword heuristic, correctable by the student on the confirm screen.
 * A real classifier can replace this without changing the UI contract. */
export function detectDocType(raw: string): DocType {
  const text = raw.toLowerCase();
  if (text.trim().length < 40) return "";

  let letterScore = 0;
  let jdScore = 0;
  for (const hint of LETTER_HINTS) if (text.includes(hint)) letterScore++;
  for (const hint of JD_HINTS) if (text.includes(hint)) jdScore++;

  if (letterScore === 0 && jdScore === 0) return "jd";
  return letterScore > jdScore ? "letter" : "jd";
}
