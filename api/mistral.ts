import { forwardMistralChat, getMistralRuntimeConfig } from "./_lib/mistral.js";
import type { MistralRequestBody } from "./_lib/mistral-types.js";
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

  const runtime = getMistralRuntimeConfig();

  if (!runtime.apiKey) {
    sendJson(response, {
      error:
        "La variable MISTRAL_API_KEY est absente. Ajoutez-la dans les variables d'environnement du projet.",
    }, 500);
    return;
  }

  try {
    const body = await readJsonBody<MistralRequestBody>(request);
    const { upstream, text } = await forwardMistralChat(body, runtime);

    response.statusCode = upstream.status;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(text);
  } catch (error) {
    sendJson(response, {
      error:
        error instanceof Error
          ? error.message
          : "Erreur interne pendant l'appel a l'API Mistral.",
    }, 500);
  }
}
