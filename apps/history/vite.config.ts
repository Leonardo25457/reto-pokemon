import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "historyApp",
      filename: "remoteEntry.js",
      exposes: {
        "./HistoryPage": "./src/HistoryPage.tsx",
      },
      shared: ["react", "react-dom", "react-router-dom", "styled-components", "@tanstack/react-query", "zustand"],
    }),
  ],
  server: {
    port: 3002,
    strictPort: true,
    cors: true,
    origin: "http://localhost:3002",
  },

  build: {
    target: "esnext",
  },
});
