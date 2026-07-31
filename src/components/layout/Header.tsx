"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store/useAppStore";

const STEPS: { label: string; match: (path: string) => boolean }[] = [
  { label: "1 Paste", match: (p) => p === "/" },
  { label: "2 Confirm", match: (p) => p === "/confirm" },
  { label: "3 Results", match: (p) => p.startsWith("/results") },
];

export default function Header() {
  const pathname = usePathname();
  const signedIn = useAppStore((s) => s.auth.signedIn);
  const email = useAppStore((s) => s.auth.email);

  const showSteps = !["/signin", "/tracker"].includes(pathname);
  const activeIdx = STEPS.findIndex((s) => s.match(pathname));

  return (
    <header
      data-noprint="1"
      className="border-b border-[rgba(28,27,25,.09)] bg-surface-raised"
    >
      <div className="max-w-[1280px] mx-auto px-14 h-[62px] flex items-center gap-7">
        <Link
          href="/"
          className="font-serif text-[23px] font-medium tracking-[-0.015em] text-ink !border-0"
        >
          Litmus
        </Link>
        <nav className="ml-auto flex items-center gap-[22px]">
          {showSteps && (
            <div className="flex items-center gap-[10px]">
              {STEPS.map((step, i) => (
                <span
                  key={step.label}
                  className="font-sans font-semibold text-[10.5px] tracking-[.05em] whitespace-nowrap"
                  style={{ color: i === activeIdx ? "#1c1b19" : "#b0ada6" }}
                >
                  {step.label}
                </span>
              ))}
            </div>
          )}
          {signedIn && (
            <Link
              href="/tracker"
              className="font-sans font-semibold text-[10.5px] tracking-[.05em] uppercase whitespace-nowrap !border-0"
              style={{
                color: pathname === "/tracker" ? "#1c1b19" : "#b0ada6",
              }}
            >
              Tracker
            </Link>
          )}
          {signedIn && (
            <span className="text-[12px] text-faintest whitespace-nowrap">
              {email}
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}
