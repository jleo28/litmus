import { KBRule } from "./types";

/** Matches against summary, quote, category, id, and powers, per the v3
 * Rulebook spec. A blank query matches everything. */
export function searchRules(rules: KBRule[], query: string): KBRule[] {
  const q = query.trim().toLowerCase();
  if (!q) return rules;

  return rules.filter((r) => {
    if (r.summary.toLowerCase().includes(q)) return true;
    if (r.quote.toLowerCase().includes(q)) return true;
    if (r.category.toLowerCase().includes(q)) return true;
    if (r.id.toLowerCase().includes(q)) return true;
    if (r.powers.some((p) => p.toLowerCase().includes(q))) return true;
    return false;
  });
}
