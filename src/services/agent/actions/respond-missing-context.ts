import { buildMissingContextResponse } from "../responders/dossier-response";
import type { AgentActionHandler } from "../types";

export const respondMissingContextAction: AgentActionHandler = () => {
  return {
    updates: {
      response: buildMissingContextResponse(),
      modelUsed: "local-agent",
    },
    stop: true,
  };
};
