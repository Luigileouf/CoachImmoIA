import type { ApiEnvelope } from "./types";
import { getSupabaseBrowserClient } from "../supabase/browser";

async function getApiHeaders(includeContentType = false) {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const { data } = await getSupabaseBrowserClient().auth.getSession();
    if (data.session?.access_token) {
      headers.Authorization = `Bearer ${data.session.access_token}`;
    }
  } catch {
    // Public demo requests remain available when Supabase is not configured.
  }

  return headers;
}

export async function fetchApi<T>(path: string) {
  const response = await fetch(path, {
    headers: await getApiHeaders(),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error || `Erreur API (${response.status})`);
  }

  return (await response.json()) as ApiEnvelope<T>;
}

export async function postApi<TResponse, TPayload>(path: string, payload: TPayload) {
  const response = await fetch(path, {
    method: "POST",
    headers: await getApiHeaders(true),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || `Erreur API (${response.status})`);
  }

  return (await response.json()) as ApiEnvelope<TResponse>;
}
