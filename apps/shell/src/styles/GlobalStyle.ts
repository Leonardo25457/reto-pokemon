import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }

  html, body, #root {
    height: 100%;
    width: 100%;
    background: ${({ theme }) => theme.bg};
  }

  html { -webkit-text-size-adjust: 100%; }

  body {
    margin: 0;
    min-height: 100vh;
    overflow-x: hidden;
    display: block;

    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.bg};
  }

  #root {
    max-width: none;
    padding: 0;
    margin: 0;
    text-align: left;
    background: ${({ theme }) => theme.bg};
  }

  a { color: inherit; text-decoration: none; }
  a:hover { text-decoration: none; }

  button {
    font: inherit;
    cursor: pointer;
    color: inherit;
  }

  ::selection {
    background: color-mix(in srgb, ${({ theme }) => theme.text} 14%, transparent);
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.focus};
    outline-offset: 2px;
  }
`;
