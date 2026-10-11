import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { DnsQueryVisualizer } from "./dns-query-visualizer";

afterEach(cleanup);

it("delegates a .tech query from root to the matching TLD then authoritative server", () => {
  render(<DnsQueryVisualizer />);
  expect(
    screen.getByRole("heading", {
      name: /Klien Meminta Resolusi 'zenoba.tech'/,
    }),
  ).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: "Langkah Resolusi Berikutnya" }),
  );
  expect(
    screen.getByText(/mengarahkan query ke TLD Server untuk domain '.tech'/),
  ).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: "Langkah Resolusi Berikutnya" }),
  );
  expect(
    screen.getByRole("heading", {
      name: "3. Query ke TLD Name Server ('.tech')",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/registry '.tech'.*'zenoba.tech'/),
  ).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: "Langkah Resolusi Berikutnya" }),
  );
  expect(
    screen.getByRole("heading", {
      name: "4. Query ke Authoritative Name Server",
    }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Reset Alur" }));
  expect(
    screen.getByRole("heading", {
      name: /Klien Meminta Resolusi 'zenoba.tech'/,
    }),
  ).toBeInTheDocument();
});
