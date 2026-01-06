import { ThemeProvider } from "styled-components";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PokemonDetailPage from "./PokemonDetailPage";
import { fallbackDarkTheme } from "./styles/theme";
import type { DefaultTheme } from "styled-components";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        theme={(outer: unknown) => {
          const t = outer as Partial<DefaultTheme> | undefined;
          if (t && typeof t.bg === "string" && typeof t.text === "string") {
            return t as DefaultTheme;
          }
          return fallbackDarkTheme;
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/pokemon/:name" element={<PokemonDetailPage />} />
            <Route
              path="/"
              element={<Navigate to="/pokemon/pikachu" replace />}
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
