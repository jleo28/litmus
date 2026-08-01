"use client";

import { ButtonHTMLAttributes } from "react";

interface OptionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean;
}

export default function OptionButton({ selected, className = "", ...props }: OptionButtonProps) {
  return (
    <button
      {...props}
      className={`rounded-[4px] cursor-pointer transition-colors ${
        selected
          ? "bg-ink text-[#fbfaf8] font-medium border border-ink"
          : "bg-surface-input text-label font-normal border border-[rgba(28,27,25,.16)]"
      } ${className}`}
    />
  );
}
