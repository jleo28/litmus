"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const POINTS: { mark: string; color: string; text: string }[] = [
  {
    mark: "✓",
    color: "oklch(0.5 0.09 155)",
    text: "Your checks, sorted into hard no, maybe, and all clear, so you can see where your time is going.",
  },
  {
    mark: "✓",
    color: "oklch(0.5 0.09 155)",
    text: "Separate boards for listings you're considering and offers you've received, because the stakes differ.",
  },
  {
    mark: "✓",
    color: "oklch(0.5 0.09 155)",
    text: "Your school's rules preset from your email domain, so you stop seeing “your school's” everywhere.",
  },
  {
    mark: "✕",
    color: "#a3a09a",
    text: "No I-20, no SEVIS number, no immigration record. Litmus never becomes a place your status is stored.",
  },
];

export default function SigninScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    searchParams.get("error") ? "error" : "idle",
  );

  async function handleSignin() {
    if (!email.trim()) return;
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setStatus(error ? "error" : "sent");
  }

  return (
    <div className="pt-[78px] pb-16 grid grid-cols-[minmax(0,1fr)_380px] gap-[72px] items-start animate-lit-in">
      <div className="min-w-0 max-w-[52ch]">
        <div className="font-sans font-semibold text-[10px] tracking-[.09em] uppercase text-faint mb-3.5">
          Optional, and only for this
        </div>
        <h1 className="font-serif text-[38px] leading-[1.15] font-normal tracking-[-0.02em] mb-4">
          Keep a record of what you&apos;ve checked.
        </h1>
        <p className="text-[15.5px] leading-[1.6] text-body-muted mb-7 text-pretty">
          An account does one thing: it saves your checks so you can see, at a
          glance, which of your applications are worth your time. Litmus
          still won&apos;t decide your eligibility, and it still isn&apos;t
          your school.
        </p>
        <div className="flex flex-col gap-3.5">
          {POINTS.map((p) => (
            <div key={p.text} className="grid grid-cols-[16px_minmax(0,1fr)] gap-3 items-baseline">
              <span className="font-sans font-semibold text-[11px]" style={{ color: p.color }}>
                {p.mark}
              </span>
              <span className="text-[13.5px] leading-[1.55] text-body text-pretty">{p.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface-raised border border-[rgba(28,27,25,.12)] rounded-[6px] p-[26px]">
        <div className="font-serif text-[21px] font-medium tracking-[-0.01em] mb-[18px]">
          Sign in to save this check
        </div>

        {status === "sent" ? (
          <div className="text-[13.5px] leading-[1.55] text-body">
            Check <strong className="font-semibold">{email.trim()}</strong> for a sign-in link.
            It&apos;ll bring you right back here, signed in.
          </div>
        ) : (
          <>
            <label htmlFor="email" className="block text-[12px] font-medium text-label mb-[7px]">
              School email
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@usc.edu"
              className="w-full px-[13px] py-[11px] text-[13.5px] text-ink bg-surface-input border border-[rgba(28,27,25,.16)] rounded-[4px] outline-none mb-2 focus:border-[oklch(0.48_0.075_250_/_0.55)] focus:shadow-[0_0_0_3px_oklch(0.48_0.075_250_/_0.09)]"
            />
            <div className="text-[11.5px] leading-[1.45] text-faint mb-[18px]">
              We use the domain to set your school&apos;s rules. No transcript, no
              I-20, no SEVIS number.
            </div>
            {status === "error" && (
              <div className="text-[11.5px] text-[oklch(0.48_0.14_25)] mb-2">
                {searchParams.get("error")
                  ? "That sign-in link didn't work, it may have expired. Request a new one."
                  : "Couldn't send that link, check the address and try again."}
              </div>
            )}
            <button
              onClick={handleSignin}
              disabled={status === "sending"}
              className="w-full py-[13px] text-[14px] font-medium rounded-[4px] cursor-pointer bg-ink text-[#fbfaf8] border border-ink hover:bg-[#332f2a] disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Email me a sign-in link"}
            </button>
            <div className="flex items-center gap-3 my-[18px]">
              <span className="h-px bg-[rgba(28,27,25,.12)] flex-1" />
              <span className="font-sans font-semibold text-[9.5px] tracking-[.1em] uppercase text-faintest">
                or
              </span>
              <span className="h-px bg-[rgba(28,27,25,.12)] flex-1" />
            </div>
            <button
              disabled
              title="Not wired up to a school identity provider yet"
              className="w-full py-[13px] text-[13.5px] rounded-[4px] bg-transparent text-faintest border border-[rgba(28,27,25,.14)] cursor-not-allowed"
            >
              Continue with your university SSO (coming soon)
            </button>
          </>
        )}
        <button
          onClick={() => router.push("/")}
          className="w-full mt-4 bg-transparent border-0 p-0 text-[12.5px] text-muted cursor-pointer hover:text-ink"
        >
          Keep checking without an account
        </button>
      </div>
    </div>
  );
}
