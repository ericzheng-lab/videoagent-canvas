"use client";

import { Handle, Position } from "@xyflow/react";
import { useState } from "react";

export function PromptNode({ data }: { data: any }) {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="p-3 min-w-[220px]">
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="text-sm font-semibold mb-2">✏️ 提示词</div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="描述你想要生成的内容..."
        className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-2 text-sm resize-none min-h-[80px] placeholder:text-gray-500"
      />
    </div>
  );
}
