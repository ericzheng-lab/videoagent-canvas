"use client";

import { Handle, Position } from "@xyflow/react";
import { useEffect, useState } from "react";
import { useCanvasStore } from "@/lib/store";
import { Download } from "lucide-react";

export function OutputNode({ id }: { id: string }) {
  const [imageUrl, setImageUrl] = useState("");
  const nodeData = useCanvasStore((s) => s.getNodeData(id));

  useEffect(() => {
    if (nodeData.resultUrl && nodeData.resultUrl !== imageUrl) {
      setImageUrl(nodeData.resultUrl);
    }
  }, [nodeData.resultUrl]);

  return (
    <div className="p-3 min-w-[240px]">
      <Handle type="target" position={Position.Left} />
      <div className="text-sm font-semibold mb-2">🖼️ 输出</div>
      {imageUrl ? (
        <div>
          <img src={imageUrl} className="w-full rounded-lg border border-[#2a2a3e] mb-2" />
          <a href={imageUrl} download className="flex items-center gap-1 px-2 py-1 bg-[#2a2a3e] rounded text-xs hover:bg-[#3a3a4e] w-fit">
            <Download className="w-3 h-3" /> 下载
          </a>
        </div>
      ) : (
        <div className="flex items-center justify-center h-32 border-2 border-dashed border-[#2a2a3e] rounded-lg">
          <div className="text-center text-gray-500">
            <span className="text-xs">等待输入</span>
          </div>
        </div>
      )}
    </div>
  );
}
