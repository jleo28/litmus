import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CurrentResult,
  DocType,
  EMPTY_FIELDS,
  EMPTY_STANDING,
  Fields,
  FieldKey,
  FinalSemester,
  MissingMap,
  SavedCheck,
  Standing,
  StandingLevel,
  TrackerBoard,
} from "@/lib/types";

interface FlowState {
  raw: string;
  docType: DocType;
  standing: Standing;
  fields: Fields;
  missing: MissingMap;
  lastSig: string;
}

const emptyFlow: FlowState = {
  raw: "",
  docType: "",
  standing: EMPTY_STANDING,
  fields: EMPTY_FIELDS,
  missing: {},
  lastSig: "",
};

interface AuthState {
  signedIn: boolean;
  email: string;
}

interface AppState {
  flow: FlowState;
  auth: AuthState;
  savedChecks: SavedCheck[];
  currentResult: CurrentResult | null;
  setCurrentResult: (result: CurrentResult) => void;

  setRaw: (raw: string) => void;
  setDocType: (docType: DocType) => void;
  setLevel: (level: StandingLevel) => void;
  setYear: (year: string) => void;
  setFinalSemester: (value: FinalSemester) => void;
  setFields: (fields: Fields, missing: MissingMap) => void;
  setField: (key: FieldKey, value: string) => void;
  setLastSig: (sig: string) => void;
  resetFlow: () => void;

  signIn: (email: string) => void;
  signOut: () => void;

  saveCheck: (check: Omit<SavedCheck, "id" | "checkedAt">) => string;
  reopenCheck: (id: string) => SavedCheck | undefined;
  boardChecks: (board: TrackerBoard) => SavedCheck[];
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      flow: emptyFlow,
      auth: { signedIn: false, email: "" },
      savedChecks: [],
      currentResult: null,
      setCurrentResult: (currentResult) => set({ currentResult }),

      setRaw: (raw) =>
        set((s) => ({ flow: { ...s.flow, raw, docType: "" } })),
      setDocType: (docType) => set((s) => ({ flow: { ...s.flow, docType } })),
      setLevel: (level) =>
        set((s) => ({
          flow: {
            ...s.flow,
            standing: { level, year: "", finalSemester: "" },
          },
        })),
      setYear: (year) =>
        set((s) => ({
          flow: {
            ...s.flow,
            standing: { ...s.flow.standing, year, finalSemester: "" },
          },
        })),
      setFinalSemester: (finalSemester) =>
        set((s) => ({
          flow: { ...s.flow, standing: { ...s.flow.standing, finalSemester } },
        })),
      setFields: (fields, missing) =>
        set((s) => ({ flow: { ...s.flow, fields, missing } })),
      setField: (key, value) =>
        set((s) => ({
          flow: { ...s.flow, fields: { ...s.flow.fields, [key]: value } },
        })),
      setLastSig: (lastSig) => set((s) => ({ flow: { ...s.flow, lastSig } })),
      resetFlow: () => set({ flow: emptyFlow }),

      signIn: (email) => set({ auth: { signedIn: true, email } }),
      signOut: () => set({ auth: { signedIn: false, email: "" } }),

      saveCheck: (check) => {
        const id =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : String(Date.now());
        const saved: SavedCheck = {
          ...check,
          id,
          checkedAt: new Date().toISOString(),
        };
        set((s) => ({ savedChecks: [saved, ...s.savedChecks] }));
        return id;
      },
      reopenCheck: (id) => get().savedChecks.find((c) => c.id === id),
      boardChecks: (board) =>
        get().savedChecks.filter((c) => c.board === board),
    }),
    {
      name: "litmus-store",
      partialize: (s) => ({
        auth: s.auth,
        savedChecks: s.savedChecks,
      }),
    },
  ),
);
