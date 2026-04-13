import { create } from "zustand";

let nodeIdCounter = 1;

const nextId = () => `node_${nodeIdCounter++}`;

export interface CanvasNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, any>;
}

interface CanvasStore {
  nodes: CanvasNode[];
  addNode: (type: string, position?: { x: number; y: number }) => void;
  addInitialNodes: (setNodes: any) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  nodes: [],

  addNode: (type, position = { x: 200, y: 200 }) =>
    set((state) => {
      const id = nextId();
      return {
        nodes: [...state.nodes, { id, type, position, data: {} }],
      };
    }),

  addInitialNodes: (setNodes) => {
    const initialNodes = [
      {
        id: nextId(),
        type: "imageInput",
        position: { x: 100, y: 100 },
        data: { label: "📷 参考图" },
      },
      {
        id: nextId(),
        type: "prompt",
        position: { x: 100, y: 350 },
        data: { label: "✏️ 提示词" },
      },
      {
        id: nextId(),
        type: "generate",
        position: { x: 450, y: 200 },
        data: { label: "🎨 生成" },
      },
      {
        id: nextId(),
        type: "output",
        position: { x: 800, y: 200 },
        data: { label: "🖼️ 输出" },
      },
    ];
    setNodes(initialNodes);
  },
}));
