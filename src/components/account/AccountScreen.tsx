"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/lib/supabase/useAuthUser";
import { createClient } from "@/lib/supabase/client";
import DeleteAccountModal from "@/components/account/DeleteAccountModal";

type EditingRow = "" | "email" | "username" | "password";

const inputClass =
  "min-w-0 flex-1 px-[13px] py-2 text-[13.5px] text-ink bg-surface-input border border-[rgba(28,27,25,.16)] rounded-[4px] outline-none focus:border-[oklch(0.48_0.075_250_/_0.55)] focus:shadow-[0_0_0_3px_oklch(0.48_0.075_250_/_0.09)]";

export default function AccountScreen() {
  const router = useRouter();
  const { user, loading } = useAuthUser();

  const [editing, setEditing] = useState<EditingRow>("");
  const [editVal, setEditVal] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/signin");
  }, [loading, user, router]);

  useEffect(() => {
    if (!savedNote) return;
    const t = setTimeout(() => setSavedNote(""), 2600);
    return () => clearTimeout(t);
  }, [savedNote]);

  if (!user) return null;

  const email = user.email ?? "";
  const username = (user.user_metadata?.username as string | undefined) ?? "";

  function startEdit(row: EditingRow, initial: string) {
    setEditing(row);
    setEditVal(initial);
    setPwNew("");
    setPwConfirm("");
    setError("");
  }

  function cancelEdit() {
    setEditing("");
    setEditVal("");
    setPwNew("");
    setPwConfirm("");
    setError("");
  }

  async function saveEmail() {
    const value = editVal.trim();
    if (!value) return;
    setSaving(true);
    setError("");
    const { error } = await createClient().auth.updateUser({ email: value });
    setSaving(false);
    if (error) return setError(error.message);
    setEditing("");
    setSavedNote("Email saved");
  }

  async function saveUsername() {
    setSaving(true);
    setError("");
    const { error } = await createClient().auth.updateUser({ data: { username: editVal.trim() } });
    setSaving(false);
    if (error) return setError(error.message);
    setEditing("");
    setSavedNote("Username saved");
  }

  async function savePassword() {
    if (!pwNew || pwNew !== pwConfirm) return;
    setSaving(true);
    setError("");
    const { error } = await createClient().auth.updateUser({ password: pwNew });
    setSaving(false);
    if (error) return setError(error.message);
    setEditing("");
    setPwNew("");
    setPwConfirm("");
    setSavedNote("Password changed");
  }

  async function handleSignOut() {
    await createClient().auth.signOut();
    router.push("/");
  }

  async function handleDeleteConfirm() {
    const res = await fetch("/api/account/delete", { method: "POST" });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || "Couldn't delete the account.");
    await createClient().auth.signOut();
    router.push("/");
  }

  return (
    <div className="pt-11 pb-16 max-w-[600px] animate-lit-in">
      <div className="font-sans font-semibold text-[10px] tracking-[.09em] uppercase text-faint mb-3">
        Account
      </div>
      <h1 className="font-serif text-[34px] leading-[1.15] font-normal tracking-[-0.02em] mb-3">
        Your details
      </h1>
      <p className="text-[14px] leading-[1.55] text-body-muted max-w-[52ch] mb-7 text-pretty">
        Your school email sets which rules Litmus checks against. Changing it changes the ruleset.
      </p>

      <div className="bg-surface-raised border border-[rgba(28,27,25,.1)] rounded-[6px] overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-[104px_minmax(0,1fr)] gap-1.5 sm:gap-[18px] px-4 sm:px-5 py-4 border-b border-[rgba(28,27,25,.08)]">
          <div className="font-sans font-semibold text-[10px] tracking-[.06em] uppercase text-faint pt-1.5">
            Email
          </div>
          {editing === "email" ? (
            <div className="flex items-center gap-2.5 flex-wrap">
              <input autoFocus value={editVal} onChange={(e) => setEditVal(e.target.value)} className={inputClass} />
              <button
                onClick={saveEmail}
                disabled={saving || !editVal.trim()}
                className="flex-none px-3.5 py-2 text-[12.5px] font-medium rounded-[4px] cursor-pointer bg-ink text-[#fbfaf8] border border-ink hover:bg-[#332f2a] disabled:opacity-40"
              >
                Save
              </button>
              <button onClick={cancelEdit} className="flex-none bg-transparent border-0 p-0 text-[12.5px] text-muted cursor-pointer hover:text-ink">
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-[13.5px] text-ink-2">{email}</span>
              <button
                onClick={() => startEdit("email", email)}
                className="ml-auto flex-none px-2.5 py-1.5 text-[12px] rounded-[4px] cursor-pointer bg-transparent border border-[rgba(28,27,25,.18)] text-body hover:border-[rgba(28,27,25,.36)]"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[104px_minmax(0,1fr)] gap-1.5 sm:gap-[18px] px-4 sm:px-5 py-4 border-b border-[rgba(28,27,25,.08)]">
          <div className="font-sans font-semibold text-[10px] tracking-[.06em] uppercase text-faint pt-1.5">
            Username
          </div>
          {editing === "username" ? (
            <div className="flex items-center gap-2.5 flex-wrap">
              <input autoFocus value={editVal} onChange={(e) => setEditVal(e.target.value)} className={inputClass} />
              <button
                onClick={saveUsername}
                disabled={saving}
                className="flex-none px-3.5 py-2 text-[12.5px] font-medium rounded-[4px] cursor-pointer bg-ink text-[#fbfaf8] border border-ink hover:bg-[#332f2a] disabled:opacity-40"
              >
                Save
              </button>
              <button onClick={cancelEdit} className="flex-none bg-transparent border-0 p-0 text-[12.5px] text-muted cursor-pointer hover:text-ink">
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className={`text-[13.5px] ${username ? "text-ink-2" : "text-faintest"}`}>{username || "Not set"}</span>
              <button
                onClick={() => startEdit("username", username)}
                className="ml-auto flex-none px-2.5 py-1.5 text-[12px] rounded-[4px] cursor-pointer bg-transparent border border-[rgba(28,27,25,.18)] text-body hover:border-[rgba(28,27,25,.36)]"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[104px_minmax(0,1fr)] gap-1.5 sm:gap-[18px] px-4 sm:px-5 py-4">
          <div className="font-sans font-semibold text-[10px] tracking-[.06em] uppercase text-faint pt-1.5">
            Password
          </div>
          {editing === "password" ? (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <input
                  autoFocus
                  type="password"
                  value={pwNew}
                  onChange={(e) => setPwNew(e.target.value)}
                  placeholder="New password"
                  className={inputClass}
                />
                <input
                  type="password"
                  value={pwConfirm}
                  onChange={(e) => setPwConfirm(e.target.value)}
                  placeholder="Repeat it"
                  className={inputClass}
                />
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={savePassword}
                  disabled={saving || !pwNew || pwNew !== pwConfirm}
                  className="flex-none px-3.5 py-2 text-[12.5px] font-medium rounded-[4px] cursor-pointer bg-ink text-[#fbfaf8] border border-ink hover:bg-[#332f2a] disabled:opacity-40"
                >
                  Save
                </button>
                <button onClick={cancelEdit} className="flex-none bg-transparent border-0 p-0 text-[12.5px] text-muted cursor-pointer hover:text-ink">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-[13.5px] text-ink-2 tracking-[.1em]">••••••••••</span>
              <button
                onClick={() => startEdit("password", "")}
                className="ml-auto flex-none bg-transparent border-0 p-0 text-[12.5px] text-accent cursor-pointer hover:text-accent-hover"
              >
                Change password
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="text-[12.5px] mt-3" style={{ color: "oklch(0.48 0.14 25)" }}>
          {error}
        </div>
      )}
      {savedNote && (
        <div className="text-[12.5px] mt-3" style={{ color: "oklch(0.5 0.09 155)" }}>
          {savedNote}
        </div>
      )}

      <div className="mt-[34px] pt-[34px] border-t border-[rgba(28,27,25,.09)]">
        <button
          onClick={handleSignOut}
          className="px-5 py-3 text-[13.5px] rounded-[4px] cursor-pointer bg-transparent border border-[rgba(28,27,25,.2)] text-body hover:border-[rgba(28,27,25,.4)]"
        >
          Sign out
        </button>
        <p className="text-[12.5px] leading-[1.5] text-faint mt-2.5 max-w-[52ch] text-pretty">
          You stay signed out until you sign in again. Your tracker records stay.
        </p>
      </div>

      <div className="mt-11 pt-11 border-t border-[rgba(28,27,25,.09)]">
        <button
          onClick={() => setDeleteOpen(true)}
          className="px-5 py-3 text-[13.5px] rounded-[4px] cursor-pointer bg-transparent border hover:opacity-80"
          style={{ borderColor: "oklch(0.88 0.06 25)", color: "oklch(0.48 0.14 25)" }}
        >
          Delete account
        </button>
        <p className="text-[12.5px] leading-[1.5] text-faint mt-2.5 max-w-[52ch] text-pretty">
          Deleting the account removes every offer record in your tracker.
        </p>
      </div>

      {deleteOpen && (
        <DeleteAccountModal email={email} onClose={() => setDeleteOpen(false)} onConfirm={handleDeleteConfirm} />
      )}
    </div>
  );
}
