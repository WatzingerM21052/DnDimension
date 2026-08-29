// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";

import { WaypointDraftPattern } from "../index";

afterEach(cleanup);

describe("WaypointDraftPattern", () => {
  it("keeps invalid input in the dialog and confirms a valid waypoint", async () => {
    const user = userEvent.setup();
    render(<WaypointDraftPattern />);

    await user.click(screen.getByRole("button", { name: "Wegmarke anlegen" }));
    const input = screen.getByRole("textbox", { name: "Name der Wegmarke" });
    await user.type(input, "   ");
    await user.click(screen.getByRole("button", { name: "Wegmarke speichern" }));

    expect(screen.getByText("Gib einen Namen für die Wegmarke ein.")).toBeInTheDocument();
    expect(input).toHaveFocus();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(input).toHaveValue("   ");

    await user.clear(input);
    await user.type(input, " Mondbrücke ");
    await user.click(screen.getByRole("button", { name: "Wegmarke speichern" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Wegmarke „Mondbrücke“ wurde vorgemerkt.");
    expect(screen.getByRole("button", { name: "Entwurf" })).toHaveAttribute("aria-pressed", "true");
  });

  it("closes the draft dialog when cancelling", async () => {
    const user = userEvent.setup();
    render(<WaypointDraftPattern />);

    await user.click(screen.getByRole("button", { name: "Wegmarke anlegen" }));
    await user.click(screen.getByRole("button", { name: "Abbrechen" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("submits a corrected waypoint through Enter in the name field", async () => {
    const user = userEvent.setup();
    render(<WaypointDraftPattern />);

    await user.click(screen.getByRole("button", { name: "Wegmarke anlegen" }));
    const input = screen.getByRole("textbox", { name: "Name der Wegmarke" });
    await user.type(input, "   ");
    await user.click(screen.getByRole("button", { name: "Wegmarke speichern" }));
    expect(screen.getByText("Gib einen Namen für die Wegmarke ein.")).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, " Sternenpfad ");
    await user.keyboard("{Enter}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Wegmarke „Sternenpfad“ wurde vorgemerkt.",
    );
    expect(screen.getByRole("button", { name: "Entwurf" })).toHaveAttribute("aria-pressed", "true");
  });

  it("has no non-color accessibility violations", async () => {
    const { container } = render(<WaypointDraftPattern />);

    const results = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    });

    expect(results.violations).toEqual([]);
  });
});
