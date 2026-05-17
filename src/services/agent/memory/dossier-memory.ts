import { classifyDossierQuestion } from "../core/agent-language";
import type { DossierAgentMemory, DossierAgentRequest } from "../types";

export function createDossierMemory(request: DossierAgentRequest): DossierAgentMemory {
  return {
    mode: request.mode,
    query: request.query,
    messages: request.messages,
    contextLabels: request.contextLabels,
    questionKind: classifyDossierQuestion(request.query),
    sources: [],
    response: null,
    modelUsed: null,
    groundedAttempted: false,
    steps: [],
  };
}
