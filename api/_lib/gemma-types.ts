export type GemmaMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type GemmaRequestBody = {
  messages?: GemmaMessage[];
};

export type GemmaGenerateResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
};
