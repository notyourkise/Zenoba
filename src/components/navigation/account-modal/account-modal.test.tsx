import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AccountModal } from "./account-modal";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

const user = {
  id: "learner-test",
  name: "Learner",
  email: "learner@example.test",
};

beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("account rebrand compatibility", () => {
  it("opens the approved customer support mailbox", () => {
    render(
      <AccountModal
        isOpen
        onClose={() => {}}
        initialTab="support"
        user={user}
      />,
    );
    expect(
      screen.getByRole("link", { name: "Hubungi Tim Support" }),
    ).toHaveAttribute(
      "href",
      "mailto:founder@zenoba.tech?subject=Bantuan%20Platform%20Zenoba",
    );
  });

  it("preserves legacy CLI and disabled privacy preferences when saving a new choice", () => {
    localStorage.setItem(
      "netloka_cli_pref",
      JSON.stringify({ prompt: "cisco", fontSize: "16", speed: "instant" }),
    );
    localStorage.setItem(
      "netloka_privacy_pref",
      JSON.stringify({ leaderboard: false, streak: false }),
    );
    render(
      <AccountModal
        isOpen
        onClose={() => {}}
        initialTab="settings"
        user={user}
      />,
    );
    const selects = screen.getAllByRole("combobox");
    expect(selects[0]).toHaveValue("16");
    expect(selects[1]).toHaveValue("instant");
    fireEvent.change(selects[0], { target: { value: "12" } });
    expect(JSON.parse(localStorage.getItem("zenoba_cli_pref")!)).toEqual({
      prompt: "cisco",
      fontSize: "12",
      speed: "instant",
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Toggle leaderboard visibility" }),
    );
    expect(JSON.parse(localStorage.getItem("zenoba_privacy_pref")!)).toEqual({
      leaderboard: true,
      streak: false,
    });
    expect(JSON.parse(localStorage.getItem("netloka_privacy_pref")!)).toEqual({
      leaderboard: false,
      streak: false,
    });
  });

  it("prefers new settings over legacy settings and tolerates invalid JSON", () => {
    localStorage.setItem(
      "netloka_cli_pref",
      JSON.stringify({ fontSize: "16" }),
    );
    localStorage.setItem("zenoba_cli_pref", JSON.stringify({ fontSize: "12" }));
    localStorage.setItem("zenoba_privacy_pref", "invalid");
    render(
      <AccountModal
        isOpen
        onClose={() => {}}
        initialTab="settings"
        user={user}
      />,
    );
    expect(screen.getAllByRole("combobox")[0]).toHaveValue("12");
    fireEvent.click(
      screen.getByRole("button", { name: "Toggle streak reminder" }),
    );
    expect(JSON.parse(localStorage.getItem("zenoba_privacy_pref")!)).toEqual({
      leaderboard: true,
      streak: false,
    });
  });

  it("keeps disabled Zenoba privacy choices even when legacy choices are enabled", () => {
    localStorage.setItem(
      "netloka_privacy_pref",
      JSON.stringify({ leaderboard: true, streak: true }),
    );
    localStorage.setItem(
      "zenoba_privacy_pref",
      JSON.stringify({ leaderboard: false, streak: false }),
    );
    render(
      <AccountModal
        isOpen
        onClose={() => {}}
        initialTab="settings"
        user={user}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Toggle streak reminder" }),
    );
    expect(JSON.parse(localStorage.getItem("zenoba_privacy_pref")!)).toEqual({
      leaderboard: false,
      streak: true,
    });
  });
});
