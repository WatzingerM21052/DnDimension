import { useEffect } from "react";

/** Tracks editors with unsaved changes so updates and reloads never discard them. */
export interface UnsavedWorkRegistry {
  hold(): () => void;
  hasUnsavedWork(): boolean;
  subscribe(listener: () => void): () => void;
}

export const createUnsavedWorkRegistry = (): UnsavedWorkRegistry => {
  const holds = new Set<symbol>();
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((listener) => listener());
  return {
    hold() {
      const token = Symbol("unsaved-work");
      holds.add(token);
      notify();
      return () => {
        if (holds.delete(token)) notify();
      };
    },
    hasUnsavedWork: () => holds.size > 0,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};

export const unsavedWork = createUnsavedWorkRegistry();

/** Declare unsaved changes while `active` is true; also warns before closing the tab. */
export const useUnsavedWork = (active: boolean, registry: UnsavedWorkRegistry = unsavedWork) => {
  useEffect(() => {
    if (!active) return;
    const release = registry.hold();
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => {
      window.removeEventListener("beforeunload", warn);
      release();
    };
  }, [active, registry]);
};
