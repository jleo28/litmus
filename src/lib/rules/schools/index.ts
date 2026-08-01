import { SchoolRules } from "@/lib/rules/types";
import { usc } from "@/lib/rules/schools/usc";

export const SCHOOLS: SchoolRules[] = [usc];

export const DEFAULT_SCHOOL_ID = "usc";

export function getSchool(id: string): SchoolRules {
  return SCHOOLS.find((s) => s.id === id) ?? usc;
}

export function schoolFromEmail(email: string): SchoolRules {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) return usc;
  return SCHOOLS.find((s) => s.emailDomains.includes(domain)) ?? usc;
}
