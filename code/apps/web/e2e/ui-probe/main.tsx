import { applyTheme } from "@dndimension/ui";
import "@dndimension/ui/styles.css";
import { createRoot } from "react-dom/client";
import { UiLab } from "../../src/dev/ui-lab/UiLab";

// Renders the development UI lab outside the production app for real-browser checks.
applyTheme(document.documentElement, new URLSearchParams(location.search).get("theme"));
createRoot(document.getElementById("root")!).render(<UiLab />);
