// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it } from "vitest";
import { createMemoryAggregateStore } from "@dndimension/core";
import { StorageLab } from "./StorageLab";
afterEach(cleanup);

it("loads and saves through the actual store contract", async () => {
  const user = userEvent.setup();
  const store = createMemoryAggregateStore();
  render(<StorageLab store={store} />);
  await user.click(screen.getByRole("button", { name: "Spielstand laden" }));
  await user.type(screen.getByLabelText("Kampagnenname"), "Clockwork Coast");
  await user.click(screen.getByRole("button", { name: "Spielstand speichern" }));
  expect(await screen.findByText("Gespeichert · Revision 1")).toBeInTheDocument();
  expect((await store.read("lab-campaign"))?.value).toEqual({ name: "Clockwork Coast" });
});

it("keeps the draft when another writer has changed the stored revision", async () => {
  const user = userEvent.setup();
  const store = createMemoryAggregateStore();
  render(<StorageLab store={store} />);
  await user.click(screen.getByRole("button", { name: "Spielstand laden" }));
  await user.type(screen.getByLabelText("Kampagnenname"), "My draft");
  await store.commit({
    commandId: "other",
    aggregateId: "lab-campaign",
    expectedRevision: 0,
    value: { name: "Other tab" },
    event: null,
  });
  await user.click(screen.getByRole("button", { name: "Spielstand speichern" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("anderer Tab");
  expect(screen.getByLabelText("Kampagnenname")).toHaveValue("My draft");
  expect((await store.read("lab-campaign"))?.value).toEqual({ name: "Other tab" });
});
