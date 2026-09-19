// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ModalDialog, TextField } from "../index";

describe("TextField", () => {
  it("associates its label, description and concrete validation error", () => {
    render(
      <TextField
        label="Name der Wegmarke"
        description="Für das Reisetagebuch"
        isInvalid
        errorMessage="Gib einen Namen für die Wegmarke ein."
      />,
    );

    const input = screen.getByRole("textbox", { name: "Name der Wegmarke" });
    expect(input).toHaveAccessibleDescription(/Für das Reisetagebuch/);
    expect(input).toHaveAccessibleDescription(/Gib einen Namen für die Wegmarke ein\./);
    expect(screen.getByText("Gib einen Namen für die Wegmarke ein.")).toBeInTheDocument();
  });
});

describe("ModalDialog", () => {
  it("closes with Escape and restores focus to its trigger", async () => {
    const user = userEvent.setup();
    render(
      <ModalDialog triggerLabel="Dialog öffnen" title="Wegmarke">
        {() => <p>Dialoginhalt</p>}
      </ModalDialog>,
    );

    const trigger = screen.getByRole("button", { name: "Dialog öffnen" });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Wegmarke" })).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
