import { CheckResult, DocType } from "@/lib/types";

export interface WhatNowStep {
  title: string;
  detail: string;
  action: string;
  openDraftIndex?: number;
  print?: boolean;
}

export interface WhatNowContent {
  headline: string;
  body: string;
  foot: string;
  steps: WhatNowStep[];
}

export function buildWhatNow(checks: CheckResult[], docType: DocType): WhatNowContent {
  const isLetter = docType === "letter";
  const blockers = checks.filter((c) => c.status === "blocker");
  const warnings = checks.filter((c) => c.status === "warning");

  if (isLetter && !blockers.length) {
    return {
      headline: "Start the authorization today, not next week.",
      body: "Nothing in this letter collides with the published rules, and it has everything OIS needs. Processing takes about 10 business days, and you can't work a single day before the date printed on your CPT I-20.",
      foot: "Litmus can't authorize anything. OIS issues the I-20, this is the shortest path to asking them.",
      steps: [
        { title: "Email OIS to open the CPT request", detail: "Draft is written and cites the checks that passed.", action: "Open the draft", openDraftIndex: 0 },
        { title: "Keep the signed letter on letterhead", detail: "Attach the PDF, all six required elements are present.", action: "Print the summary", print: true },
        { title: "Don't start before your I-20 date", detail: "Even one day early counts as unauthorized employment.", action: "" },
      ],
    };
  }

  if (isLetter && blockers.length) {
    return {
      headline: "Don't sign it yet: get the letter amended first.",
      body: "The offer is real; the letter as written can't be authorized. Amended letters are routine for employers who've hired international students before, and asking now is far cheaper than withdrawing later.",
      foot: "Ask the employer first, OIS second, OIS will want to see the amended letter anyway.",
      steps: [
        { title: "Ask the employer for an amended letter", detail: "The draft names exactly which values need to change.", action: "Open the draft", openDraftIndex: 1 },
        { title: "Flag the conflict to OIS in parallel", detail: "So you're not waiting on two queues in sequence.", action: "Open the draft", openDraftIndex: 0 },
        { title: "Hold off on signing", detail: "A signed letter is harder to renegotiate than an unsigned one.", action: "" },
      ],
    };
  }

  if (!blockers.length) {
    return {
      headline: warnings.length ? "Worth applying, with one thing to nail down." : "Nothing here collides. Apply.",
      body: warnings.length
        ? "No hard conflicts, but one value couldn't be checked. Apply now and get that answer in writing during the recruiter screen, before you accept anything."
        : "Every rule Litmus can check lines up. Apply, and confirm with OIS before you accept, the letter still has to be reviewed once you have it.",
      foot: "Recheck the signed letter here when it arrives, postings and letters often disagree.",
      steps: [
        { title: "Hit apply", detail: "This posting is worth your time.", action: "" },
        {
          title: warnings.length ? "Ask the recruiter for exact weekly hours" : "Ask for the offer in writing",
          detail: warnings.length ? "Get a single number in writing, not a range." : "You'll need dates, hours, address, and letterhead.",
          action: "Open the draft",
          openDraftIndex: 0,
        },
        { title: "Confirm with OIS before you accept", detail: "One short email; do it while the offer is warm.", action: "Open the draft", openDraftIndex: 0 },
      ],
    };
  }

  const closed = blockers.some((c) => c.key === "deadline");
  return {
    headline: "Not recommended: this one isn't worth the application.",
    body: closed
      ? "The authorization window for this term has already closed, so no version of this listing can be approved in time. A company won't hold a posting for a visa timeline, so treat this as a no for now and ask about the next term instead."
      : `There ${blockers.length === 1 ? "is one conflict" : `are ${blockers.length} conflicts`} between this listing and the published rules, and every one of them is something only the employer could change. Companies rarely rewrite a posting for someone who hasn't interviewed yet, so this is a poor use of your next two weeks.`,
    foot: "This isn't a rejection, it's a cost estimate. Spend the time on a listing that already fits, and keep this employer for a later term.",
    steps: [
      { title: "Pass on this one for now", detail: closed ? "Nothing you or the employer can do gets it authorized this term." : "The changes needed sit entirely on the employer's side.", action: "" },
      { title: "Ask OIS whether any version of it works", detail: "Worth one short email before you write it off completely.", action: "Open the draft", openDraftIndex: 0 },
      { title: "Only if you're set on this employer", detail: "Ask about a compliant role or a later term. Expect a slow answer, and don't wait on it.", action: "Open the draft", openDraftIndex: 1 },
    ],
  };
}
