import type { ProjectMode } from "../../types/product";
import type { AssistantProvider } from "./runtime";

export type AssistantRole = "system" | "user" | "assistant";

export type AssistantMessage = {
  role: AssistantRole;
  content: string;
  provider?: AssistantProvider;
  model?: string;
  sourcePrompt?: string;
};

export type AssistantRequest = {
  mode: ProjectMode;
  provider: AssistantProvider;
  messages: AssistantMessage[];
  contextSnippets?: string[];
};

export type MistralContent =
  | string
  | Array<{
      type?: string;
      text?: string;
    }>;

export type MistralChatResponse = {
  choices?: Array<{
    message?: {
      role?: string;
      content?: MistralContent;
    };
  }>;
  error?: unknown;
};
