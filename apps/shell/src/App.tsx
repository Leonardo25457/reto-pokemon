import { lazy, Suspense, useMemo } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { GlobalStyle } from "./styles/GlobalStyle";
import { darkTheme, lightTheme } from "./styles/theme";
import { useThemeStore } from "./state/themeStore";

import { ProtectedRoute } from "./routes/ProtectedRoute";
import { ShellLayout } from "./layout/ShellLayout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

const PokemonDetailPage = lazy(() => import("pokemonDetail/PokemonDetailPage"));
const HistoryPage = lazy(() => import("historyApp/HistoryPage"));

const queryClient = new QueryClient();

export default function App() {
  const mode = useThemeStore((s) => s.mode);
  const theme = useMemo(
    () => (mode === "dark" ? darkTheme : lightTheme),
    [mode]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />

        <BrowserRouter>
          <Suspense fallback={<div style={{ padding: 16 }}>Cargando...</div>}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<ShellLayout />}>
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/home" element={<HomePage />} />

                  {/* MF2 */}
                  <Route path="/history" element={<HistoryPage />} />

                  {/* MF1 */}
                  <Route
                    path="/pokemon/:name"
                    element={<PokemonDetailPage />}
                  />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
