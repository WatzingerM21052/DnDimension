import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { buildIdentityDefine } from "./build-identity";

export default defineConfig({
  plugins: [react()],
  define: buildIdentityDefine(),
  build: {
    sourcemap: true,
    rolldownOptions: {
      output: {
        sourcemapExcludeSources: true,
      },
    },
  },
});
