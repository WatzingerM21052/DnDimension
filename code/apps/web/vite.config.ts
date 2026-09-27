import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { buildIdentityDefine } from "./build-identity";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // The app decides when a waiting worker may take over (see app/pwa/update-controller.ts).
      registerType: "prompt",
      injectRegister: false,
      includeAssets: ["icons/app-icon.svg", "icons/app-icon-180.png"],
      manifest: {
        id: "/",
        name: "DnDimension",
        short_name: "DnDimension",
        description: "Lokale D&D-5e-Begleitung für Spieler und Dungeon Master.",
        lang: "de",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#0b1620",
        theme_color: "#0b1620",
        icons: [
          { src: "icons/app-icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/app-icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icons/app-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Only the static build is precached; user data stays in IndexedDB.
        globPatterns: ["**/*.{html,js,css,woff2}"],
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/dev\//],
        runtimeCaching: [],
        cleanupOutdatedCaches: true,
        clientsClaim: false,
        skipWaiting: false,
        sourcemap: false,
      },
      devOptions: { enabled: false },
    }),
  ],
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
