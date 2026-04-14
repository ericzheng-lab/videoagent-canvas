import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { CanvasToolbar } from "@/components/Toolbar";
import { addEdge, applyNodeChanges, applyEdgeChanges, useReactFlow } from "@xyflow/react";

const ReactFlow = dynamic(() => import("@xyflow/react").then((m) => m.ReactFlow), { ssr: false });
const Controls = dynamic(() => import("@xyflow/react").then((m) => m.Controls), { ssr: false });
const Background = dynamic(() => import("@xyflow/react").then((m) => m.Background), { ssr: false });

import "@xyflow/react/dist/style.css";
import { nodeTypes } from "@/components/nodes";
import { useCanvasStore } from "@/lib/store";

let nextNodeId = 5;

export default function CanvasPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const setNodesRef = useRef(setNodes);
  setNodesRef.current = setNodes;

  useEffect(() => {
    const initNodes = [
      { id: `node_1`, type: "imageInput", position: { x: 100, y: 100 }, data: { label: "📷 参考图" } },
      { id: `node_2`, type: "prompt", position: { x: 100, y: 350 }, data: { label: "✏️ 提示词" } },
      { id: `node_3`, type: "generate", position: { x: 450, y: 200 }, data: { label: "🎨 生成" } },
      { id: `node_4`, type: "output", position: { x: 800, y: 200 }, data: { label: "🖼️ 输出" } },
    ];
    setNodesRef.current(initNodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addNodeRef = useRef<(type: string) => void>(() => {});

  const addNode = useCallback((type: string) => {
    const id = `node_${nextNodeId++}`;
    const newNode = {
      id,
      type,
      position: { x: 100 + Math.random() * 50, y: 100 + Math.random() * 50 },
      data: { label: type === "imageInput" ? "📷 参考图" : type === "prompt" ? "✏️ 提示词" : type === "generate" ? "🎨 生成" : "🖼️ 输出" },
    };
    setNodes((nds) => [...nds, newNode]);
  }, []);

  addNodeRef.current = addNode;

  useEffect(() => {
    useCanvasStore.setState({ addNode: (type: string) => addNodeRef.current(type) });
  }, []);

  const onNodesChange = useCallback(
    (changes: any[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: any[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div className="w-full h-screen flex flex-col" style={{ height: "100dvh" }}>
      <CanvasToolbar />
      <div className="flex-1" style={{ minHeight: 0 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onInit={(instance: any) => instance.fitView({ duration: 0 })}
          className="bg-[#0f0f1a]"
        >
          <Controls />
          <Background color="#2a2a3e" gap={20} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
