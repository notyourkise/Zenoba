/**
 * Safe In-Browser Terminal Simulator Engine
 * Strictly interprets commands within a deterministic simulation sandbox.
 * NEVER routes commands to host OS / exec / spawn / shell / SSH.
 */

export interface SimulatedHostState {
  hostname: string;
  interfaces: {
    name: string;
    description: string;
    macAddress: string;
    ipAddress: string;
    subnetMask: string;
    gateway: string;
    dnsServer: string;
    dhcpEnabled: boolean;
  }[];
  arpCache: { ip: string; mac: string; type: "dynamic" | "static" }[];
  routingTable: { destination: string; mask: string; gateway: string; iface: string; metric: number }[];
  openSockets: { proto: "TCP" | "UDP"; localAddr: string; foreignAddr: string; state: string }[];
}

export const DEFAULT_SIMULATED_HOST: SimulatedHostState = {
  hostname: "ZENOBA-WORKSTATION",
  interfaces: [
    {
      name: "Ethernet0",
      description: "Realtek PCIe GbE Family Controller",
      macAddress: "00-1A-2B-3C-4D-5E",
      ipAddress: "192.168.1.100",
      subnetMask: "255.255.255.0",
      gateway: "192.168.1.1",
      dnsServer: "1.1.1.1",
      dhcpEnabled: true,
    },
  ],
  arpCache: [
    { ip: "192.168.1.1", mac: "00-50-56-C0-00-01", type: "dynamic" },
    { ip: "192.168.1.254", mac: "00-0C-29-8A-1F-9B", type: "dynamic" },
    { ip: "255.255.255.255", mac: "FF-FF-FF-FF-FF-FF", type: "static" },
  ],
  routingTable: [
    { destination: "0.0.0.0", mask: "0.0.0.0", gateway: "192.168.1.1", iface: "192.168.1.100", metric: 25 },
    { destination: "192.168.1.0", mask: "255.255.255.0", gateway: "On-link", iface: "192.168.1.100", metric: 281 },
    { destination: "127.0.0.1", mask: "255.255.255.255", gateway: "On-link", iface: "127.0.0.1", metric: 331 },
  ],
  openSockets: [
    { proto: "TCP", localAddr: "0.0.0.0:135", foreignAddr: "0.0.0.0:0", state: "LISTENING" },
    { proto: "TCP", localAddr: "192.168.1.100:54321", foreignAddr: "103.20.5.10:443", state: "ESTABLISHED" },
    { proto: "UDP", localAddr: "0.0.0.0:5353", foreignAddr: "*:*", state: "" },
  ],
};

export interface TerminalExecutionResult {
  output: string[];
  clear?: boolean;
}

