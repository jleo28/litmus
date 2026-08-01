import { DocType } from "@/lib/types";

/** Best-effort job-title guess for tracker display only; not one of the five checked fields. */
export function extractTitle(raw: string, docType: DocType): string {
  if (docType === "letter") {
    const match = raw.match(/position of ([^.,\n]+?)(?:\s+at\s+|,|\.|\n|$)/i);
    return match ? match[1].trim() : "";
  }

  const first = raw.split("\n").map((l) => l.trim()).find(Boolean) ?? "";
  const commaIdx = first.indexOf(",");
  return (commaIdx > -1 ? first.slice(0, commaIdx) : first).trim();
}
