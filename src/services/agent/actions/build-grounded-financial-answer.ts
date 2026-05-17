import { buildGroundedFinancialAnswer } from "../../assistant/grounding";
import type { AgentActionHandler } from "../types";

export const buildGroundedFinancialAnswerAction: AgentActionHandler = ({ memory }) => {
  const groundedAnswer = buildGroundedFinancialAnswer(memory.query, memory.sources);

  return {
    updates: {
      groundedAttempted: true,
      ...(groundedAnswer
        ? {
            response: groundedAnswer,
            modelUsed: "local-agent",
          }
        : {}),
    },
    stop: Boolean(groundedAnswer),
  };
};
