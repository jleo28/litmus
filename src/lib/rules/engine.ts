import { CheckResult, DocType, Fields, Standing } from "@/lib/types";
import { SchoolRules, TermRule } from "@/lib/rules/types";
import { daysBetween, formatDisplayDate, parseFlexibleDate, parseISODateLocal } from "@/lib/dates";
import { parseHoursMax } from "@/lib/rules/parseHours";
import { checkLocation } from "@/lib/rules/location";

function overlappingTerms(start: Date, end: Date, terms: TermRule[]): TermRule[] {
  return terms.filter((t) => {
    const termStart = parseISODateLocal(t.startDate);
    const termEnd = parseISODateLocal(t.endDate);
    return start <= termEnd && end >= termStart;
  });
}

function nearestTerm(start: Date, terms: TermRule[]): TermRule {
  return terms.reduce((best, t) => {
    const d = Math.abs(daysBetween(start, parseISODateLocal(t.startDate)));
    const bd = Math.abs(daysBetween(start, parseISODateLocal(best.startDate)));
    return d < bd ? t : best;
  }, terms[0]);
}

function unresolvedDateCheck(
  key: string,
  title: string,
  school: SchoolRules,
  source: keyof SchoolRules["citations"],
): CheckResult {
  return {
    key,
    title,
    status: "warning",
    offerValue: "Not a readable date",
    ruleValue: "Needs a valid date",
    nextStep:
      "I couldn't read this as a date. Fix the start and end date fields above so this check can run.",
    source: school.citations[source],
  };
}

export function buildChecks(
  fields: Fields,
  standing: Standing,
  docType: DocType,
  school: SchoolRules,
  now: Date = new Date(),
): CheckResult[] {
  const isLetter = docType === "letter";
  const start = parseFlexibleDate(fields.start);
  const end = parseFlexibleDate(fields.end);

  if (!start || !end) {
    return [
      unresolvedDateCheck("term", "CPT term", school, "term"),
      unresolvedDateCheck("gap", "Start-date gap", school, "gap"),
      unresolvedDateCheck("deadline", "Application deadline", school, "deadline"),
      buildHoursCheck(fields, standing, school, [school.terms[0]], isLetter),
      buildLocationCheck(fields, school),
    ];
  }

  const overlaps = overlappingTerms(start, end, school.terms);
  const relevantTerms = overlaps.length ? overlaps : [nearestTerm(start, school.terms)];
  const primaryTerm = relevantTerms.reduce((earliest, t) =>
    parseISODateLocal(t.startDate) < parseISODateLocal(earliest.startDate) ? t : earliest,
  );

  const termCheck = buildTermCheck(start, end, overlaps, primaryTerm, school);
  const gapCheck = buildGapCheck(start, primaryTerm, school);
  const deadlineCheck = buildDeadlineCheck(now, primaryTerm, school);
  const hoursCheck = buildHoursCheck(fields, standing, school, relevantTerms, isLetter);
  const locationCheck = buildLocationCheck(fields, school);

  return [termCheck, gapCheck, deadlineCheck, hoursCheck, locationCheck];
}

function buildTermCheck(
  start: Date,
  end: Date,
  overlaps: TermRule[],
  primaryTerm: TermRule,
  school: SchoolRules,
): CheckResult {
  const offerValue = `${formatDisplayDate(start)} – ${formatDisplayDate(end)}`;
  const source = school.citations.term;

  if (overlaps.length === 0) {
    return {
      key: "term",
      title: "CPT term",
      status: "blocker",
      offerValue,
      ruleValue: `Doesn't match a published ${school.name} term`,
      nextStep: `These dates don't fall inside any published ${school.name} CPT term. Ask whether the dates can move to align with ${primaryTerm.name} (${primaryTerm.start} – ${primaryTerm.end}).`,
      source,
    };
  }

  if (overlaps.length > 1) {
    const names = overlaps.map((t) => t.name).join(" and ");
    return {
      key: "term",
      title: "CPT term",
      status: "warning",
      offerValue,
      ruleValue: `Spans ${names}`,
      nextStep:
        "This role crosses two terms, so it needs two authorizations with two different hours caps. Flag the split to OIS up front.",
      source,
    };
  }

  const term = overlaps[0];
  return {
    key: "term",
    title: "CPT term",
    status: "pass",
    offerValue,
    ruleValue: `${term.name} · ${term.start} – ${term.end}`,
    nextStep: `The bulk of this role sits inside the ${term.name.split(" ")[0].toLowerCase()} term, so every rule below is the ${term.name.split(" ")[0].toLowerCase()} rule.`,
    source,
  };
}

function buildGapCheck(start: Date, term: TermRule, school: SchoolRules): CheckResult {
  const termStart = parseISODateLocal(term.startDate);
  const gapDays = daysBetween(termStart, start);
  const source = school.citations.gap;

  if (gapDays < 0) {
    return {
      key: "gap",
      title: "Start-date gap",
      status: "blocker",
      offerValue: `Starts ${formatDisplayDate(start)}`,
      ruleValue: `Not before ${term.start}`,
      nextStep: `${Math.abs(gapDays)} day${Math.abs(gapDays) === 1 ? "" : "s"} of this role fall before ${term.name} can start. Ask whether the first day can move to ${term.start}, frame it as a compliance date, not a preference.`,
      source,
    };
  }

  return {
    key: "gap",
    title: "Start-date gap",
    status: "pass",
    offerValue: `Starts ${formatDisplayDate(start)}`,
    ruleValue: `${term.name} open from ${term.start}`,
    nextStep: "The start date sits inside the authorization window, no gap.",
    source,
  };
}

