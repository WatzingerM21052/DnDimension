// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ActionButton } from "../index";

describe("ActionButton", () => {
  it("activates by keyboard and exposes its visible name", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();

    render(<ActionButton onPress={onPress}>Wegmarke anlegen</ActionButton>);

    await user.tab();
    expect(screen.getByRole("button", { name: "Wegmarke anlegen" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onPress).toHaveBeenCalledOnce();
  });

  it("preserves React Aria disabled semantics", () => {
    render(<ActionButton isDisabled>Gesperrt</ActionButton>);

    expect(screen.getByRole("button", { name: "Gesperrt" })).toBeDisabled();
  });

  it("merges a functional React Aria class name", () => {
    render(<ActionButton className={() => "caller-action"}>Klassenvertrag</ActionButton>);

    expect(screen.getByRole("button", { name: "Klassenvertrag" })).toHaveClass("caller-action");
  });
});
