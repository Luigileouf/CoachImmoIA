import { buildGroundedSellerDocumentsAnswer } from "../../assistant/grounding";
import type { AgentActionHandler } from "../types";

export const buildGroundedSellerDocumentsAnswerAction: AgentActionHandler = ({ memory }) => {
  const groundedAnswer = buildGroundedSellerDocumentsAnswer(memory.query, memory.sources);

  if (!groundedAnswer) {
    return {
      updates: {
        groundedAttempted: true,
      },
    };
  }

  return {
    updates: {
      response: groundedAnswer,
      modelUsed: "local-agent",
      groundedAttempted: true,
    },
    stop: true,
  };
};
