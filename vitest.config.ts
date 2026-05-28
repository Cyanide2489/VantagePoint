import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**"],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
      "@": path.resolve(__dirname, "./app"),
    },
  },
});
