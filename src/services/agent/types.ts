import type { RagContextResponse } from "../api";
import type { AssistantMessage, AssistantProvider } from "../assistant";
import type { ProjectMode } from "../../types/product";

export type AgentGoalId = "dossier" | "buyer" | "seller";

export type AgentActionName =
  | "search_document_context"
  | "respond_missing_context"
  | "build_grounded_financial_answer"
  | "build_grounded_copro_answer"
  | "build_grounded_diagnostics_answer"
  | "build_grounded_compromise_answer"
  | "build_grounded_seller_documents_answer"
  | "respond_with_model";

export type DossierQuestionKind =
  | "coaching"
  | "dossier"
  | "financing"
  | "copro"
  | "diagnostics"
  | "compromise"
  | "seller_documents";

export type AgentGoalDefinition = {
  id: AgentGoalId;
  name: string;
  objectives: string[];
  instructions: string[];
  stopConditions: string[];
};

export type DossierAgentRequest = {
  mode: ProjectMode;
  provider: AssistantProvider;
  query: string;
  messages: AssistantMessage[];
  contextLabels: string[];
};

export type DossierAgentMemory = {
  mode: ProjectMode;
  provider: AssistantProvider;
  query: string;
  messages: AssistantMessage[];
  contextLabels: string[];
  questionKind: DossierQuestionKind;
  sources: RagContextResponse["sources"];
  response: string | null;
  modelUsed: string | null;
  groundedAttempted: boolean;
  steps: AgentActionName[];
};

export type DossierAgentEnvironment = {
  searchDocumentContext: (payload: {
    mode: ProjectMode;
    query: string;
    labels?: string[];
  }) => Promise<RagContextResponse>;
  sendModelReply: (payload: {
    mode: ProjectMode;
    provider: AssistantProvider;
    messages: AssistantMessage[];
    contextSnippets?: string[];
  }) => Promise<{ content: string; model: string }>;
};

export type AgentActionContext = {
  goal: AgentGoalDefinition;
  memory: DossierAgentMemory;
  environment: DossierAgentEnvironment;
};

export type AgentActionResult = {
  updates?: Partial<DossierAgentMemory>;
  stop?: boolean;
};

export type AgentActionHandler = (
  context: AgentActionContext,
) => Promise<AgentActionResult> | AgentActionResult;

export type DossierAgentResult = {
  reply: string;
  model: string | null;
  sources: RagContextResponse["sources"];
  steps: AgentActionName[];
};
