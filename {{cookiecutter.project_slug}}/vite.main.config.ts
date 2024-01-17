import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  plugins: [react()],
  resolve: {
    browserField: false,
    mainFields: ["module", "jsnext:main", "jsnext"]
  }
});
