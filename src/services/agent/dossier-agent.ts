import { fetchRagContext } from "../api";
import { sendAssistantMessage } from "../assistant";
import { AgentActionRegistry } from "./core/action-registry";
import { runGameAgent } from "./core/agent-loop";
import { buildGroundedCompromiseAnswerAction } from "./actions/build-grounded-compromise-answer";
import { buildGroundedCoproAnswerAction } from "./actions/build-grounded-copro-answer";
import { buildGroundedDiagnosticsAnswerAction } from "./actions/build-grounded-diagnostics-answer";
import { searchDocumentContextAction } from "./actions/search-document-context";
import { respondMissingContextAction } from "./actions/respond-missing-context";
import { buildGroundedFinancialAnswerAction } from "./actions/build-grounded-financial-answer";
import { buildGroundedSellerDocumentsAnswerAction } from "./actions/build-grounded-seller-documents-answer";
import { respondWithModelAction } from "./actions/respond-with-model";
import { dossierGoal } from "./goals/dossier-goals";
import { createDossierMemory } from "./memory/dossier-memory";
import type {
  AgentGoalDefinition,
  DossierAgentEnvironment,
  DossierAgentRequest,
  DossierAgentResult,
} from "./types";

export function createAgentEnvironment(): DossierAgentEnvironment {
  return {
    async searchDocumentContext(payload) {
      const response = await fetchRagContext(payload);
      return response.data;
    },
    sendModelReply: sendAssistantMessage,
  };
}

export function createAgentActionRegistry() {
  return new AgentActionRegistry()
    .register("search_document_context", searchDocumentContextAction)
    .register("respond_missing_context", respondMissingContextAction)
    .register("build_grounded_financial_answer", buildGroundedFinancialAnswerAction)
    .register("build_grounded_copro_answer", buildGroundedCoproAnswerAction)
    .register("build_grounded_diagnostics_answer", buildGroundedDiagnosticsAnswerAction)
    .register("build_grounded_compromise_answer", buildGroundedCompromiseAnswerAction)
    .register("build_grounded_seller_documents_answer", buildGroundedSellerDocumentsAnswerAction)
    .register("respond_with_model", respondWithModelAction);
}

export async function runScopedAgent(
  goal: AgentGoalDefinition,
  request: DossierAgentRequest,
): Promise<DossierAgentResult> {
  return runGameAgent({
    goal,
    environment: createAgentEnvironment(),
    initialMemory: createDossierMemory(request),
    registry: createAgentActionRegistry(),
  });
}

export async function runDossierAgent(request: DossierAgentRequest): Promise<DossierAgentResult> {
  return runScopedAgent(dossierGoal, request);
}
