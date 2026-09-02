"use client";

import { useEffect, useRef, useState } from "react";
import LitmusWordmark from "@/components/brand/LitmusWordmark";

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Starts the one-time splash sequence on mount; not derived from props/state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
    fadeTimer.current = setTimeout(() => setFading(true), 2050);
    hideTimer.current = setTimeout(() => setVisible(false), 2420);
    return () => {
      clearTimeout(fadeTimer.current);
      clearTimeout(hideTimer.current);
    };
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
        flaskBottom={86}
        style={{ animation: "lit-in 620ms ease both" }}
        flaskStyle={{ animation: "lit-flip 1150ms cubic-bezier(.4,.02,.5,.98) 620ms both" }}
      />
    </div>
  );
}
