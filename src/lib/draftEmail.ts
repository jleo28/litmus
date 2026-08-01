import { CheckResult, DocType, Fields, Standing } from "@/lib/types";

export interface EmailDraft {
  label: string;
  to: string;
  subject: string;
  body: string;
}

function employerDomain(employer: string): string {
  const first = employer.split(" ")[0]?.toLowerCase().replace(/[^a-z]/g, "");
  return `recruiting@${first || "employer"}.com`;
}

export function buildDrafts(
  fields: Fields,
  standing: Standing,
  checks: CheckResult[],
  docType: DocType,
): EmailDraft[] {
  const isLetter = docType === "letter";
  const blockers = checks.filter((c) => c.status === "blocker");
  const warnings = checks.filter((c) => c.status === "warning");
  const standingLabel = standing.year || "graduate student";

  const listConflicts = (list: CheckResult[]) =>
    list
      .map(
        (c) =>
          `• ${c.title}: ${isLetter ? "my letter" : "the listing"} says ${c.offerValue}; the published rule is ${c.ruleValue}.`,
      )
      .join("\n");

  const drafts: EmailDraft[] = [];

  const oisBody = blockers.length
    ? `Hello,\n\nI'm an F-1 student (${standingLabel}) and I'm looking at a${isLetter ? "n offer from " : " posting from "}${fields.employer} in ${fields.location}, ${fields.start} to ${fields.end} at ${fields.hours || "hours not yet stated"}.\n\nBefore I go further I compared it against the published CPT rules and found conflicts I can't resolve on my own:\n\n${listConflicts([...blockers, ...warnings])}\n\nCould you confirm whether any of these can be worked around, and what my options are for this term? I'd rather adjust the ${isLetter ? "letter" : "role"} now than submit something that can't be authorized.\n\nThank you,\n[Your name] · [School ID]`
    : `Hello,\n\nI'm an F-1 student (${standingLabel}) with ${isLetter ? "a signed offer" : "an opportunity"} from ${fields.employer} in ${fields.location}, ${fields.start} to ${fields.end}, ${fields.hours || "hours TBD"}.\n\nI compared it against the published CPT rules and found no conflicts in the dates, hours, or work location. I'd like to start the CPT request and confirm nothing is missing from my side.\n\nWhat's the earliest appointment or submission slot available? I understand processing takes about 10 business days.\n\nThank you,\n[Your name] · [School ID]`;

  drafts.push({
    label: "To OIS",
    to: "ois@yourschool.edu",
    subject: blockers.length
      ? `CPT question: conflicts on a ${isLetter ? "signed offer" : "posting"} (${fields.employer})`
      : `CPT request, ${fields.employer}, ${fields.start}`,
    body: oisBody,
  });

  if (blockers.length) {
    const asks = blockers
      .map((c) => `• ${c.title}: needs ${c.ruleValue} (currently ${c.offerValue}).`)
      .join("\n");
    drafts.push({
      label: isLetter ? "To the employer" : "To the recruiter",
      to: employerDomain(fields.employer),
      subject: isLetter
        ? "Question on the offer letter: work authorization details"
        : `Question before I apply: ${fields.employer} internship`,
      body: `Hi,\n\nThank you for ${isLetter ? "the offer" : "posting this role"}, I'm genuinely interested.\n\nAs an international student on an F-1 visa, my work authorization has a few fixed requirements, and I want to raise them early rather than after ${isLetter ? "I sign" : "an interview process"}:\n\n${asks}\n\nAre any of these adjustable? If so I'd move ahead right away${isLetter ? " and get the amended letter to my university's international office." : "."}\n\nBest,\n[Your name]`,
    });
  }

  return drafts;
}
