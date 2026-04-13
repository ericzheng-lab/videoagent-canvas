import { ImageInputNode } from "./ImageInputNode";
import { PromptNode } from "./PromptNode";
import { GenerateNode } from "./GenerateNode";
import { OutputNode } from "./OutputNode";

export const nodeTypes = {
  imageInput: ImageInputNode,
  prompt: PromptNode,
  generate: GenerateNode,
  output: OutputNode,
};
