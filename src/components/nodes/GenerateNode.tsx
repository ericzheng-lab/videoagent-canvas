"use client";

import { Handle, Position } from "@xyflow/react";
import { useState } from "react";
import { apiGenerate, pollStatus } from "@/lib/api";

export function GenerateNode({ data, id }: { data: any; id: string }) {
  const [model, setModel] = useState("nano-banana-pro-4k");
  const [aspect, setAspect] = useState("1:1");
  const [status, setStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleGenerate = async () => {
    setStatus("⏳ 提交中...");
    setImageUrl("");
    try {
      const res = await apiGenerate({ mode: "nano-banana-generate", model, aspect, prompt: "" });
      if (res.success && res.images?.[0]) {
        setImageUrl(res.images[0].url);
        setStatus("✅ 完成");
      } else {
        setStatus("❌ " + (res.error || "生成失败"));
      }
    } catch (err: any) {
      setStatus("❌ " + err.message);
    }
  };

  return (
    <div className="p-3 min-w-[220px]">
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="text-sm font-semibold mb-2">🎨 生成</div>
      <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded p-1.5 text-sm mb-2">
        <option value="nano-banana-pro-4k">NanoBanana ¥2.00</option>
        <option value="midjourney">Midjourney ¥1.00</option>
      </select>
      <select value={aspect} onChange={(e) => setAspect(e.target.value)} className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded p-1.5 text-sm mb-2">
        <option value="1:1">1:1</option>
        <option value="16:9">16:9</option>
        <option value="9:16">9:16</option>
      </select>
      <button onClick={handleGenerate} className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-lg py-1.5 text-sm font-medium transition">
        生成
      </button>
      {status && <div className="mt-2 text-xs text-gray-400">{status}</div>}
      {imageUrl && (
        <img src={imageUrl} className="mt-2 w-full rounded-lg border border-[#2a2a3e]" />
      )}
    </div>
  );
}
