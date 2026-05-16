import type { ProjectMode } from "../../types/product";
import { fetchApi, postApi } from "./client";
import type {
  CreateDocumentPayload,
  DocumentsResponse,
  IndexDocumentPayload,
  RagContextPayload,
  RagContextResponse,
} from "./types";

export function fetchDocuments(mode: ProjectMode) {
  return fetchApi<DocumentsResponse>(`/api/documents?mode=${mode}`);
}

export function createDocument(payload: CreateDocumentPayload) {
  return postApi<DocumentsResponse, CreateDocumentPayload>("/api/documents", payload);
}

export function indexDocument(payload: IndexDocumentPayload) {
  return postApi<DocumentsResponse, IndexDocumentPayload>("/api/documents/index-document", payload);
}

export function fetchRagContext(payload: RagContextPayload) {
  return postApi<RagContextResponse, RagContextPayload>("/api/documents/rag-context", payload);
}
