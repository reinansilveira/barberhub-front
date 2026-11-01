import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const srcRoot = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": srcRoot,
    },
  },
  test: {
    environment: "jsdom",
    env: { TZ: "America/Sao_Paulo" },
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["src/test/**"],
    },
  },
});
