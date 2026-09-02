"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import LitmusWordmark from "@/components/brand/LitmusWordmark";

// Once per browser session, and only when the app is entered via Home.
// See docs/design/LOGO.md, "Timing and behavior".
const SPLASH_SESSION_KEY = "litmus-splash-shown";

export default function SplashScreen() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (pathname !== "/") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem(SPLASH_SESSION_KEY)) return;
    sessionStorage.setItem(SPLASH_SESSION_KEY, "1");

    // Starts the one-time splash sequence on mount; not derived from props/state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
    fadeTimer.current = setTimeout(() => setFading(true), 2050);
    hideTimer.current = setTimeout(() => setVisible(false), 2420);
    return () => {
      clearTimeout(fadeTimer.current);
      clearTimeout(hideTimer.current);
    };
    // Entry route is captured once, at mount — deliberately not re-run on nav.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function skip() {
    clearTimeout(fadeTimer.current);
    clearTimeout(hideTimer.current);
    setFading(true);
    hideTimer.current = setTimeout(() => setVisible(false), 340);
  }

  if (!visible) return null;

  return (
    <div
      data-noprint="1"
      onClick={skip}
      className="fixed inset-0 z-[200] bg-page flex items-center justify-center cursor-pointer transition-opacity ease"
      style={{ opacity: fading ? 0 : 1, transitionDuration: "340ms" }}
    >
      <LitmusWordmark
        fontSize={92}
        flaskSize={16}
        flaskStrokeWidth={1.8}
        flaskBottom={94}
        flaskTranslateX="-50%"
        style={{ animation: "lit-in 620ms ease both" }}
        flaskStyle={{
          zIndex: 2,
          animation: "lit-flip 1150ms cubic-bezier(.4,.02,.5,.98) 620ms both",
        }}
      />
    </div>
  );
}
