export type MistralMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type MistralRequestBody = {
  messages?: MistralMessage[];
};
