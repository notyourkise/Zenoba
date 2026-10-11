import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ItInfrastructureJourney, ZenobaHistoryJourney } from "./it-infrastructure-journey";

describe("ItInfrastructureJourney", () => {
  it("menyembunyikan detail sampai planet checkpoint dipilih atau di-hover", () => {
    render(<ItInfrastructureJourney />);

    expect(
      screen.queryAllByText(
        "Mulai dari perangkat, topologi, dan cara data bergerak.",
      ),
    ).toHaveLength(0);

    // Click locks popup
    fireEvent.click(
      screen.getAllByRole("button", {
        name: /Mercury.*Network Foundations/i,
      })[0],
    );

    expect(
      screen.getAllByText(
        "Mulai dari perangkat, topologi, dan cara data bergerak.",
      ),
    ).toHaveLength(2);
  });

  it("menampilkan pop-up saat planet di-hover atau difokuskan dengan keyboard", () => {
    render(<ItInfrastructureJourney />);

    const venusButtons = screen.getAllByRole("button", {
      name: /Venus.*IPv4 & Subnetting/i,
    });

    expect(
      screen.queryAllByText(
        "Pahami alamat IP, CIDR, subnet, dan perencanaan host.",
      ),
    ).toHaveLength(0);

    // Keyboard focus displays popup
    fireEvent.focus(venusButtons[0]);

    expect(
      screen.getAllByText(
        "Pahami alamat IP, CIDR, subnet, dan perencanaan host.",
      ),
    ).toHaveLength(2);

    // Blur hides popup when not locked
    fireEvent.blur(venusButtons[0]);

    expect(
      screen.queryAllByText(
        "Pahami alamat IP, CIDR, subnet, dan perencanaan host.",
      ),
    ).toHaveLength(0);
  });

  it("merender tab sliding trek perjalanan dan memungkinkan pergantian tab aktif", () => {
    render(<ItInfrastructureJourney />);

    const networkTab = screen.getByRole("tab", { name: "Network Engineer" });
    const sysadminTab = screen.getByRole("tab", { name: "SysAdmin & Linux" });
    const consultantTab = screen.getByRole("tab", { name: "IT Consultant" });

    expect(networkTab).toHaveAttribute("aria-selected", "true");
    expect(sysadminTab).toHaveAttribute("aria-selected", "false");
    expect(consultantTab).toHaveAttribute("aria-selected", "false");

    fireEvent.click(sysadminTab);

    expect(networkTab).toHaveAttribute("aria-selected", "false");
    expect(sysadminTab).toHaveAttribute("aria-selected", "true");
  });
});

describe("ZenobaHistoryJourney", () => {
  const origin = "Banyaknya informasi membuat pemula bingung mulai belajar dari mana. Zenoba hadir untuk memberi arah melalui roadmap dan jalur karier yang jelas.";

  it("shows only titles until a history planet is hovered, then hides its description on leave", () => {
    render(<ZenobaHistoryJourney />);
    const planet = screen.getByRole("button", { name: "Berawal dari keresahan" });
    expect(screen.queryByText(origin)).not.toBeInTheDocument();
    expect(planet).toHaveAttribute("aria-expanded", "false");
    fireEvent.mouseEnter(planet);
    expect(screen.getByText(origin)).toBeVisible();
    expect(planet).toHaveAttribute("aria-expanded", "true");
    fireEvent.mouseLeave(planet.closest("li")!);
    expect(screen.queryByText(origin)).not.toBeInTheDocument();
  });

  it("reveals descriptions on keyboard focus and dismisses them with Escape", () => {
    render(<ZenobaHistoryJourney />);
    const planet = screen.getByRole("button", { name: "Berawal dari keresahan" });
    fireEvent.focus(planet);
    expect(screen.getByText(origin)).toBeVisible();
    fireEvent.keyDown(planet, { key: "Escape" });
    expect(screen.queryByText(origin)).not.toBeInTheDocument();
    fireEvent.focus(planet);
    fireEvent.blur(planet);
    expect(screen.queryByText(origin)).not.toBeInTheDocument();
  });

  it("allows tap to toggle history details without opening learning dialogs", () => {
    render(<ZenobaHistoryJourney />);
    const planet = screen.getByRole("button", { name: "Berawal dari keresahan" });
    fireEvent.click(planet);
    expect(screen.getByText(origin)).toBeVisible();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(planet);
    expect(screen.queryByText(origin)).not.toBeInTheDocument();
  });
});
