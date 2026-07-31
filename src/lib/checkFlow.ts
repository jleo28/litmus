import { CheckResult, DocType, Fields, Standing, TrackerColumn } from "@/lib/types";

export function computeSignature(fields: Fields, docType: DocType, standing: Standing): string {
  return [
    fields.employer, fields.start, fields.end, fields.hours, fields.location,
    docType, standing.year, standing.finalSemester,
  ].join("|");
}

export function assignColumn(checks: CheckResult[]): TrackerColumn {
  if (checks.some((c) => c.status === "blocker")) return "no";
  if (checks.some((c) => c.status === "warning")) return "maybe";
  return "clear";
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function buildSummaryLead(checks: CheckResult[], docType: DocType): string {
  const docShort = docType === "letter" ? "letter" : "listing";
  const blockers = checks.filter((c) => c.status === "blocker");
  const warnings = checks.filter((c) => c.status === "warning");

  if (!blockers.length && !warnings.length) {
    return `Every rule Litmus can check lines up for this ${docShort}.`;
  }

  const titleFor = (c: CheckResult) => c.title.replace(/: can't be checked$/, "").toLowerCase();
  const parts: string[] = [];
  if (blockers.length) parts.push(`collides with ${joinList(blockers.map(titleFor))}`);
  if (warnings.length) parts.push(`can't confirm ${joinList(warnings.map(titleFor))}`);
  return `This ${docShort} ${parts.join(", and ")}.`;
}

export function summarizeChecks(checks: CheckResult[]): { label: string; isClear: boolean } {
  const nBlock = checks.filter((c) => c.status === "blocker").length;
  const nWarn = checks.filter((c) => c.status === "warning").length;
  const parts: string[] = [];
  if (nBlock) parts.push(`${nBlock} ${nBlock === 1 ? "hard conflict" : "hard conflicts"}`);
  if (nWarn) parts.push(`${nWarn} ${nWarn === 1 ? "warning" : "warnings"}`);
  return { label: parts.length ? parts.join(" · ") : "No conflicts found", isClear: nBlock === 0 && nWarn === 0 };
}
