// @vitest-environment jsdom
import { act, cleanup, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import "../../test/setup";
import { UpdatePrompt } from "./UpdatePrompt";
import { createUnsavedWorkRegistry, useUnsavedWork } from "./unsaved-work";
import { createUpdateController, type RegisterServiceWorker } from "./update-controller";

afterEach(cleanup);

const setup = () => {
  let callbacks: Parameters<RegisterServiceWorker>[0] = {};
  const updateServiceWorker = vi.fn<(reload?: boolean) => Promise<void>>(async () => {});
  const unsavedWork = createUnsavedWorkRegistry();
  const controller = createUpdateController({
    register: (options) => {
      callbacks = options;
      return updateServiceWorker;
    },
    unsavedWork,
    setInterval: () => undefined,
    setTimeout: () => undefined,
  });
  render(<UpdatePrompt controller={controller} />);
  return { callbacks, updateServiceWorker, unsavedWork };
};

describe("UpdatePrompt", () => {
  it("stays empty until the service worker reports something", () => {
    setup();
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("offers the update and reloads on request", async () => {
    const { callbacks, updateServiceWorker } = setup();
    act(() => callbacks.onNeedRefresh?.());
    expect(screen.getByText("Neue Version verfügbar")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Jetzt aktualisieren" }));
    expect(updateServiceWorker).toHaveBeenCalledWith(true);
  });

  it("disables the update while an editor holds unsaved work", () => {
    const { callbacks, unsavedWork } = setup();
    let release = () => {};
    act(() => {
      release = unsavedWork.hold();
      callbacks.onNeedRefresh?.();
    });
    expect(screen.getByRole("button", { name: "Jetzt aktualisieren" })).toBeDisabled();
    expect(screen.getByText(/ungespeicherte Änderungen/)).toBeInTheDocument();
    act(() => release());
    expect(screen.getByRole("button", { name: "Jetzt aktualisieren" })).toBeEnabled();
  });

  it("can be postponed", async () => {
    const { callbacks } = setup();
    act(() => callbacks.onNeedRefresh?.());
    await userEvent.click(screen.getByRole("button", { name: "Später" }));
    expect(screen.queryByText("Neue Version verfügbar")).not.toBeInTheDocument();
  });

  it("announces offline readiness", async () => {
    const { callbacks } = setup();
    act(() => callbacks.onOfflineReady?.());
    expect(screen.getByText(/offline verfügbar/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Verstanden" }));
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });
});

describe("useUnsavedWork", () => {
  it("holds while active and warns before unload", () => {
    const registry = createUnsavedWorkRegistry();
    const { rerender, unmount } = renderHook(({ active }) => useUnsavedWork(active, registry), {
      initialProps: { active: true },
    });
    expect(registry.hasUnsavedWork()).toBe(true);
    const event = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);

    rerender({ active: false });
    expect(registry.hasUnsavedWork()).toBe(false);
    unmount();
  });
});
