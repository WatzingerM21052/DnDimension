import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "@dndimension/ui/styles.css";
import { App } from "./app/App";

// The service worker exists only in production builds; development stays uncached.
const PwaUpdates =
  import.meta.env.PROD && "serviceWorker" in navigator
    ? lazy(() => import("./app/pwa/PwaUpdates").then(({ PwaUpdates }) => ({ default: PwaUpdates })))
    : null;

const root = document.getElementById("root");

if (root === null) {
  throw new Error("App root #root is missing.");
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {PwaUpdates === null ? null : (
      <Suspense fallback={null}>
        <PwaUpdates />
      </Suspense>
    )}
  </StrictMode>,
);
