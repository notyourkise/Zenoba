"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, CornerDownLeft } from "lucide-react";
import { executeSimulatedCommand } from "@/features/network-logic/terminal/terminal-simulator";
import { useLearningDraft } from "../../drafts/use-learning-draft";

interface HistoryEntry {
  command: string;
  output: string[];
}

interface TerminalBlockPlayerProps {
  block?: {
    id?: string;
    [key: string]: unknown;
  };
  lessonId?: string;
}

interface TerminalDraftPayload {
  input: string;
  history: HistoryEntry[];
  commandHistory: string[];
}

export function TerminalBlockPlayer({ block, lessonId }: TerminalBlockPlayerProps = {}) {
  const [input, setInput] = useState<string>("");
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      command: "ipconfig",
      output: [
        "Windows IP Configuration",
        "",
        "Ethernet adapter Ethernet0:",
        "   IPv4 Address. . . . . . . . . . . : 192.168.1.100",
        "   Subnet Mask . . . . . . . . . . . : 255.255.255.0",
        "   Default Gateway . . . . . . . . . : 192.168.1.1",
      ],
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>(["ipconfig"]);

  const activityId = block?.id || "terminal";

  useLearningDraft<TerminalDraftPayload>({
    lessonId,
    activityId,
    payload: { input, history, commandHistory },
    onRestore: (draftPayload) => {
      if (draftPayload) {
        if (typeof draftPayload.input === "string") setInput(draftPayload.input);
        if (Array.isArray(draftPayload.history)) setHistory(draftPayload.history);
        if (Array.isArray(draftPayload.commandHistory)) setCommandHistory(draftPayload.commandHistory);
      }
    },
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!input.trim()) return;

      const result = executeSimulatedCommand(input);

      if (result.clear) {
        setHistory([]);
      } else {
        setHistory((prev) => [...prev, { command: input, output: result.output }]);
      }

      setCommandHistory((prev) => [...prev, input]);
      setHistoryIndex(-1);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex =
          historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < commandHistory.length) {
          setHistoryIndex(nextIndex);
          setInput(commandHistory[nextIndex] || "");
        } else {
          setHistoryIndex(-1);
          setInput("");
        }
      }
    }
  };

  return (
    <div className="my-8 rounded-2xl bg-gray-950 border border-gray-800 shadow-xl overflow-hidden font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="bg-gray-900 px-4 py-2.5 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-gray-300 font-bold">
          <TerminalIcon className="w-4 h-4 text-green-400" />
          <span>Netloka Command Prompt (Simulated)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
        </div>
      </div>

      {/* Terminal Body */}
      <div
        className="p-4 min-h-64 max-h-96 overflow-y-auto space-y-3 text-gray-200"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="text-gray-500 text-[11px] pb-1 border-b border-gray-900">
          Ketik <code>help</code> untuk melihat daftar perintah diagnostik jaringan yang didukung.
        </div>

        {/* History Stream */}
        {history.map((entry, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center space-x-2 text-green-400 font-bold">
              <span className="text-gray-500">C:\Users\Student&gt;</span>
              <span>{entry.command}</span>
            </div>
            <div className="text-gray-300 whitespace-pre-wrap pl-2 leading-relaxed">
              {entry.output.map((line, lIdx) => (
                <div key={lIdx}>{line}</div>
              ))}
            </div>
          </div>
        ))}

        {/* Active Input Line */}
        <div className="flex items-center space-x-2 text-green-400">
          <span className="text-gray-500">C:\Users\Student&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-green-300 font-mono text-xs outline-none caret-green-400"
            autoComplete="off"
            spellCheck={false}
            autoFocus
          />
          <CornerDownLeft className="w-3.5 h-3.5 text-gray-600" />
        </div>

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
