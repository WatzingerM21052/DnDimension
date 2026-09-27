import type { UnsavedWorkRegistry } from "./unsaved-work";

/** Structural subset of `registerSW` from `virtual:pwa-register`. */
export type RegisterServiceWorker = (options: {
  onNeedRefresh?: () => void;
  onOfflineReady?: () => void;
  onRegisterError?: (error: unknown) => void;
  onRegisteredSW?: (url: string, registration: ServiceWorkerRegistration | undefined) => void;
}) => (reloadPage?: boolean) => Promise<void>;

export type UpdateState = Readonly<{
  offlineReady: boolean;
  updateAvailable: boolean;
  postponed: boolean;
  blockedByUnsavedWork: boolean;
  applying: boolean;
  failed: boolean;
}>;

export type ApplyResult = "applying" | "blocked" | "unavailable" | "failed";

export interface UpdateController {
  getState(): UpdateState;
  subscribe(listener: () => void): () => void;
  /** Activates the waiting version and reloads, unless unsaved work would be lost. */
  applyUpdate(): Promise<ApplyResult>;
  postpone(): void;
  dismissOfflineReady(): void;
  /**
   * The running code cannot open data written by a newer version. Looks for that version and
   * activates it; the in-memory state is unusable anyway, and stored data is never deleted.
   */
  recoverFromNewerSchema(): Promise<"applying" | "no-update">;
}

const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000;
const RECOVERY_WAIT_MS = 15_000;

export const createUpdateController = ({
  register,
  unsavedWork,
  setInterval: schedule = globalThis.setInterval,
  setTimeout: wait = globalThis.setTimeout,
  isOnline = () => globalThis.navigator?.onLine ?? true,
}: {
  register: RegisterServiceWorker;
  unsavedWork: UnsavedWorkRegistry;
  setInterval?: (callback: () => void, ms: number) => unknown;
  setTimeout?: (callback: () => void, ms: number) => unknown;
  isOnline?: () => boolean;
}): UpdateController => {
  let state: UpdateState = {
    offlineReady: false,
    updateAvailable: false,
    postponed: false,
    blockedByUnsavedWork: unsavedWork.hasUnsavedWork(),
    applying: false,
    failed: false,
  };
  let registration: ServiceWorkerRegistration | undefined;
  const listeners = new Set<() => void>();
  const set = (patch: Partial<UpdateState>) => {
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener());
  };
  unsavedWork.subscribe(() => set({ blockedByUnsavedWork: unsavedWork.hasUnsavedWork() }));

  const checkForUpdate = async () => {
    if (!registration || !isOnline()) return;
    try {
      await registration.update();
    } catch {
      // Offline or server hiccup: the next check tries again.
    }
  };

  const updateServiceWorker = register({
    onNeedRefresh: () => set({ updateAvailable: true, postponed: false }),
    onOfflineReady: () => set({ offlineReady: true }),
    onRegisterError: () => set({ failed: true }),
    onRegisteredSW: (_url, registered) => {
      registration = registered;
      if (registered) schedule(() => void checkForUpdate(), UPDATE_CHECK_INTERVAL_MS);
    },
  });

  /** Resolves once a waiting version is reported, or after the timeout. */
  const waitForUpdate = () =>
    new Promise<void>((resolve) => {
      if (state.updateAvailable) return resolve();
      const done = () => {
        listeners.delete(onChange);
        resolve();
      };
      const onChange = () => {
        if (state.updateAvailable) done();
      };
      listeners.add(onChange);
      wait(done, RECOVERY_WAIT_MS);
    });

  const activate = async (): Promise<"applying" | "failed"> => {
    set({ applying: true, failed: false });
    try {
      await updateServiceWorker(true);
      return "applying";
    } catch {
      set({ applying: false, failed: true });
      return "failed";
    }
  };

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    async applyUpdate() {
      if (!state.updateAvailable) return "unavailable";
      if (unsavedWork.hasUnsavedWork()) {
        set({ blockedByUnsavedWork: true, postponed: false });
        return "blocked";
      }
      return activate();
    },
    postpone: () => set({ postponed: true }),
    dismissOfflineReady: () => set({ offlineReady: false }),
    async recoverFromNewerSchema() {
      if (!state.updateAvailable) {
        await checkForUpdate();
        await waitForUpdate();
      }
      if (!state.updateAvailable) return "no-update";
      return (await activate()) === "applying" ? "applying" : "no-update";
    },
  };
};
