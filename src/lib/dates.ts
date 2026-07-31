/** Best-effort parse of a free-text date into a Date, or null if it can't be read. */
export function parseFlexibleDate(input: string): Date | null {
  const text = input.trim();
  if (!text) return null;

  const native = new Date(text);
  if (!Number.isNaN(native.getTime())) return native;

  const numeric = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (numeric) {
    const [, m, d, y] = numeric;
    const year = y.length === 2 ? Number(y) + 2000 : Number(y);
    const date = new Date(year, Number(m) - 1, Number(d));
    if (!Number.isNaN(date.getTime())) return date;
  }

  return null;
}

/** Parses a "YYYY-MM-DD" string as local midnight, matching how free-text dates
 * like "August 5, 2026" are parsed, so term-date comparisons don't drift a day
 * near UTC/local boundaries. */
export function parseISODateLocal(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function daysBetween(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

