"use client";

import { Handle, Position } from "@xyflow/react";
import { useState } from "react";
import { useCanvasStore } from "@/lib/store";
import { Upload, Link } from "lucide-react";

export function ImageInputNode({ id }: { id: string }) {
  const [images, setImages] = useState<string[]>([]);
  const setNodeData = useCanvasStore((s) => s.setNodeData);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || images.length >= 4) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newImages = [...images, ev.target?.result as string];
      setImages(newImages);
      setNodeData(id, { images: newImages });
    };
    reader.readAsDataURL(file);
  };

  const addUrl = () => {
    const url = prompt("输入图片 URL：");
    if (url && images.length < 4) {
      const newImages = [...images, url];
      setImages(newImages);
      setNodeData(id, { images: newImages });
    }
  };

  const removeImage = (i: number) => {
    const newImages = images.filter((_, idx) => idx !== i);
    setImages(newImages);
    setNodeData(id, { images: newImages });
  };

  return (
    <div className="p-3 min-w-[200px]">
      <Handle type="source" position={Position.Right} />
      <div className="text-sm font-semibold mb-2">📷 参考图 ({images.length}/4)</div>
      <div className="flex gap-1 mb-2">
        <button onClick={() => document.getElementById(`file-${id}`)?.click()} className="p-1.5 rounded bg-[#2a2a3e] hover:bg-[#3a3a4e]">
          <Upload className="w-3 h-3" />
        </button>
        <input id={`file-${id}`} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <button onClick={addUrl} className="p-1.5 rounded bg-[#2a2a3e] hover:bg-[#3a3a4e]">
          <Link className="w-3 h-3" />
        </button>
      </div>
      {images.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {images.map((img, i) => (
            <div key={i} className="relative w-12 h-12 rounded overflow-hidden">
              <img src={img} className="w-full h-full object-cover" />
              <button onClick={() => removeImage(i)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
