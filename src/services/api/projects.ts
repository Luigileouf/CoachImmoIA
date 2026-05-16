import type { ProjectMode } from "../../types/product";
import { fetchApi, postApi } from "./client";
import type { CreateProjectPayload, ProjectsResponse } from "./types";

export function fetchProjects(mode: ProjectMode) {
  return fetchApi<ProjectsResponse>(`/api/projects?mode=${mode}`);
}

export function createProject(payload: CreateProjectPayload) {
  return postApi<ProjectsResponse, CreateProjectPayload>("/api/projects", payload);
}
