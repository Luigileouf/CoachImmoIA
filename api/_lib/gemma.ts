import type { GemmaGenerateResponse, GemmaRequestBody } from "./gemma-types.js";

type GemmaRuntimeConfig = {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
};

const GEMMA_MAX_ATTEMPTS = 3;
const GEMMA_RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

async function fetchGemmaWithRetry(url: string, init: RequestInit) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= GEMMA_MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, init);

      if (!GEMMA_RETRYABLE_STATUSES.has(response.status) || attempt === GEMMA_MAX_ATTEMPTS) {
        return response;
      }

      await response.arrayBuffer();
    } catch (error) {
      lastError = error;
      if (attempt === GEMMA_MAX_ATTEMPTS) {
        throw error;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** (attempt - 1)));
  }

  throw lastError instanceof Error ? lastError : new Error("L'appel à l'API Gemma a échoué.");
}

export function getGemmaRuntimeConfig({
  apiKey = process.env.GOOGLE_API_KEY,
  model = process.env.GEMMA_MODEL || "gemma-4-26b-a4b-it",
  baseUrl = process.env.GOOGLE_GENERATIVE_API_BASE_URL || "https://generativelanguage.googleapis.com/v1beta",
}: GemmaRuntimeConfig = {}) {
  return {
    apiKey,
    model,
    baseUrl,
  };
}

function buildGemmaPayload(body: GemmaRequestBody) {
  const messages = body.messages ?? [];
  const systemInstruction = messages
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .join("\n\n");
  const contents = messages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

  return {
    ...(systemInstruction
      ? {
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
        }
      : {}),
    contents,
    generationConfig: {
      maxOutputTokens: 700,
    },
  };
}

export async function forwardGemmaChat(
  body: GemmaRequestBody,
  runtime = getGemmaRuntimeConfig(),
) {
  if (!runtime.apiKey) {
    throw new Error(
      "La variable GOOGLE_API_KEY est absente. Ajoutez-la dans les variables d'environnement du projet.",
    );
  }

  const upstream = await fetchGemmaWithRetry(
    `${runtime.baseUrl}/models/${encodeURIComponent(runtime.model || "gemma-4-26b-a4b-it")}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": runtime.apiKey,
      },
      body: JSON.stringify(buildGemmaPayload(body)),
    },
  );
  const payload = (await upstream.json()) as GemmaGenerateResponse;
  const content = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text?.trim() || "")
    .filter(Boolean)
    .join("\n")
    .trim();

  return {
    content,
    error: payload.error?.message,
    status: upstream.status,
  };
}
