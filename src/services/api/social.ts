import type { ProjectMode } from "../../types/product";
import { fetchApi, postApi } from "./client";
import type { CreateSocialThreadPayload, SocialResponse } from "./types";

export function fetchSocial(mode: ProjectMode) {
  return fetchApi<SocialResponse>(`/api/social?mode=${mode}`);
}

export function createSocialThread(payload: CreateSocialThreadPayload) {
  return postApi<SocialResponse, CreateSocialThreadPayload>("/api/social", payload);
}
