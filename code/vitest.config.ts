import { defineConfig } from "vitest/config";
import { buildIdentityDefine } from "./apps/web/build-identity";

export default defineConfig({
  define: buildIdentityDefine(),
  test: {
    clearMocks: true,
    environment: "node",
    include: [
      "packages/**/*.test.ts",
      "packages/**/*.test.tsx",
      "apps/**/*.test.ts",
      "apps/**/*.test.tsx",
    ],
    restoreMocks: true,
    setupFiles: ["./apps/web/src/test/setup.ts"],
  },
});
