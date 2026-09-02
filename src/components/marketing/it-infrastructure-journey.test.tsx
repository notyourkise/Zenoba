import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ItInfrastructureJourney } from "./it-infrastructure-journey";

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
