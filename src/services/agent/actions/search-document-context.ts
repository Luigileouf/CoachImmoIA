import type { AgentActionHandler } from "../types";

export const searchDocumentContextAction: AgentActionHandler = async ({
  memory,
  environment,
}) => {
  const rag = await environment.searchDocumentContext({
    mode: memory.mode,
    query: memory.query,
    labels: memory.contextLabels,
  });

  return {
    updates: {
      sources: rag.sources,
    },
  };
};
