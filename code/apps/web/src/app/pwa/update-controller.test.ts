import { describe, expect, it, vi } from "vitest";
import { createUnsavedWorkRegistry } from "./unsaved-work";
import { createUpdateController, type RegisterServiceWorker } from "./update-controller";

const setup = ({ online = true } = {}) => {
  let callbacks: Parameters<RegisterServiceWorker>[0] = {};
  const updateServiceWorker = vi.fn<(reload?: boolean) => Promise<void>>(async () => {});
  const register: RegisterServiceWorker = (options) => {
    callbacks = options;
    return updateServiceWorker;
  };
  const timeouts: (() => void)[] = [];
  const intervals: (() => void)[] = [];
  const unsavedWork = createUnsavedWorkRegistry();
  const controller = createUpdateController({
    register,
    unsavedWork,
    setInterval: (callback) => intervals.push(callback),
    setTimeout: (callback) => timeouts.push(callback),
    isOnline: () => online,
  });
  return { controller, callbacks, updateServiceWorker, unsavedWork, timeouts, intervals };
};

describe("update controller", () => {
  it("offers a waiting version instead of activating it", () => {
    const { controller, callbacks, updateServiceWorker } = setup();
    callbacks.onNeedRefresh?.();
    expect(controller.getState()).toMatchObject({ updateAvailable: true, applying: false });
    expect(updateServiceWorker).not.toHaveBeenCalled();
  });

  it("activates and reloads only after an explicit request", async () => {
    const { controller, callbacks, updateServiceWorker } = setup();
    callbacks.onNeedRefresh?.();
    await expect(controller.applyUpdate()).resolves.toBe("applying");
    expect(updateServiceWorker).toHaveBeenCalledWith(true);
  });

  it("refuses to activate while unsaved work exists and unblocks after saving", async () => {
    const { controller, callbacks, updateServiceWorker, unsavedWork } = setup();
    const release = unsavedWork.hold();
    callbacks.onNeedRefresh?.();
    expect(controller.getState().blockedByUnsavedWork).toBe(true);
    await expect(controller.applyUpdate()).resolves.toBe("blocked");
    expect(updateServiceWorker).not.toHaveBeenCalled();

    release();
    expect(controller.getState().blockedByUnsavedWork).toBe(false);
    await expect(controller.applyUpdate()).resolves.toBe("applying");
  });

  it("does nothing when no update is waiting", async () => {
    const { controller, updateServiceWorker } = setup();
    await expect(controller.applyUpdate()).resolves.toBe("unavailable");
    expect(updateServiceWorker).not.toHaveBeenCalled();
  });

  it("keeps the old version usable when activation fails", async () => {
    const { controller, callbacks, updateServiceWorker } = setup();
    updateServiceWorker.mockRejectedValueOnce(new Error("sw gone"));
    callbacks.onNeedRefresh?.();
    await expect(controller.applyUpdate()).resolves.toBe("failed");
    expect(controller.getState()).toMatchObject({ applying: false, failed: true });
  });

  it("postpones the offer until the next waiting version", () => {
    const { controller, callbacks } = setup();
    callbacks.onNeedRefresh?.();
    controller.postpone();
    expect(controller.getState().postponed).toBe(true);
    callbacks.onNeedRefresh?.();
    expect(controller.getState().postponed).toBe(false);
  });

  it("reports offline readiness once", () => {
    const { controller, callbacks } = setup();
    callbacks.onOfflineReady?.();
    expect(controller.getState().offlineReady).toBe(true);
    controller.dismissOfflineReady();
    expect(controller.getState().offlineReady).toBe(false);
  });

  it("checks hourly for new versions only while online", async () => {
    const update = vi.fn(async () => {});
    const online = setup();
    online.callbacks.onRegisteredSW?.("/sw.js", { update } as unknown as ServiceWorkerRegistration);
    online.intervals[0]?.();
    expect(update).toHaveBeenCalledOnce();

    const offline = setup({ online: false });
    offline.callbacks.onRegisteredSW?.("/sw.js", {
      update,
    } as unknown as ServiceWorkerRegistration);
    offline.intervals[0]?.();
    expect(update).toHaveBeenCalledOnce();
  });

  describe("newer-schema recovery", () => {
    it("fetches and activates the newer version even with unsaved work", async () => {
      const { controller, callbacks, updateServiceWorker, unsavedWork } = setup();
      unsavedWork.hold();
      const update = vi.fn(async () => callbacks.onNeedRefresh?.());
      callbacks.onRegisteredSW?.("/sw.js", { update } as unknown as ServiceWorkerRegistration);
      await expect(controller.recoverFromNewerSchema()).resolves.toBe("applying");
      expect(update).toHaveBeenCalledOnce();
      expect(updateServiceWorker).toHaveBeenCalledWith(true);
    });

    it("reports when no newer version can be reached", async () => {
      const { controller, callbacks, updateServiceWorker, timeouts } = setup();
      callbacks.onRegisteredSW?.("/sw.js", {
        update: async () => {},
      } as unknown as ServiceWorkerRegistration);
      const result = controller.recoverFromNewerSchema();
      await Promise.resolve();
      await Promise.resolve();
      timeouts.forEach((fire) => fire());
      await expect(result).resolves.toBe("no-update");
      expect(updateServiceWorker).not.toHaveBeenCalled();
    });
  });
});
