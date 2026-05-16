import type {
  DocumentWorkspaceItem,
  ProjectStepMeta,
} from "../../features/app/types";
import type {
  ProjectMode,
  ProjectStep,
  Scenario,
  SocialCircle,
  SocialHighlight,
  SocialThread,
} from "../../types/product";

export type ApiEnvelope<T> = {
  ok: boolean;
  data: T;
};

export type DocumentsResponse = {
  mode: ProjectMode;
  projectId?: string | null;
  summary: {
    available: number;
    pending: number;
    ragReady: number;
  };
  items: DocumentWorkspaceItem[];
};

export type ProjectsResponse = {
  mode: ProjectMode;
  projectId?: string | null;
  projectTitle?: string;
  scenario: Pick<Scenario, "projectStatus" | "projectNote" | "checklist" | "projectDocuments">;
  steps: Array<ProjectStep & { meta: ProjectStepMeta | undefined }>;
};

export type SocialResponse = {
  mode: ProjectMode;
  highlight: SocialHighlight;
  stats: Array<{
    label: string;
    value: string;
  }>;
  circles: Array<SocialCircle & { threads: SocialThread[] }>;
};

export type CreateProjectPayload = {
  mode: ProjectMode;
  title: string;
};

export type CreateDocumentPayload = {
  mode: ProjectMode;
  projectId?: string | null;
  label: string;
  source: string;
  owner?: string;
  summary?: string;
  nextAction?: string;
  notes?: string[];
  storagePath?: string;
};

export type IndexDocumentPayload = {
  mode: ProjectMode;
  projectId?: string | null;
  label: string;
  chunks: string[];
  summary?: string;
};

export type RagContextPayload = {
  mode: ProjectMode;
  query: string;
  labels?: string[];
};

export type RagContextResponse = {
  query: string;
  sources: Array<{
    label: string;
    source: string;
    summary: string;
    excerpt: string;
  }>;
};

export type CreateSocialThreadPayload = {
  mode: ProjectMode;
  circleId: string;
  title: string;
  body: string;
  author?: string;
};
