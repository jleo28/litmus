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

interface AppState {
  flow: FlowState;
  currentResult: CurrentResult | null;
  setCurrentResult: (result: CurrentResult) => void;
  clearCurrentResult: () => void;

  setRaw: (raw: string) => void;
  setDocType: (docType: DocType) => void;
  setLevel: (level: StandingLevel) => void;
  setYear: (year: string) => void;
  setFinalSemester: (value: FinalSemester) => void;
  setFields: (fields: Fields, missing: MissingMap) => void;
  setField: (key: FieldKey, value: string) => void;
  setLastSig: (sig: string) => void;
  resetFlow: () => void;
  loadFlowFromSaved: (saved: SavedCheck) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      flow: emptyFlow,
      currentResult: null,
      setCurrentResult: (currentResult) => set({ currentResult }),
      clearCurrentResult: () => set({ currentResult: null }),

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
      loadFlowFromSaved: (saved) =>
        set({
          flow: {
            raw: "",
            docType: saved.docType,
            standing: saved.standing,
            fields: saved.fields,
            missing: {},
            lastSig: "",
          },
        }),
    }),
    {
      name: "litmus-store",
      partialize: (s) => ({
        currentResult: s.currentResult,
      }),
    },
  ),
);
