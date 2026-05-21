import { forwardMistralChat, getMistralRuntimeConfig } from "./_lib/mistral.js";
import type { MistralRequestBody } from "./_lib/mistral-types.js";

export const config = {
  runtime: "nodejs",
};

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const runtime = getMistralRuntimeConfig();

  if (!runtime.apiKey) {
    return Response.json(
      {
        error:
          "La variable MISTRAL_API_KEY est absente. Ajoutez-la dans les variables d'environnement du projet.",
      },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as MistralRequestBody;
    const { upstream, text } = await forwardMistralChat(body, runtime);

    return new Response(text, {
      status: upstream.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur interne pendant l'appel a l'API Mistral.",
      },
      { status: 500 },
    );
  }
}
