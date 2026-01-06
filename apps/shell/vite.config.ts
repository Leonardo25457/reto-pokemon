import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "shell",
      remotes: {
        pokemonDetail: {
          type: "module",
          name: "pokemonDetail",
          entry: "http://localhost:3001/remoteEntry.js",
        },
        historyApp: {
          type: "module",
          name: "historyApp",
          entry: "http://localhost:3002/remoteEntry.js",
        },
      },
      shared: ["react", "react-dom", "react-router-dom", "styled-components", "@tanstack/react-query", "zustand"],
    }),
  ],
  server: {
    port: 3000,
    strictPort: true,
    origin: "http://localhost:3000",
  },
  build: {
    target: "esnext",
  },
});
