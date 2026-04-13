"use client";

import { Plus, Image, Type, Palette, FileImage } from "lucide-react";
import { useCanvasStore } from "@/lib/store";

const TOOLS = [
  { type: "imageInput", icon: Image, label: "参考图" },
  { type: "prompt", icon: Type, label: "提示词" },
  { type: "generate", icon: Palette, label: "生成" },
  { type: "output", icon: FileImage, label: "输出" },
];

export function CanvasToolbar() {
  const addNode = useCanvasStore((s) => s.addNode);

  return (
    <div className="bg-[#1a1a2e] border-b border-[#2a2a3e] px-4 py-2 flex items-center gap-3">
      <span className="text-sm font-semibold text-white">🎨 Canvas</span>
      <div className="h-6 w-px bg-[#2a2a3e]" />
      {TOOLS.map(({ type, icon: Icon, label }) => (
        <button
          key={type}
          onClick={() => addNode(type)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2a2a3e] hover:bg-[#3a3a4e] text-sm transition"
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
