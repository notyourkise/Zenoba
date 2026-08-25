import { describe, expect, it } from "vitest";
import { executeSimulatedCommand } from "./terminal-simulator";

describe("Safe In-Browser Terminal Simulator", () => {
  it("displays help with supported diagnostic commands", () => {
    const res = executeSimulatedCommand("help");
    expect(res.output[0]).toContain("Available Diagnostic Commands");
    expect(res.output.join("\n")).toContain("ipconfig");
    expect(res.output.join("\n")).toContain("ping");
  });

  it("handles clear/cls correctly", () => {
    const res1 = executeSimulatedCommand("clear");
    expect(res1.clear).toBe(true);

    const res2 = executeSimulatedCommand("cls");
    expect(res2.clear).toBe(true);
  });

  it("executes ipconfig and ipconfig /all", () => {
    const res = executeSimulatedCommand("ipconfig");
    expect(res.output.join("\n")).toContain("192.168.1.100");
    expect(res.output.join("\n")).toContain("255.255.255.0");

    const resAll = executeSimulatedCommand("ipconfig /all");
    expect(resAll.output.join("\n")).toContain("Physical Address");
    expect(resAll.output.join("\n")).toContain("DNS Servers");
  });

  it("executes linux ip addr and ip route commands", () => {
    const resAddr = executeSimulatedCommand("ip addr");
    expect(resAddr.output.join("\n")).toContain("127.0.0.1/8");
    expect(resAddr.output.join("\n")).toContain("eth0");

    const resRoute = executeSimulatedCommand("ip route");
    expect(resRoute.output.join("\n")).toContain("default via 192.168.1.1");
  });

  it("executes ping with 4 ICMP echo replies", () => {
    const res = executeSimulatedCommand("ping 8.8.8.8");
    expect(res.output.join("\n")).toContain("Reply from 8.8.8.8");
    expect(res.output.join("\n")).toContain("Packets: Sent = 4, Received = 4");
  });

  it("executes arp -a", () => {
    const res = executeSimulatedCommand("arp -a");
    expect(res.output.join("\n")).toContain("192.168.1.1");
    expect(res.output.join("\n")).toContain("00-50-56-C0-00-01");
  });

  it("executes tracert and traceroute", () => {
    const res = executeSimulatedCommand("tracert netloka.biz.id");
    expect(res.output.join("\n")).toContain("Tracing route to netloka.biz.id");
    expect(res.output.join("\n")).toContain("Trace complete.");
  });

  it("executes nslookup and dig", () => {
    const res = executeSimulatedCommand("nslookup netloka.biz.id");
    expect(res.output.join("\n")).toContain("Address: 103.20.5.10");
  });

  it("executes netstat", () => {
    const res = executeSimulatedCommand("netstat -an");
    expect(res.output.join("\n")).toContain("LISTENING");
    expect(res.output.join("\n")).toContain("ESTABLISHED");
  });

  it("safely handles unknown commands without crashing", () => {
    const res = executeSimulatedCommand("rm -rf /");
    expect(res.output[0]).toContain("is not recognized as an internal or external command");
  });
});
