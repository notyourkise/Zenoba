"use client";

import React, { useState } from "react";
import { Server, HardDrive, Shield, Wifi, Radio } from "lucide-react";

export interface DeviceSpec {
  name: string;
  category: "L1" | "L2" | "L3" | "Wireless" | "Security";
  layerName: string;
  description: string;
  keyRole: string;
  portsExample: string;
}

const SAMPLE_DEVICES: Record<string, DeviceSpec> = {
  switch: {
    name: "Managed Switch (Layer 2)",
    category: "L2",
    layerName: "Data Link Layer (Layer 2)",
    description: "Meneruskan frame data berdasarkan MAC Address ke port tujuan spesifik.",
    keyRole: "Pusat koneksi kabel LAN, segmentasi Collision Domain.",
    portsExample: "24x RJ-45 Gigabit + 4x SFP+ 10G",
  },
  router: {
    name: "Enterprise Router (Layer 3)",
    category: "L3",
    layerName: "Network Layer (Layer 3)",
    description: "Mengarahkan paket data antar subnet/network yang berbeda berdasarkan IP Address.",
    keyRole: "Routing antar LAN dan gateway menuju WAN / Internet.",
    portsExample: "2x Gigabit WAN + 4x Gigabit LAN",
  },
  firewall: {
    name: "Next-Gen Firewall (NGFW)",
    category: "Security",
    layerName: "Network s/d Application Layer (Layer 3–7)",
    description: "Memfilter trafik jaringan masuk dan keluar berdasarkan aturan keamanan (Security Rules).",
    keyRole: "Mencegah intrusi, proteksi malware, dan inspeksi paket stateful.",
    portsExample: "4x 10G SFP+ Dedicated Security Ports",
  },
  ap: {
    name: "Access Point Wi-Fi 6",
    category: "Wireless",
    layerName: "Physical & Data Link (Layer 1–2)",
    description: "Memancarkan sinyal radio frekuensi nirkabel (2.4GHz / 5GHz) untuk koneksi klien.",
    keyRole: "Menjembatani perangkat nirkabel ke switch kabel LAN.",
    portsExample: "1x 2.5Gbps PoE IN Uplink",
  },
  hub: {
    name: "Legacy Hub (Layer 1)",
    category: "L1",
    layerName: "Physical Layer (Layer 1)",
    description: "Menyalin bit data listrik dari satu port ke seluruh port lainnya (Repeat All).",
    keyRole: "Perangkat usang dengan 1 Collision Domain besar dan rawan tabrakan data.",
    portsExample: "8x 10/100 Mbps RJ45",
  },
};

export function DeviceCard({ defaultDevice = "switch" }: { defaultDevice?: string }) {
  const [selectedKey, setSelectedKey] = useState<string>(defaultDevice);
  const device = SAMPLE_DEVICES[selectedKey] || SAMPLE_DEVICES.switch;

  const getIcon = (cat: string) => {
    switch (cat) {
      case "L2":
        return <HardDrive className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      case "L3":
        return <Server className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case "Security":
        return <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />;
      case "Wireless":
        return <Wifi className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Radio className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <div className="my-8 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-5">
      {/* Device Selector Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
        {Object.keys(SAMPLE_DEVICES).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelectedKey(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
              selectedKey === key
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Main Spec Card */}
      <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              {getIcon(device.category)}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {device.name}
              </h3>
              <span className="inline-block mt-0.5 text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {device.layerName}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {device.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200/80 dark:border-gray-700">
            <span className="font-bold text-gray-900 dark:text-white block mb-1">
              Fungsi Kunci:
            </span>
            <span className="text-gray-600 dark:text-gray-400">{device.keyRole}</span>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200/80 dark:border-gray-700">
            <span className="font-bold text-gray-900 dark:text-white block mb-1">
              Contoh Port Fisik:
            </span>
            <span className="text-gray-600 dark:text-gray-400">{device.portsExample}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
