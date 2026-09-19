// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import "../test/setup";
import { App } from "./App";

describe("App", () => {
  it("renders the project-foundation home screen", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "DnDimension" })).toBeInTheDocument();
    expect(screen.getByText("Project Foundation")).toBeInTheDocument();
  });

  it("renders validated build health", () => {
    render(
      <MemoryRouter initialEntries={["/health"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("status")).toHaveTextContent("0.1.0");
  });
});
