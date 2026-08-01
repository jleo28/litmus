import { TrackerColumn } from "@/lib/types";

export const TRACKER_COLUMNS: { key: TrackerColumn; title: string; blurb: string; hue: number }[] = [
  { key: "no", title: "Hard no", blurb: "Something only the employer could change, or the window has closed.", hue: 25 },
  { key: "maybe", title: "Maybe", blurb: "Nothing collides yet, but a value is missing or unconfirmed.", hue: 85 },
  { key: "clear", title: "All clear", blurb: "Every rule Litmus can check lines up. OIS still has the final word.", hue: 155 },
];

export const EMPTY_COLUMN_COPY: Record<TrackerColumn, string> = {
  no: "Nothing here. Good.",
  maybe: "No open questions right now.",
  clear: "Nothing clean yet.",
};
