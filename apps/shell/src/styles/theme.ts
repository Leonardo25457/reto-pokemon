import type { DefaultTheme } from "styled-components";

export const darkTheme: DefaultTheme = {
  bg: "#0B1220",
  text: "#E7ECF5",

  card: "#0F1A2B",
  card2: "#132238",

  border: "rgba(255,255,255,0.10)",

  muted: "rgba(231,236,245,0.78)",
  focus: "rgba(128, 170, 255, 0.70)",

  shadow: "0 12px 28px rgba(0,0,0,0.45)",
};

export const lightTheme: DefaultTheme = {
  bg: "#F6F7FB",
  text: "#101828",

  card: "#FFFFFF",
  card2: "#F1F5F9",

  border: "rgba(16,24,40,0.12)",

  muted: "rgba(16,24,40,0.68)",
  focus: "rgba(53, 109, 255, 0.55)",

  shadow: "0 12px 28px rgba(16,24,40,0.12)",
};
