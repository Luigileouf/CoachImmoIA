import { forwardGemmaChat, getGemmaRuntimeConfig } from "./_lib/gemma.js";
import type { GemmaRequestBody } from "./_lib/gemma-types.js";

export const config = {
  runtime: "nodejs",
};

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const runtime = getGemmaRuntimeConfig();

  if (!runtime.apiKey) {
    return Response.json(
      {
        error:
          "La variable GOOGLE_API_KEY est absente. Ajoutez-la dans les variables d'environnement du projet.",
      },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as GemmaRequestBody;
    const result = await forwardGemmaChat(body, runtime);

    if (result.status < 200 || result.status >= 300 || !result.content) {
      return Response.json(
        {
          error: result.error || "Gemma n'a pas retourné de réponse exploitable.",
        },
        { status: result.status || 502 },
      );
    }

    // Keep the browser contract provider-neutral while Mistral remains available as a fallback.
    return Response.json({
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
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur interne pendant l'appel à l'API Gemma.",
      },
      { status: 500 },
    );
  }
}
