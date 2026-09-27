import { registerSW } from "virtual:pwa-register";
import { UpdatePrompt } from "./UpdatePrompt";
import { unsavedWork } from "./unsaved-work";
import { createUpdateController } from "./update-controller";

/** Production-only entry: registers the service worker once and shows its update prompt. */
const controller = createUpdateController({ register: registerSW, unsavedWork });

export const PwaUpdates = () => <UpdatePrompt controller={controller} />;
