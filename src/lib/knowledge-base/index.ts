import raw from "./rules.json";
import { KBSchool, KnowledgeBase } from "./types";

const kb = raw as KnowledgeBase;

export const KB_SCHOOLS: KBSchool[] = kb.schools;

export const DEFAULT_KB_SCHOOL_ID = "usc";

export function getKBSchool(id: string): KBSchool {
  return KB_SCHOOLS.find((s) => s.id === id) ?? KB_SCHOOLS[0];
}

/** Maps a signed-in user to a ruleset by their email domain, same convention
 * as `schoolFromEmail` in `@/lib/rules/schools`. Falls back to the default
 * school when the domain isn't recognized or no email is given. */
export function kbSchoolFromEmail(email: string | undefined | null): KBSchool {
  const domain = email?.split("@")[1]?.toLowerCase().trim();
  if (!domain) return getKBSchool(DEFAULT_KB_SCHOOL_ID);
  return KB_SCHOOLS.find((s) => s.domains.includes(domain)) ?? getKBSchool(DEFAULT_KB_SCHOOL_ID);
}

export * from "./types";
