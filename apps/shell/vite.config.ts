import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

const remotePokemonDetail =
  process.env.VITE_REMOTE_POKEMON_DETAIL ?? "http://localhost:3001/remoteEntry.js";

const remoteHistory =
  process.env.VITE_REMOTE_HISTORY ?? "http://localhost:3002/remoteEntry.js";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "shell",
      remotes: {
        pokemonDetail: {
          type: "module",
          name: "pokemonDetail",
          entry: remotePokemonDetail,
        },
        historyApp: {
          type: "module",
          name: "historyApp",
          entry: remoteHistory,
        },
      },
      shared: ["react", "react-dom", "react-router-dom"],
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
