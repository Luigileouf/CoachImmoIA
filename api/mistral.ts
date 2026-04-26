type MistralMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type MistralRequestBody = {
  messages?: MistralMessage[];
};

export const config = {
  runtime: "nodejs",
};

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  const model = process.env.MISTRAL_MODEL || "mistral-small-latest";
  const baseUrl = process.env.MISTRAL_API_BASE_URL || "https://api.mistral.ai";

  if (!apiKey) {
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

    const upstream = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: body.messages ?? [],
      }),
    });

    const text = await upstream.text();

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
