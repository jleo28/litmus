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

export function summarizeChecks(checks: CheckResult[]): { label: string; isClear: boolean } {
  const nBlock = checks.filter((c) => c.status === "blocker").length;
  const nWarn = checks.filter((c) => c.status === "warning").length;
  const parts: string[] = [];
  if (nBlock) parts.push(`${nBlock} ${nBlock === 1 ? "hard conflict" : "hard conflicts"}`);
  if (nWarn) parts.push(`${nWarn} ${nWarn === 1 ? "warning" : "warnings"}`);
  return { label: parts.length ? parts.join(" · ") : "No conflicts found", isClear: nBlock === 0 && nWarn === 0 };
}
