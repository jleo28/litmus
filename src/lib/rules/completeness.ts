import { CompletenessItem, DocType, Fields } from "@/lib/types";
import { parseFlexibleDate } from "@/lib/dates";
import { parseHoursMax } from "@/lib/rules/parseHours";

export function buildCompleteness(
  fields: Fields,
  docType: DocType,
  raw: string,
): CompletenessItem[] {
  const isLetter = docType === "letter";
  const hoursRaw = fields.hours.trim();
  const isRange = /[-–]|to\s/i.test(hoursRaw);
  const datesOk = !!parseFlexibleDate(fields.start) && !!parseFlexibleDate(fields.end);
  const hasSignatureBlock = /sincerely|regards,/i.test(raw);

  const items: CompletenessItem[] = [
    { label: "Employer legal name", ok: !!fields.employer.trim() },
    {
      label: "Physical work address",
      ok: !!fields.location.trim(),
      note: fields.location.trim() ? undefined : "A city and state weren't found.",
    },
    {
      label: "Job description aligned to your major",
      ok: false,
      note: "Litmus can't verify this automatically, check it yourself.",
    },
    {
      label: "Exact weekly hours",
      ok: !!hoursRaw && !isRange && parseHoursMax(hoursRaw) !== null,
      note: !hoursRaw
        ? "Not stated."
        : isRange
          ? "That's a range, OIS needs a single number."
          : undefined,
    },
    { label: "Start and end dates", ok: datesOk },
    {
      label: "Official letterhead + signature",
      ok: isLetter && hasSignatureBlock,
      note: !isLetter
        ? "This is a posting, not a letter. You'll need one if you're offered the role."
        : hasSignatureBlock
          ? undefined
          : "Couldn't find a signature block, make sure the letter includes one.",
    },
  ];

  return items;
}
