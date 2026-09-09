export type RuleCategory =
  | "Timing"
  | "Hours"
  | "Location"
  | "Documentation"
  | "Eligibility";

export type RuleSeverity = "blocker" | "warning";

export interface KBRule {
  id: string;
  category: RuleCategory;
  severity: RuleSeverity;
  summary: string;
  quote: string;
  cite: string;
  url: string;
  effective: string;
  verified: string;
  powers: string[];
  stale?: boolean;
  staleNote?: string;
  caveat?: string;
  context?: string;
}

export interface KBChangelogEntry {
  date: string;
  text: string;
}

export interface KBCoverage {
  confident: string[];
  gaps: string[];
  note: string;
}

export interface KBSchool {
  id: string;
  name: string;
  short: string;
  domains: string[];
  office: string;
  ruleCount: number;
  coverage: KBCoverage;
  rules: KBRule[];
  changelog: KBChangelogEntry[];
}

export interface KnowledgeBase {
  schema: number;
  note: string;
  schools: KBSchool[];
}

/** Fixed display order for the Rulebook screen; empty groups are omitted. */
export const RULE_CATEGORY_ORDER: RuleCategory[] = [
  "Timing",
  "Hours",
  "Location",
  "Documentation",
  "Eligibility",
];
