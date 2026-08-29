// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { installMatchMedia } from "../test/install-match-media";

const ledgerNodes = [
  { id: "unmapped", label: "Unkartiert" },
  { id: "drafted", label: "Entwurf" },
];

let restoreMatchMedia: (() => void) | undefined;

afterEach(() => {
  cleanup();
  restoreMatchMedia?.();
  restoreMatchMedia = undefined;
});

describe("ConstellationLedger", () => {
  it("uses an immediate marker when reduced motion is requested", async () => {
    restoreMatchMedia = installMatchMedia({ reducedMotion: true });
    vi.resetModules();
    const { ConstellationLedger } = await import("../index");

    render(
      <ConstellationLedger
        label="Wegmarkenstatus"
        nodes={ledgerNodes}
        activeId="unmapped"
        onActiveChange={() => undefined}
      />,
    );

    expect(document.querySelector('[data-motion="reduced"]')).not.toBeNull();
    expect(screen.getByRole("button", { name: "Unkartiert" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("moves the selected state through named buttons", async () => {
    const user = userEvent.setup();
    const onActiveChange = vi.fn();
    restoreMatchMedia = installMatchMedia({ reducedMotion: false });
    vi.resetModules();
    const { ConstellationLedger } = await import("../index");

    render(
      <ConstellationLedger
        label="Wegmarkenstatus"
        nodes={ledgerNodes}
        activeId="unmapped"
        onActiveChange={onActiveChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Entwurf" }));

    expect(onActiveChange).toHaveBeenCalledWith("drafted");
  });
});
