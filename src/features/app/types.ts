import type { AssistantMessage } from "../../services/assistant";
import type { ActionCard, ProjectMode, Scenario } from "../../types/product";

export type ScenarioData = Scenario;
export type AssistantThread = Record<ProjectMode, AssistantMessage[]>;

export type HomeVariant = "default" | "empty";
export type ListingsVariant = "default" | "empty";
export type AssistantVariant = "default" | "empty" | "loading";
export type ProjectsVariant = "default" | "empty" | "risk" | "sent";
export type DocumentFilter = "all" | "action" | "rag";

export type ScreenVariantState = {
  home: HomeVariant;
  listings: ListingsVariant;
  assistant: AssistantVariant;
  projects: ProjectsVariant;
};

export type DocumentStatus = {
  label: string;
  status: string;
  tone: "mint" | "dark";
};

export type DocumentWorkspaceItem = DocumentStatus & {
  source: string;
  owner: string;
  ragStatus: "indexed" | "ready" | "missing";
  chunkCount: number;
  lastUpdated: string;
  summary: string;
  nextAction: string;
  notes: string[];
};

export type ListingWorkspaceMeta = {
  score: string;
  tempo: string;
  coachSignal: string;
  nextAction: string;
  strengths: string[];
  risks: string[];
  prepDocs: string[];
};

export type ProjectStepMeta = {
  owner: string;
  deadline: string;
  checkpoint: string;
  blocker: string;
};

export type MobileShellState = {
  activeAction: ActionCard["id"];
  variants: ScreenVariantState;
};

export const defaultScreenVariants: ScreenVariantState = {
  home: "default",
  listings: "default",
  assistant: "default",
  projects: "default",
};
