"use client";

import { useState } from "react";

interface DeleteAccountModalProps {
  email: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteAccountModal({ email, onClose, onConfirm }: DeleteAccountModalProps) {
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const matches = text.trim().toLowerCase() === email.toLowerCase();

  async function handleConfirm() {
    if (!matches || deleting) return;
    setDeleting(true);
    setError("");
    try {
      await onConfirm();
    } catch {
      setError("Couldn't delete the account, try again.");
      setDeleting(false);
    }
  }

  return (
    <div
      data-noprint="1"
      className="fixed inset-0 z-40 bg-[rgba(28,27,25,.42)] flex items-center justify-center p-10"
    >
      <div onClick={deleting ? undefined : onClose} className="absolute inset-0" />
      <div className="relative w-full max-w-[480px] bg-surface-input border border-[rgba(28,27,25,.16)] rounded-[8px] shadow-[0_24px_60px_rgba(28,27,25,.28)] animate-lit-pop px-7 pt-6 pb-[26px]">
        <div className="font-serif text-[23px] font-medium tracking-[-0.015em] mb-3">
          Delete your account
        </div>
        <p className="text-[13.5px] leading-[1.55] text-body mb-4 text-pretty">
          This deletes your account and every offer record saved in your tracker. Nothing is kept and
          nothing can be restored.
        </p>
        <p className="text-[13px] leading-[1.5] text-body-muted mb-2.5">
          Type <span className="font-medium text-ink">{email}</span> to confirm.
        </p>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={email}
          disabled={deleting}
          className="w-full px-[13px] py-2.5 text-[13.5px] text-ink bg-surface-input border border-[rgba(28,27,25,.16)] rounded-[4px] outline-none mb-2 focus:border-[oklch(0.48_0.075_250_/_0.55)] focus:shadow-[0_0_0_3px_oklch(0.48_0.075_250_/_0.09)]"
        />
        {error && (
          <div className="text-[12px] mb-2" style={{ color: "oklch(0.48 0.14 25)" }}>
            {error}
          </div>
        )}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-none whitespace-nowrap px-[18px] py-[11px] text-[13.5px] rounded-[4px] cursor-pointer bg-transparent border border-[rgba(28,27,25,.2)] text-body hover:border-[rgba(28,27,25,.4)] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!matches || deleting}
            className="flex-none whitespace-nowrap ml-auto px-[18px] py-[11px] text-[13.5px] font-medium rounded-[4px] cursor-pointer text-[#fbfaf8] border-0 disabled:cursor-not-allowed"
            style={{
              background: matches ? "oklch(0.48 0.14 25)" : "oklch(0.48 0.14 25 / 0.35)",
            }}
          >
            {deleting ? "Deleting…" : "Delete account"}
          </button>
        </div>
      </div>
    </div>
  );
}
