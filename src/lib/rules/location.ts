import { SchoolRules } from "@/lib/rules/types";
import { US_STATE_CODES } from "@/lib/usStates";

export type LocationVerdict = "in-zone" | "out-of-zone" | "unknown";

/** Splits "City, ST" into its parts. Falls back to treating the whole string as a city name. */
export function splitCityState(location: string): { city: string; state: string | null } {
  const match = location.trim().match(/^(.+?),\s*([A-Za-z]{2})\.?$/);
  if (!match) return { city: location.trim(), state: null };
  const state = match[2].toUpperCase();
  return { city: match[1].trim(), state: US_STATE_CODES.has(state) ? state : null };
}

export function checkLocation(location: string, school: SchoolRules): LocationVerdict {
  const { city, state } = splitCityState(location);
  if (!city) return "unknown";
  if (state && state !== "CA") return "out-of-zone";
  if (school.commuteCities.includes(city.toLowerCase())) return "in-zone";
  return "unknown";
}
