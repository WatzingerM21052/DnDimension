import { vi } from "vitest";

export const installMatchMedia = ({ reducedMotion }: { reducedMotion: boolean }) => {
  const original = window.matchMedia;
  window.matchMedia = vi.fn((query: string) => ({
    matches:
      (query === "(prefers-reduced-motion: reduce)" || query === "(prefers-reduced-motion)") &&
      reducedMotion,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
  }));

  return () => {
    window.matchMedia = original;
  };
};
