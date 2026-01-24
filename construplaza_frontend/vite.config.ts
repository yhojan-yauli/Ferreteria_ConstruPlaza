import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // Importa el plugin de React
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(), // Añade esta línea para que React funcione bien
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));