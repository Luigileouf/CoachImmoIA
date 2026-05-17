import { buildGroundedDiagnosticsAnswer } from "../../assistant/grounding";
import type { AgentActionHandler } from "../types";

export const buildGroundedDiagnosticsAnswerAction: AgentActionHandler = ({ memory }) => {
  const groundedAnswer = buildGroundedDiagnosticsAnswer(memory.query, memory.sources);

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
