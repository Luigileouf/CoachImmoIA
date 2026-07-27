import { forwardMistralChat, getMistralRuntimeConfig } from "./_lib/mistral.js";
import type { MistralRequestBody } from "./_lib/mistral-types.js";
import { validateAssistantOutput } from "./_lib/assistant-output.js";
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
    const { upstream, payload } = await forwardMistralChat(body, runtime);

    if (!upstream.ok) {
      sendJson(response, payload, upstream.status);
      return;
    }

    const choice = payload.choices?.[0];
    const validatedOutput = validateAssistantOutput(
      choice?.message?.content,
      choice?.finish_reason,
    );

    if (!validatedOutput.content) {
      sendJson(response, { error: validatedOutput.error }, 502);
      return;
    }

    sendJson(response, {
      choices: [
        {
          message: {
            role: "assistant",
            content: validatedOutput.content,
          },
        },
      ],
      model: runtime.model,
      incomplete: validatedOutput.incomplete,
    });
  } catch (error) {
    sendJson(response, {
      error:
        error instanceof Error
          ? error.message
          : "Erreur interne pendant l’appel à l’API Mistral.",
    }, 500);
  }
}
