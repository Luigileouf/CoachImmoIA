import { buildGroundedCompromiseAnswer } from "../../assistant/grounding";
import type { AgentActionHandler } from "../types";

export const buildGroundedCompromiseAnswerAction: AgentActionHandler = ({ memory }) => {
  const groundedAnswer = buildGroundedCompromiseAnswer(memory.query, memory.sources);

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
