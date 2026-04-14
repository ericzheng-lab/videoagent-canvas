"use client";

import { Handle, Position, useReactFlow } from "@xyflow/react";
import { useEffect, useState } from "react";
import { useCanvasStore } from "@/lib/store";
import { apiGenerate, apiStatus } from "@/lib/api";

export function GenerateNode({ id }: { id: string }) {
  const [model, setModel] = useState("nano-banana-pro-4k");
  const [aspect, setAspect] = useState("1:1");
  const [status, setStatus] = useState("");
  const setNodeData = useCanvasStore((s) => s.setNodeData);
  const taskInfo = useCanvasStore((s) => {
    const d = s.nodeData[id];
    return { status: d?.status || "", taskId: d?.taskId || "" };
  });
  const { getEdges } = useReactFlow();

  useEffect(() => {
    if (taskInfo.status !== "submitted" || !taskInfo.taskId) return;

    let cancelled = false;
    const poll = async () => {
      while (!cancelled) {
        try {
          const res = await apiStatus(taskInfo.taskId, model, "mj");
          if (cancelled) break;

          if (res.status === "completed" || res.status === "SUCCESS" || res.status === "success") {
            const url = res.images?.[0]?.url || res.imageUrl || res.url;
            if (url) {
              setStatus("✅ 完成");
              setNodeData(id, { status: "completed", resultUrl: url });
            } else {
              setStatus("❌ 无结果图片");
              setNodeData(id, { status: "error" });
            }
            break;
          }
          if (res.status === "failed" || res.status === "failure" || res.status === "error") {
            setStatus("❌ " + (res.error || "生成失败"));
            setNodeData(id, { status: "error" });
            break;
          }

          setStatus("⏳ 任务进行中: " + taskInfo.taskId);
          await new Promise((r) => setTimeout(r, 8000));
        } catch (err: any) {
          if (!cancelled) {
            setStatus("❌ " + err.message);
            setNodeData(id, { status: "error" });
          }
          break;
        }
      }
    };

    poll();
    return () => { cancelled = true; };
  }, [taskInfo.status, taskInfo.taskId, id, model, setNodeData]);

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
      const mode = model === "midjourney" ? "mj-imagine" : "text-to-image";
      const payload: any = {
        mode,
        model,
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
        <option value="gpt-image-1.5">GPT-Image 1.5 ¥2.00</option>
        <option value="midjourney">Midjourney ¥1.00</option>
        <option value="seedream">Seedream 3 ¥1.50</option>
        <option value="seedream-5">Seedream 5 ¥1.50</option>
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
