export type DocType = "" | "jd" | "letter";

export type StandingLevel = "" | "undergrad" | "grad" | "phd";
export type FinalSemester = "" | "yes" | "no";

export type FieldKey = "employer" | "start" | "end" | "hours" | "location";
export type Fields = Record<FieldKey, string>;
export type MissingMap = Partial<Record<FieldKey, boolean>>;

export const EMPTY_FIELDS: Fields = {
  employer: "",
  start: "",
  end: "",
  hours: "",
  location: "",
};

export type CheckStatus = "pass" | "warning" | "blocker";

export interface CitationSource {
  name: string;
  quote: string;
  cite: string;
  url?: string;
}

export interface CheckResult {
  key: string;
  title: string;
  status: CheckStatus;
  offerValue: string;
  ruleValue: string;
  nextStep: string;
  source: CitationSource;
}

export interface CompletenessItem {
  label: string;
  ok: boolean;
  note?: string;
}

export interface Standing {
  level: StandingLevel;
  year: string;
  finalSemester: FinalSemester;
}

export const EMPTY_STANDING: Standing = { level: "", year: "", finalSemester: "" };

export interface CurrentResult {
  docType: DocType;
  raw: string;
  fields: Fields;
  standing: Standing;
  schoolId: string;
  checks: CheckResult[];
  completeness: CompletenessItem[];
}

export type TrackerBoard = "jd" | "offer";
export type TrackerColumn = "no" | "maybe" | "clear";

export interface SavedCheck {
  id: string;
  board: TrackerBoard;
  docType: DocType;
  fields: Fields;
  standing: Standing;
  schoolId: string;
  checks: CheckResult[];
  completeness: CompletenessItem[];
  column: TrackerColumn;
  checkedAt: string;
}
