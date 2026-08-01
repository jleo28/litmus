/** Reads a free-text hours value ("40 hrs/wk", "25-30 hours/week", "20") into its
 * highest weekly-hours figure, so a stated range is checked against the strictest reading. */
export function parseHoursMax(input: string): number | null {
  const text = input.trim();
  if (!text) return null;

  const match = text.match(/(\d{1,3})\s*(?:[-–to]{1,4}\s*(\d{1,3}))?/);
  if (!match) return null;

  const first = Number(match[1]);
  const second = match[2] ? Number(match[2]) : null;
  if (Number.isNaN(first)) return null;

  return second !== null && !Number.isNaN(second) ? Math.max(first, second) : first;
}
