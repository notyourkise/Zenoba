import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SlidingButtonLabel } from "./sliding-button-label";

describe("SlidingButtonLabel", () => {
  test("exposes one accessible name while rendering the animated duplicate", () => {
    render(
      <a href="#jelajahi">
        <SlidingButtonLabel text="Jelajahi" />
      </a>,
    );

    expect(
      screen.getByRole("link", { name: "Jelajahi" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("link", { name: "Jelajahi Jelajahi" }),
    ).not.toBeInTheDocument();
  });
});
