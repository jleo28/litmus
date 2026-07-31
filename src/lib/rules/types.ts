export interface TermRule {
  id: string;
  name: string;
  start: string;
  end: string;
  startDate: string;
  endDate: string;
  applicationDeadline: string;
  applicationDeadlineDate: string;
  hoursCap: number | null;
  hoursCapLabel: string;
  finalSemesterLiftsCap: boolean;
}

export interface SchoolCitation {
  name: string;
  quote: string;
  cite: string;
  url?: string;
}

export interface SchoolRules {
  id: string;
  name: string;
  emailDomains: string[];
  terms: TermRule[];
  commuteZoneLabel: string;
  commuteCities: string[];
  finalSemesterFullTime: boolean;
  citations: {
    term: SchoolCitation;
    gap: SchoolCitation;
    deadline: SchoolCitation;
    hours: SchoolCitation;
    location: SchoolCitation;
  };
}
