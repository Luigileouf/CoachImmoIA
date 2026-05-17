import { buildGroundedCoproAnswer } from "../../assistant/grounding";
import type { AgentActionHandler } from "../types";

export const buildGroundedCoproAnswerAction: AgentActionHandler = ({ memory }) => {
  const groundedAnswer = buildGroundedCoproAnswer(memory.query, memory.sources);

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
