import { SchoolRules } from "@/lib/rules/types";

// All values below are user-reported and pending OIS verification.
// See docs/design/README.md, "Open questions for the build", #1.
export const usc: SchoolRules = {
  id: "usc",
  name: "USC",
  emailDomains: ["usc.edu"],
  terms: [
    {
      id: "summer2026",
      name: "Summer 2026",
      start: "May 18, 2026",
      end: "Aug 14, 2026",
      startDate: "2026-05-18",
      endDate: "2026-08-14",
      applicationDeadline: "Apr 15, 2026",
      applicationDeadlineDate: "2026-04-15",
      hoursCap: null,
      hoursCapLabel: "Full-time allowed",
      finalSemesterLiftsCap: false,
    },
    {
      id: "fall2026",
      name: "Fall 2026",
      start: "Aug 24, 2026",
      end: "Dec 11, 2026",
      startDate: "2026-08-24",
      endDate: "2026-12-11",
      applicationDeadline: "Jul 1, 2026",
      applicationDeadlineDate: "2026-07-01",
      hoursCap: 20,
      hoursCapLabel: "20 hrs/wk max",
      finalSemesterLiftsCap: true,
    },
  ],
  commuteZoneLabel: "LA / Orange / Ventura counties",
  finalSemesterFullTime: true,
  commuteCities: [
    "los angeles", "inglewood", "santa monica", "culver city", "pasadena",
    "long beach", "anaheim", "irvine", "santa ana", "thousand oaks",
    "ventura", "burbank", "glendale", "torrance", "compton", "pomona",
    "west hollywood", "beverly hills", "el segundo", "hawthorne", "downey",
    "carson", "norwalk", "whittier", "fullerton", "costa mesa",
    "newport beach", "huntington beach", "oxnard", "camarillo",
    "simi valley", "san fernando", "north hollywood", "van nuys",
    "woodland hills", "sherman oaks", "encino", "marina del rey",
    "playa vista", "manhattan beach", "redondo beach", "el monte",
    "alhambra", "monterey park", "gardena", "lakewood", "bellflower",
    "montebello", "arcadia", "orange", "tustin", "mission viejo",
    "san clemente", "westlake village", "moorpark", "port hueneme",
  ],
  citations: {
    term: {
      name: "CPT term dates",
      quote:
        "CPT authorization is granted per academic term and may not begin before the first day of that term or extend past its last day.",
      cite: "OIS · Employment › CPT › Authorization periods",
    },
    gap: {
      name: "Authorization start",
      quote:
        "You may not begin working until the start date printed on your CPT I-20. Work performed before that date is unauthorized employment.",
      cite: "OIS · Employment › CPT › Before you start",
    },
    deadline: {
      name: "Application deadlines",
      quote:
        "CPT requests must be submitted at least 10 business days before the term begins. Requests received after the posted deadline are processed for the following term.",
      cite: "OIS · Employment › CPT › Deadlines",
    },
    hours: {
      name: "Hours limits",
      quote:
        "During fall and spring, CPT is limited to 20 hours per week. Full-time CPT is permitted during summer, and during a student's final semester when coursework is complete.",
      cite: "OIS · Employment › CPT › Part-time vs full-time",
    },
    location: {
      name: "Approved commute zone",
      quote:
        "The employment site must be within a reasonable commuting distance of the University Park or Health Sciences campus, generally Los Angeles, Orange and Ventura counties.",
      cite: "OIS · Employment › CPT › Work location",
    },
  },
};
