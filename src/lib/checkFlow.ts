import { CheckResult, CurrentResult, DocType, Fields, SavedCheck, Standing, TrackerColumn } from "@/lib/types";
import { extractTitle } from "@/lib/extraction/extractTitle";

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

export function joinList(items: string[]): string {
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

export function buildTrackerReason(checks: CheckResult[], column: TrackerColumn): string {
  if (column === "clear") return "No conflicts found. Confirm with OIS before you accept.";

  const titleFor = (c: CheckResult) => c.title.replace(/: can't be checked$/, "").toLowerCase();
  if (column === "no") {
    const blockers = checks.filter((c) => c.status === "blocker");
    return `${blockers.length} hard ${blockers.length === 1 ? "conflict" : "conflicts"}: ${joinList(blockers.map(titleFor))}.`;
  }

  const warnings = checks.filter((c) => c.status === "warning");
  return `Nothing collides yet. Unresolved: ${joinList(warnings.map(titleFor))}.`;
}

export function buildTrackerSubtitle(board: SavedCheck["board"], checks: SavedCheck[]): string {
  const total = checks.length;
  const noun = board === "jd" ? (total === 1 ? "listing" : "listings") : total === 1 ? "offer" : "offers";
  if (!total) return `No ${noun === "listing" ? "listings" : noun} checked yet.`;

  const no = checks.filter((c) => c.column === "no").length;
  const maybe = checks.filter((c) => c.column === "maybe").length;
  const clear = checks.filter((c) => c.column === "clear").length;
  const parts: string[] = [];
  if (no) parts.push(`${no} ${no === 1 ? "isn't" : "aren't"} worth ${no === 1 ? "an application" : "applications"}`);
  if (maybe) parts.push(`${maybe} ${maybe === 1 ? "is" : "are"} waiting on more information`);
  if (clear) parts.push(`${clear} ${clear === 1 ? "is" : "are"} clean`);
  return `${total} ${noun} checked. ${parts.join(", ")}.`;
}

export function buildSavedCheckPayload(result: CurrentResult): Omit<SavedCheck, "id" | "checkedAt"> {
  const isLetter = result.docType === "letter";
  return {
    board: isLetter ? "offer" : "jd",
    docType: result.docType,
    title: extractTitle(result.raw, result.docType),
    fields: result.fields,
    standing: result.standing,
    schoolId: result.schoolId,
    checks: result.checks,
    completeness: result.completeness,
    column: assignColumn(result.checks),
  };
}
