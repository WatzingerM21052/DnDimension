// @vitest-environment jsdom

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Icon, Stack, Surface, Text, VisuallyHidden, WayfinderIcon } from "../index";

describe("semantic UI primitives", () => {
  it("renders semantic text and reading surfaces without losing caller classes", () => {
    render(
      <Surface as="article" variant="reading" className="caller-surface">
        <Text as="h2" variant="title" tone="on-reading">
          Reisejournal
        </Text>
      </Surface>,
    );

    expect(screen.getByRole("article")).toHaveClass("caller-surface");
    expect(screen.getByRole("heading", { name: "Reisejournal" })).toBeInTheDocument();
  });

  it("renders stacks as semantic sections without losing caller classes", () => {
    render(
      <Stack as="section" aria-label="Reiseetappen" className="caller-stack">
        Etappe eins
      </Stack>,
    );

    expect(screen.getByRole("region", { name: "Reiseetappen" })).toHaveClass("caller-stack");
  });

  it("keeps visually hidden text available to assistive technology", () => {
    render(<VisuallyHidden>Zusätzliche Wegbeschreibung</VisuallyHidden>);

    expect(screen.getByText("Zusätzliche Wegbeschreibung")).toBeInTheDocument();
  });

  it("hides decorative icons and names informative icons", () => {
    const { rerender } = render(<WayfinderIcon />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    rerender(<WayfinderIcon label="Aktive Wegmarke" />);
    expect(screen.getByRole("img", { name: "Aktive Wegmarke" })).toBeInTheDocument();
  });

  it("uses the same accessibility contract for generic mask icons", () => {
    const { container, rerender } = render(<Icon source="/icons/marker.svg" />);
    expect(within(container).queryByRole("img")).not.toBeInTheDocument();
    rerender(<Icon source="/icons/marker.svg" label="Kartenmarkierung" />);
    expect(within(container).getByRole("img", { name: "Kartenmarkierung" })).toBeInTheDocument();
  });
});
