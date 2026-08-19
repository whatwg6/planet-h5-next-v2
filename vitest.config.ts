import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import svgr from "vite-plugin-svgr";
import { svgrOptions } from "./svgr.config";

export default defineConfig({
  plugins: [react(), svgr(svgrOptions)],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  test: {
    environment: "jsdom",
    exclude: ["e2e/**", "node_modules/**"],
    globals: true,
    setupFiles: ["./src/testing/setupTests.ts"],
    restoreMocks: true,
    coverage: { provider: "v8", reporter: ["text", "html"] },
  },
});
