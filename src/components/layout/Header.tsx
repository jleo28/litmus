"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthUser } from "@/lib/supabase/useAuthUser";
import LitmusWordmark from "@/components/brand/LitmusWordmark";

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuthUser();
  const signedIn = !!user;

  return (
    <header
      data-noprint="1"
      className="border-b border-[rgba(28,27,25,.09)] bg-surface-raised"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14 h-[62px] flex items-center gap-4 sm:gap-7">
        <Link
          href="/"
          title="Back to home"
          aria-label="Litmus"
          className="!border-0 transition-opacity duration-[180ms] ease hover:opacity-[.62]"
        >
          <LitmusWordmark
            fontSize={23}
            flaskSize={4}
            flaskStrokeWidth={3.4}
            flaskBottom={19}
            flaskClassName="logo-flip"
          />
        </Link>
        <nav className="ml-auto flex items-center gap-3 sm:gap-[22px]">
          {pathname !== "/tracker" && pathname !== "/" && (
            <Link
              href="/tracker"
              className="!border-0 text-[12px] whitespace-nowrap transition-colors duration-[180ms] ease text-faintest hover:text-ink"
            >
              My Tracker
            </Link>
          )}
          <Link
            href={signedIn ? "/account" : "/signin"}
            className={`!border-0 text-[12px] whitespace-nowrap transition-colors duration-[180ms] ease hover:text-ink ${
              pathname === "/account" ? "text-ink" : "text-faintest"
            }`}
          >
            {signedIn ? "My Account" : "Sign In"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
