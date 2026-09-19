import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "@dndimension/ui/styles.css";
import { App } from "./app/App";

const root = document.getElementById("root");

if (root === null) {
  throw new Error("App root #root is missing.");
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
