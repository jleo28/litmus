// Demo-only quick-fill text for the paste screen. Never seeded as tracker data.
export interface Sample {
  id: "A" | "B" | "C";
  label: string;
  raw: string;
}

export const SAMPLES: Sample[] = [
  {
    id: "A",
    label: "Sample A",
    raw: "IT Innovation Intern, Hollywood Park / SoFi Stadium\nInglewood, CA (on-site)\n\nHollywood Park is seeking an IT Innovation Intern to support venue technology operations across SoFi Stadium and the YouTube Theater. Start date: August 5, 2026, through the end of the fall season (December 12, 2026). Expected commitment 25–30 hours per week, with occasional event-day evenings and weekends.\n\nResponsibilities include supporting network and AV infrastructure, documenting venue systems, and assisting the innovation team with pilot deployments. Apply online with a resume; the recruiting team will follow up to schedule a screen.",
  },
  {
    id: "B",
    label: "Sample B",
    raw: "AI Program Manager Intern, Mercedes-Benz Research & Development North America (MBRDNA)\nSan Jose, CA\n\nMBRDNA is hiring an AI Program Manager Intern to coordinate delivery across our automated driving and machine learning teams. Full-time, 40 hours per week, on-site in San Jose. Duration: July 20, 2026 – December 18, 2026.\n\nYou will run sprint rituals for two ML pods, maintain the program roadmap, and prepare executive readouts. Apply through our careers site.",
  },
  {
    id: "C",
    label: "Sample C",
    raw: "PRAXIS STUDIO\n1420 5th Street, Santa Monica, CA 90401\n\nJune 2, 2026\n\nDear Amara,\n\nWe are pleased to offer you the position of Summer UX Research Intern at Praxis Studio. This is a paid, full-time internship of 40 hours per week, beginning June 2, 2026 and ending August 15, 2026, based at our Santa Monica office.\n\nIn this role you will run moderated usability sessions, synthesize findings, and present to client teams alongside a senior researcher. The work is directly aligned with your graduate coursework in human-computer interaction.\n\nPlease sign and return a copy of this letter to confirm your acceptance.\n\nSincerely,\nDana Whitfield\nDirector of Research, Praxis Studio",
  },
];
