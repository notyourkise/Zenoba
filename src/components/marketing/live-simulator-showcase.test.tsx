import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LiveSimulatorShowcase } from "./live-simulator-showcase";

describe("LiveSimulatorShowcase", () => {
  it("menghubungkan tab aktif dengan panel simulator secara aksesibel", () => {
    render(<LiveSimulatorShowcase />);

    const tabList = screen.getByRole("tablist", {
      name: "Pilihan simulator interaktif",
    });
    const activeTab = within(tabList).getByRole("tab", {
      name: "Terminal Diagnostik CLI",
    });
    const panel = screen.getByRole("tabpanel", {
      name: "Terminal Diagnostik CLI",
    });

    expect(activeTab).toHaveAttribute("aria-selected", "true");
    expect(activeTab).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", activeTab.id);
  });

  it("merender judul dan 3 tab default di awal", () => {
    render(<LiveSimulatorShowcase />);

    expect(
      screen.getByRole("heading", { name: /Uji Coba Simulator Jaringan/i }),
    ).toBeInTheDocument();

    expect(screen.getByText("Terminal Diagnostik CLI")).toBeInTheDocument();
    expect(screen.getByText("Kalkulator Subnet IPv4")).toBeInTheDocument();
    expect(screen.getByText("Visualizer Alur Paket ICMP")).toBeInTheDocument();

    // Check terminal prompt
    expect(screen.getByText(/guest@netloka-simulator/i)).toBeInTheDocument();
    expect(screen.getByText("ping 192.168.1.1")).toBeInTheDocument();
  });

  it("dapat mengeksekusi preset command pada terminal", () => {
    render(<LiveSimulatorShowcase />);

    const pingPreset = screen.getByRole("button", { name: "ping 192.168.1.1" });
    fireEvent.click(pingPreset);

    expect(
      screen.getByText(/Pinging 192.168.1.1 with 32 bytes of data/i),
    ).toBeInTheDocument();
  });

  it("dapat berpindah ke tab Kalkulator Subnet dan menghitung CIDR", () => {
    render(<LiveSimulatorShowcase />);

    const subnetTabBtn = screen.getByRole("tab", {
      name: "Kalkulator Subnet IPv4",
    });
    fireEvent.click(subnetTabBtn);

    expect(screen.getByText("Network Address")).toBeInTheDocument();
    expect(screen.getByText("Broadcast Address")).toBeInTheDocument();
    expect(
      screen.getByText("Rentang Host yang Dapat Dipakai"),
    ).toBeInTheDocument();
  });

  it("dapat berpindah ke tab Visualizer Alur Paket ICMP", () => {
    render(<LiveSimulatorShowcase />);

    const packetTabBtn = screen.getByRole("tab", {
      name: "Visualizer Alur Paket ICMP",
    });
    fireEvent.click(packetTabBtn);

    expect(screen.getByText("PC-1")).toBeInTheDocument();
    expect(screen.getByText("SW-1")).toBeInTheDocument();
    expect(screen.getByText("RTR-GW")).toBeInTheDocument();
    expect(screen.getByText("SRV-1")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Kirim Ping/i }),
    ).toBeInTheDocument();
  });

  it("dapat menggeser menu tab menggunakan tombol panah kanan > dan kiri <", () => {
    render(<LiveSimulatorShowcase />);

    const nextBtn = screen.getByRole("button", {
      name: /Geser tab simulator ke kanan/i,
    });
    const prevBtn = screen.getByRole("button", {
      name: /Geser tab simulator ke kiri/i,
    });

    // Initial state: prev is disabled
    expect(prevBtn).toBeDisabled();
    expect(nextBtn).toBeEnabled();

    // Click next to slide to next set of 3 tabs
    fireEvent.click(nextBtn);
    expect(screen.getByText("Kalkulator Permission Linux")).toBeInTheDocument();

    // Click on chmod tab
    const chmodTab = screen.getByRole("tab", {
      name: "Kalkulator Permission Linux",
    });
    fireEvent.click(chmodTab);
    expect(
      screen.getByText(/Perintah Terminal & Notasi Simbolik/i),
    ).toBeInTheDocument();

    // Click next several times to slide to the end
    fireEvent.click(nextBtn);
    fireEvent.click(nextBtn);
    fireEvent.click(nextBtn);

    // End tab: SSL/TLS
    if (screen.queryByText("Visualizer Handshake SSL/TLS")) {
      const tlsTab = screen.getByRole("tab", {
        name: "Visualizer Handshake SSL/TLS",
      });
      fireEvent.click(tlsTab);
      expect(screen.getByText(/1. Client Hello/i)).toBeInTheDocument();
    }

    // Click prev to slide back
    fireEvent.click(prevBtn);
    expect(prevBtn).toBeEnabled();
  });

  it("dapat membuka tab VLAN dan menjalankan simulasi transmisi frame", () => {
    render(<LiveSimulatorShowcase />);

    const nextBtn = screen.getByRole("button", {
      name: /Geser tab simulator ke kanan/i,
    });
    fireEvent.click(nextBtn);
    fireEvent.click(nextBtn);

    const vlanTab = screen.getByRole("tab", {
      name: "Segmentasi VLAN & Trunking",
    });
    fireEvent.click(vlanTab);

    expect(screen.getByText(/Panel Port Switch 8-Port/i)).toBeInTheDocument();
    const testPingBtn = screen.getByRole("button", {
      name: /Uji Transmisi VLAN Frame/i,
    });
    fireEvent.click(testPingBtn);
    expect(
      screen.getByText(
        /Sukses: Port 1 dan Port 2 berada di VLAN 10 yang sama/i,
      ),
    ).toBeInTheDocument();
  });
});