export function executeSimulatedCommand(
  rawInput: string,
  state: SimulatedHostState = DEFAULT_SIMULATED_HOST
): TerminalExecutionResult {
  const trimmed = rawInput.trim();
  if (!trimmed) return { output: [] };

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (cmd) {
    case "clear":
    case "cls":
      return { output: [], clear: true };

    case "help":
      return {
        output: [
          "Zenoba Simulated Terminal — Available Diagnostic Commands:",
          "  ipconfig [/all]     Display IP address, subnet mask, gateway, and DNS",
          "  ip addr / ip route  Display Linux network interface & route info",
          "  ping <target>       Send ICMP Echo requests to test reachability",
          "  arp -a              Display the ARP cache mapping (IP -> MAC)",
          "  traceroute <target> Display router hops to destination",
          "  tracert <target>    Windows equivalent of traceroute",
          "  route print         Display local IPv4 routing table",
          "  nslookup <domain>   Query DNS for domain A records",
          "  dig <domain>        Linux DNS lookup utility",
          "  netstat [-an]       Display active TCP/UDP ports and connections",
          "  clear / cls         Clear terminal screen",
        ],
      };

    case "ipconfig": {
      const isAll = args.includes("/all");
      const lines: string[] = [
        "Windows IP Configuration",
        "",
        `Host Name . . . . . . . . . . . . : ${state.hostname}`,
      ];

      for (const iface of state.interfaces) {
        lines.push(
          "",
          `Ethernet adapter ${iface.name}:`,
          ""
        );
        if (isAll) {
          lines.push(
            `   Description . . . . . . . . . . . : ${iface.description}`,
            `   Physical Address. . . . . . . . . : ${iface.macAddress}`,
            `   DHCP Enabled. . . . . . . . . . . : ${iface.dhcpEnabled ? "Yes" : "No"}`
          );
        }
        lines.push(
          `   IPv4 Address. . . . . . . . . . . : ${iface.ipAddress}`,
          `   Subnet Mask . . . . . . . . . . . : ${iface.subnetMask}`,
          `   Default Gateway . . . . . . . . . : ${iface.gateway}`
        );
        if (isAll) {
          lines.push(`   DNS Servers . . . . . . . . . . . : ${iface.dnsServer}`);
        }
      }
      return { output: lines };
    }

    case "ip": {
      const sub = args[0]?.toLowerCase();
      if (sub === "a" || sub === "addr" || sub === "address") {
        return {
          output: [
            "1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN",
            "    inet 127.0.0.1/8 scope host lo",
            `2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP`,
            `    link/ether ${state.interfaces[0]?.macAddress.toLowerCase().replace(/-/g, ":")} brd ff:ff:ff:ff:ff:ff`,
            `    inet ${state.interfaces[0]?.ipAddress}/24 brd 192.168.1.255 scope global eth0`,
          ],
        };
      }
      if (sub === "r" || sub === "route") {
        return {
          output: [
            `default via ${state.interfaces[0]?.gateway} dev eth0 proto dhcp metric 100`,
            "192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100 metric 100",
          ],
        };
      }
      return {
        output: [
          "Usage: ip [ addr | route ]",
        ],
      };
    }

    case "arp": {
      return {
        output: [
          "Interface: 192.168.1.100 --- 0x2",
          "  Internet Address      Physical Address      Type",
          ...state.arpCache.map(
            (entry) =>
              `  ${entry.ip.padEnd(21, " ")}${entry.mac.padEnd(22, " ")}${entry.type}`
          ),
        ],
      };
    }

    case "ping": {
      const target = args[0] || "8.8.8.8";
      return {
        output: [
          `Pinging ${target} with 32 bytes of data:`,
          `Reply from ${target}: bytes=32 time=14ms TTL=117`,
          `Reply from ${target}: bytes=32 time=12ms TTL=117`,
          `Reply from ${target}: bytes=32 time=15ms TTL=117`,
          `Reply from ${target}: bytes=32 time=13ms TTL=117`,
          "",
          `Ping statistics for ${target}:`,
          `    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),`,
          `Approximate round trip times in milli-seconds:`,
          `    Minimum = 12ms, Maximum = 15ms, Average = 13ms`,
        ],
      };
    }

    case "tracert":
    case "traceroute": {
      const target = args[0] || "zenoba.tech";
      return {
        output: [
          `Tracing route to ${target} over a maximum of 30 hops:`,
          "",
          `  1     1 ms     1 ms     1 ms  ${state.interfaces[0]?.gateway}`,
          "  2    10 ms     9 ms    11 ms  10.200.0.1 (ISP Gateway)",
          "  3    14 ms    13 ms    14 ms  103.20.5.10 (zenoba.tech)",
          "",
          "Trace complete.",
        ],
      };
    }

    case "route": {
      return {
        output: [
          "===========================================================================",
          "IPv4 Route Table",
          "===========================================================================",
          "Active Routes:",
          "Network Destination        Netmask          Gateway       Interface  Metric",
          ...state.routingTable.map(
            (r) =>
              `${r.destination.padEnd(20, " ")} ${r.mask.padEnd(16, " ")} ${r.gateway.padEnd(16, " ")} ${r.iface.padEnd(12, " ")} ${r.metric}`
          ),
          "===========================================================================",
        ],
      };
    }

    case "nslookup":
    case "dig": {
      const domain = args[0] || "zenoba.tech";
      return {
        output: [
          `Server:  ${state.interfaces[0]?.dnsServer}`,
          `Address: ${state.interfaces[0]?.dnsServer}#53`,
          "",
          "Non-authoritative answer:",
          `Name:    ${domain}`,
          "Address: 103.20.5.10",
        ],
      };
    }

    case "netstat": {
      return {
        output: [
          "Active Connections",
          "",
          "  Proto  Local Address          Foreign Address        State",
          ...state.openSockets.map(
            (s) =>
              `  ${s.proto.padEnd(6, " ")}${s.localAddr.padEnd(23, " ")}${s.foreignAddr.padEnd(23, " ")}${s.state}`
          ),
        ],
      };
    }

    default:
      return {
        output: [
          `'${cmd}' is not recognized as an internal or external command,`,
          "operable program or batch file.",
          "Type 'help' to view supported diagnostic commands.",
        ],
      };
  }
}
