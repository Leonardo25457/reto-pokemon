import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "pokemonDetail",
      filename: "remoteEntry.js",
      exposes: {
        "./PokemonDetailPage": "./src/PokemonDetailPage.tsx",
      },
      shared: ["react", "react-dom", "react-router-dom", "styled-components", "@tanstack/react-query", "zustand"],
    }),
  ],
  server: {
    port: 3001,
    strictPort: true,
    cors: true,
    origin: "http://localhost:3001",
  },

  build: {
    target: "esnext",
  },
});