function buildDeadlineCheck(now: Date, term: TermRule, school: SchoolRules): CheckResult {
  const deadline = parseISODateLocal(term.applicationDeadlineDate);
  const source = school.citations.deadline;
  const closed = now > deadline;

  return {
    key: "deadline",
    title: "Application deadline",
    status: closed ? "blocker" : "pass",
    offerValue: `Applying ${formatDisplayDate(now)}`,
    ruleValue: `${term.name} window ${closed ? "closed" : "closes"} ${term.applicationDeadline}`,
    nextStep: closed
      ? `The ${term.name} window has closed, so this role as posted can't be authorized in time. Ask whether it can shift to the next term, and get on OIS's calendar this week to confirm.`
      : "Submitted inside the window. Keep a copy of the confirmation for your records.",
    source,
  };
}

function effectiveHoursCap(
  terms: TermRule[],
  finalSemester: Standing["finalSemester"],
  school: SchoolRules,
): { cap: number | null; label: string } {
  const active = terms.map((t) => {
    const lifted = finalSemester === "yes" && t.finalSemesterLiftsCap && school.finalSemesterFullTime;
    return { term: t, cap: lifted ? null : t.hoursCap };
  });

  const numeric = active.filter((a) => a.cap !== null) as { term: TermRule; cap: number }[];
  if (numeric.length === 0) {
    return { cap: null, label: "Full-time allowed" };
  }

  const strictest = numeric.reduce((min, a) => (a.cap < min.cap ? a : min));
  const label =
    active.length > 1
      ? `${strictest.cap} hrs/wk max after ${strictest.term.start}`
      : `${strictest.cap} hrs/wk max (${strictest.term.name})`;
  return { cap: strictest.cap, label };
}

function buildHoursCheck(
  fields: Fields,
  standing: Standing,
  school: SchoolRules,
  terms: TermRule[],
  isLetter: boolean,
): CheckResult {
  const source = school.citations.hours;
  const { cap, label } = effectiveHoursCap(terms, standing.finalSemester, school);
  const raw = fields.hours.trim();

  if (!raw) {
    return {
      key: "hours",
      title: "Weekly hours: can't be checked",
      status: "warning",
      offerValue: "Not stated",
      ruleValue: label,
      nextStep: isLetter
        ? "An offer letter has to state exact weekly hours before OIS will accept it. Ask for a letter that names a single number."
        : "Most public listings leave hours out, and Litmus won't guess. Ask the recruiter for a number in writing, if it lands above the cap during the term, this becomes a hard conflict.",
      source,
    };
  }

  const parsed = parseHoursMax(raw);
  if (parsed === null) {
    return {
      key: "hours",
      title: "Weekly hours: can't be checked",
      status: "warning",
      offerValue: raw,
      ruleValue: label,
      nextStep: "I couldn't read a number of hours from this value. Enter a single figure, like \"20\".",
      source,
    };
  }

  if (cap !== null && parsed > cap) {
    return {
      key: "hours",
      title: "Weekly hours",
      status: "blocker",
      offerValue: raw,
      ruleValue: label,
      nextStep: `You'd need the role rewritten to ${cap} hours or fewer during the term. Ask whether the extra hours can move outside the term instead.`,
      source,
    };
  }

  return {
    key: "hours",
    title: "Weekly hours",
    status: "pass",
    offerValue: raw,
    ruleValue: label,
    nextStep:
      cap === null
        ? "Full-time is permitted for this term. If any part of the role slips into a term with a cap, that cap starts applying."
        : "Inside the cap for this term, no action needed.",
    source,
  };
}

function buildLocationCheck(fields: Fields, school: SchoolRules): CheckResult {
  const source = school.citations.location;
  const location = fields.location.trim();

  if (!location) {
    return {
      key: "location",
      title: "Work location: can't be checked",
      status: "warning",
      offerValue: "Not stated",
      ruleValue: school.commuteZoneLabel,
      nextStep: "Add a city and state so this can be checked against the approved commute zone.",
      source,
    };
  }

  const verdict = checkLocation(location, school);
  if (verdict === "in-zone") {
    return {
      key: "location",
      title: "Work location",
      status: "pass",
      offerValue: location,
      ruleValue: school.commuteZoneLabel,
      nextStep: "Inside the approved commute zone, no action needed.",
      source,
    };
  }

  if (verdict === "out-of-zone") {
    return {
      key: "location",
      title: "Work location",
      status: "blocker",
      offerValue: location,
      ruleValue: school.commuteZoneLabel,
      nextStep:
        "This is likely the conflict that ends the role as posted. Ask whether it can be based at an in-zone site, or whether a remote arrangement reporting to a local office is possible, then take that answer to OIS.",
      source,
    };
  }

  return {
    key: "location",
    title: "Work location: can't be checked",
    status: "warning",
    offerValue: location,
    ruleValue: school.commuteZoneLabel,
    nextStep:
      "I can't confirm this city is inside the approved commute zone. Check the distance yourself, or ask OIS directly.",
    source,
  };
}
