import { forwardGemmaChat, getGemmaRuntimeConfig } from "./_lib/gemma.js";
import type { GemmaRequestBody } from "./_lib/gemma-types.js";
import {
  readJsonBody,
  sendJson,
  type VercelNodeRequest,
  type VercelNodeResponse,
} from "./_lib/vercel-node.js";

export const config = {
  runtime: "nodejs",
};

export default async function handler(
  request: VercelNodeRequest,
  response: VercelNodeResponse,
) {
  if (request.method !== "POST") {
    sendJson(response, { error: "Method not allowed" }, 405);
    return;
  }

  const runtime = getGemmaRuntimeConfig();

  if (!runtime.apiKey) {
    sendJson(response, {
      error:
        "La variable GOOGLE_API_KEY est absente. Ajoutez-la dans les variables d'environnement du projet.",
    }, 500);
    return;
  }

  try {
    const body = await readJsonBody<GemmaRequestBody>(request);
    const result = await forwardGemmaChat(body, runtime);

    if (result.status < 200 || result.status >= 300 || !result.content) {
      sendJson(response, {
        error: result.error || "Gemma n'a pas retourné de réponse exploitable.",
      }, result.status || 502);
      return;
    }

    // Keep the browser contract provider-neutral while Mistral remains available as a fallback.
    sendJson(response, {
      choices: [
        {
          message: {
            role: "assistant",
            content: result.content,
          },
        },
      ],
      model: runtime.model,
    });
  } catch (error) {
    sendJson(response, {
      error:
        error instanceof Error
          ? error.message
          : "Erreur interne pendant l'appel à l'API Gemma.",
    }, 500);
  }
}
