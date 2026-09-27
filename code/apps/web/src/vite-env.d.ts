/// <reference types="vite/client" />

/** Injected by build-identity.ts at build time; validated before use. */
declare const __DNDIMENSION_BUILD__: unknown;

// Declared locally instead of `vite-plugin-pwa/client` so app code does not type-check
// Workbox's service-worker typings against the DOM library.
declare module "virtual:pwa-register" {
  export const registerSW: import("./app/pwa/update-controller").RegisterServiceWorker;
}
