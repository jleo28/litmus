import { CheckStatus } from "@/lib/types";

export const STATUS_STYLES: Record<
  CheckStatus,
  { chipBg: string; chipColor: string; chipBorder: string; rowTint: string }
> = {
  pass: {
    chipBg: "oklch(0.955 0.035 155)",
    chipColor: "oklch(0.42 0.09 155)",
    chipBorder: "oklch(0.88 0.055 155)",
    rowTint: "transparent",
  },
  warning: {
    chipBg: "oklch(0.96 0.045 85)",
    chipColor: "oklch(0.47 0.1 70)",
    chipBorder: "oklch(0.88 0.06 85)",
    rowTint: "oklch(0.988 0.014 85)",
  },
  blocker: {
    chipBg: "oklch(0.955 0.04 25)",
    chipColor: "oklch(0.48 0.14 25)",
    chipBorder: "oklch(0.88 0.06 25)",
    rowTint: "oklch(0.988 0.012 25)",
  },
};
