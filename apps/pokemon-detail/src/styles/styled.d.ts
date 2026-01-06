import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    bg: string;
    text: string;

    card: string;
    card2: string;
    border: string;

    muted: string;
    focus: string;
    shadow: string;
  }
}
