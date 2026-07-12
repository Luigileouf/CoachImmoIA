import type { ProjectMode } from "../../types/product";

export type AssistantRole = "system" | "user" | "assistant";

export type AssistantMessage = {
  role: AssistantRole;
  content: string;
};

export type AssistantRequest = {
  mode: ProjectMode;
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
