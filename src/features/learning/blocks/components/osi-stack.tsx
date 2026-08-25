"use client";

import React, { useState } from "react";
import { Layers } from "lucide-react";

interface LayerInfo {
  num: number;
  name: string;
  pdu: string;
  tcpLayer: string;
  description: string;
  protocols: string;
  devices: string;
}

const OSI_LAYERS: LayerInfo[] = [
  {
    num: 7,
    name: "Application Layer",
    pdu: "Data",
    tcpLayer: "Application",
    description: "Antarmuka langsung antara aplikasi perangkat lunak dan layanan jaringan pengguna.",
    protocols: "HTTP, HTTPS, DNS, DHCP, FTP, SSH",
    devices: "Host, Browser, Mail Client",
  },
  {
    num: 6,
    name: "Presentation Layer",
    pdu: "Data",
    tcpLayer: "Application",
    description: "Format data, enkripsi/dekripsi (SSL/TLS), dan kompresi data agar dapat dimengerti sistem penerima.",
    protocols: "TLS/SSL, JPEG, ASCII, MPEG",
    devices: "OS Translation Engine",
  },
  {
    num: 5,
    name: "Session Layer",
    pdu: "Data",
    tcpLayer: "Application",
    description: "Membuka, mengelola, menyinkronkan, dan menutup sesi komunikasi antar aplikasi.",
    protocols: "NetBIOS, RPC, Sockets",
    devices: "OS Session Management",
  },
  {
    num: 4,
    name: "Transport Layer",
    pdu: "Segment (TCP) / Datagram (UDP)",
    tcpLayer: "Transport",
    description: "Transmisi data end-to-end andal dengan nomor port, segmentasi, dan kontrol aliran (Flow Control).",
    protocols: "TCP (Reliable, Handshake), UDP (Fast, Connectionless)",
    devices: "Firewall L4, Host Kernel",
  },
  {
    num: 3,
    name: "Network Layer",
    pdu: "Packet",
    tcpLayer: "Internet",
    description: "Pengalamatan logis (IP Address) dan penentuan rute terbaik (Routing) antar jaringan yang berbeda.",
    protocols: "IPv4, IPv6, ICMP, OSPF, BGP",
    devices: "Router, Layer 3 Switch",
  },
  {
    num: 2,
    name: "Data Link Layer",
    pdu: "Frame",
    tcpLayer: "Network Access",
    description: "Pengalamatan fisik (MAC Address), deteksi error (FCS), dan transfer data antar node di media fisik lokal.",
    protocols: "Ethernet (IEEE 802.3), Wi-Fi (802.11), ARP",
    devices: "Switch L2, Network Interface Card (NIC), Bridge",
  },
  {
    num: 1,
    name: "Physical Layer",
    pdu: "Bits (0 & 1)",
    tcpLayer: "Network Access",
    description: "Transmisi sinyal elektrik, cahaya, atau gelombang radio melalui media transmisi fisik.",
    protocols: "1000BASE-T, 10GBASE-SR, RJ-45",
    devices: "Kabel UTP/STP, Fiber Optic, Hub, Repeater",
  },
];

export function OSIStack() {
  const [selectedLayerNum, setSelectedLayerNum] = useState<number>(7);
  const layer = OSI_LAYERS.find((l) => l.num === selectedLayerNum) || OSI_LAYERS[0];

  return (
    <div className="my-8 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
      <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 border-b border-gray-100 dark:border-gray-700 pb-3">
        <Layers className="w-4 h-4" />
        <span>Interactive OSI 7-Layer & TCP/IP Stack Explorer</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Layer Stack Interactive Column */}
        <div className="md:col-span-5 space-y-2">
          {OSI_LAYERS.map((l) => {
            const isSelected = selectedLayerNum === l.num;

            return (
              <button
                key={l.num}
                type="button"
                onClick={() => setSelectedLayerNum(l.num)}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-md scale-102"
                    : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 hover:border-blue-400"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isSelected ? "bg-white text-blue-600" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {l.num}
                  </span>
                  <span className="text-xs font-bold">{l.name}</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    isSelected ? "bg-blue-700 text-blue-100" : "bg-gray-200 dark:bg-gray-800 text-gray-500"
                  }`}
                >
                  {l.pdu}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Layer Deep Dive Column */}
        <div className="md:col-span-7 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200/80 dark:border-gray-800 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Layer {layer.num} — {layer.pdu}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                TCP/IP: {layer.tcpLayer}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
              {layer.name}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {layer.description}
          </p>

          <div className="space-y-2.5 pt-2 text-xs">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200/80 dark:border-gray-700">
              <span className="font-bold text-gray-900 dark:text-white block mb-0.5">
                Protokol Utama:
              </span>
              <span className="text-gray-600 dark:text-gray-400 font-mono text-[11px]">
                {layer.protocols}
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200/80 dark:border-gray-700">
              <span className="font-bold text-gray-900 dark:text-white block mb-0.5">
                Perangkat / Entitas Terkait:
              </span>
              <span className="text-gray-600 dark:text-gray-400">{layer.devices}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
