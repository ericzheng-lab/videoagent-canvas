"use client";

import { Handle, Position, useReactFlow } from "@xyflow/react";
import { useState } from "react";
import { useCanvasStore } from "@/lib/store";
import { apiGenerate } from "@/lib/api";

export function GenerateNode({ id }: { id: string }) {
  const [model, setModel] = useState("nano-banana-pro-4k");
  const [aspect, setAspect] = useState("1:1");
  const [status, setStatus] = useState("");
  const setNodeData = useCanvasStore((s) => s.setNodeData);
  const { getEdges } = useReactFlow();

  const handleGenerate = async () => {
    const edges = getEdges();
    const { images, prompt } = useCanvasStore.getState().getInputData(edges, id);

    if (!prompt && images.length === 0) {
      setStatus("❌ 请连接参考图或提示词节点");
      return;
    }

    setStatus("⏳ 提交中...");
    setNodeData(id, { status: "pending" });

    try {
      const payload: any = {
        mode: model === "midjourney" ? "mj-imagine" : model === "seedream" ? "seedream-generate" : "nano-banana-generate",
        prompt: prompt || "generate based on reference images",
        aspect,
        noWait: true,
      };

      if (images.length > 0) payload.images = images;

      const res = await apiGenerate(payload);

      if (res.success && res.images?.[0]) {
        setStatus("✅ 完成");
        setNodeData(id, { status: "completed", resultUrl: res.images[0].url });
      } else if (res.success && res.taskId) {
        setStatus("⏳ 任务已提交: " + res.taskId);
        setNodeData(id, { status: "submitted", taskId: res.taskId, model });
      } else {
        setStatus("❌ " + (res.error || "生成失败"));
        setNodeData(id, { status: "error" });
      }
    } catch (err: any) {
      setStatus("❌ " + err.message);
      setNodeData(id, { status: "error" });
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
        <option value="seedream">Seedream ¥1.50</option>
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
    </div>
  );
}
