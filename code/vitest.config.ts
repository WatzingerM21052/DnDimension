import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    clearMocks: true,
    environment: "node",
    include: ["packages/**/*.test.ts", "apps/**/*.test.ts", "apps/**/*.test.tsx"],
    restoreMocks: true,
    setupFiles: ["./apps/web/src/test/setup.ts"],
  },
});
