import type { DefaultTheme } from "styled-components";

export const fallbackDarkTheme: DefaultTheme = {
  bg: "#0B1220",
  text: "#E7ECF5",
  card: "rgba(255,255,255,0.05)",
  card2: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.10)",
  muted: "rgba(231,236,245,0.78)",
  focus: "rgba(128, 170, 255, 0.65)",
  shadow: "0 12px 28px rgba(0,0,0,0.38)",
};

export const fallbackLightTheme: DefaultTheme = {
  bg: "#F6F7FB",
  text: "#101828",
  card: "#FFFFFF",
  card2: "#F2F4F7",
  border: "rgba(16,24,40,0.12)",
  muted: "rgba(16,24,40,0.68)",
  focus: "rgba(53, 109, 255, 0.55)",
  shadow: "0 12px 28px rgba(16,24,40,0.12)",
};
