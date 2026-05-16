import type { ApiEnvelope } from "./types";

export async function fetchApi<T>(path: string) {
  const response = await fetch(path, {
    headers: {
      Accept: "application/json",
    },
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
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || `Erreur API (${response.status})`);
  }

  return (await response.json()) as ApiEnvelope<TResponse>;
}
