import { StandingLevel } from "@/lib/types";

export const LEVELS: [StandingLevel, string][] = [
  ["undergrad", "Undergraduate"],
  ["grad", "Master's"],
  ["phd", "PhD"],
];

export const YEARS: Record<string, string[]> = {
  undergrad: ["Freshman", "Sophomore", "Junior", "Senior"],
  grad: ["Master's · year 1", "Master's · year 2", "Master's · year 3+"],
  phd: ["PhD · year 1–2", "PhD · year 3–4", "PhD · year 5+"],
};

export const SCHOOL_WORDS = [
  "your school's",
  "USC's",
  "UCLA's",
  "Northwestern's",
  "NYU's",
  "Purdue's",
];
