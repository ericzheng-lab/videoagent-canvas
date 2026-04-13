"use client";

import { useCallback, useEffect, useState } from "react";
import { ReactFlow, Controls, Background, addEdge, useNodesState, useEdgesState } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CanvasToolbar } from "@/components/Toolbar";
import { nodeTypes } from "@/components/nodes";
import { useCanvasStore } from "@/lib/store";
import { apiGenerate, apiStatus } from "@/lib/api";

export default function CanvasPage() {
  const { addInitialNodes } = useCanvasStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [showToolbar, setShowToolbar] = useState(true);

  useEffect(() => {
    addInitialNodes(setNodes);
  }, [addInitialNodes, setNodes]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds: any) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-screen flex flex-col" style={{ height: '100dvh' }}>
      {showToolbar && <CanvasToolbar />}
      <div className="flex-1" style={{ minHeight: 0 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={(changes) => setEdges((eds) => {
            let newEdges = [...eds];
            changes.forEach((c: any) => {
              if (c.type === 'remove') newEdges = newEdges.filter(e => e.id !== c.id);
            });
            return newEdges;
          })}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[#0f0f1a]"
        >
          <Controls />
          <Background color="#2a2a3e" gap={20} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
