import { create } from "zustand";

let nodeIdCounter = 1;
const nextId = () => `node_${nodeIdCounter++}`;

export interface NodeData {
  label: string;
  images?: string[];
  prompt?: string;
  model?: string;
  aspect?: string;
  resultUrl?: string;
  status?: string;
  taskId?: string;
}

interface CanvasStore {
  nodeData: Record<string, NodeData>;
  addNode: (type: string) => void;
  setNodeData: (id: string, data: Partial<NodeData>) => void;
  getNodeData: (id: string) => NodeData;
  getInputData: (edges: any[], nodeId: string) => { images: string[]; prompt: string };
  addInitialNodes: (setNodes: any) => void;
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  nodeData: {},

  addNode: (type) => {
    // This is handled by the page component
  },

  setNodeData: (id, data) =>
    set((state) => ({
      nodeData: {
        ...state.nodeData,
        [id]: { ...state.nodeData[id], ...data },
      },
    })),

  getNodeData: (id) => get().nodeData[id] || {},

  getInputData: (edges, nodeId) => {
    const { nodeData } = get();
    const images: string[] = [];
    let prompt = "";

    edges.forEach((edge) => {
      if (edge.target !== nodeId) return;
      const sourceId = edge.source;
      const sourceNode = nodeData[sourceId];
      if (!sourceNode) return;

      if (sourceNode.images) images.push(...sourceNode.images);
      if (sourceNode.prompt) prompt += sourceNode.prompt;
      if (sourceNode.resultUrl) images.push(sourceNode.resultUrl);
    });

    return { images, prompt };
  },

  addInitialNodes: (setNodes) => {
    const initialNodes = [
      { id: nextId(), type: "imageInput", position: { x: 100, y: 100 }, data: { label: "📷 参考图" } },
      { id: nextId(), type: "prompt", position: { x: 100, y: 350 }, data: { label: "✏️ 提示词" } },
      { id: nextId(), type: "generate", position: { x: 450, y: 200 }, data: { label: "🎨 生成" } },
      { id: nextId(), type: "output", position: { x: 800, y: 200 }, data: { label: "🖼️ 输出" } },
    ];
    setNodes(initialNodes);
  },
}));
