import { create } from "zustand";
import { STORAGE_KEYS, readJSON, writeJSON } from "@pokemon-mf/shared";

export type ThemeMode = "light" | "dark";

type ThemeState = {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
};

const initialMode = readJSON<ThemeMode>(STORAGE_KEYS.theme, "dark");

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: initialMode,
  toggle: () => {
    const next: ThemeMode = get().mode === "dark" ? "light" : "dark";
    writeJSON(STORAGE_KEYS.theme, next);
    set({ mode: next });
  },
  setMode: (mode) => {
    writeJSON(STORAGE_KEYS.theme, mode);
    set({ mode });
  },
}));
