import { ThemeProvider } from "styled-components";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HistoryPage from "./HistoryPage";

const queryClient = new QueryClient();

const darkTheme = {
  bg: "#0b1220",
  text: "#e6eaf2",
  card: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.10)",
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme as any}>
        <BrowserRouter>
          <Routes>
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/" element={<Navigate to="/history" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
