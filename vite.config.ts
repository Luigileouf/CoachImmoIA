import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

type MistralMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

function mistralProxyPlugin(): Plugin {
  return {
    name: "mistral-proxy",
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), "");
      attachMistralMiddleware(server.middlewares, env);
    },
    configurePreviewServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), "");
      attachMistralMiddleware(server.middlewares, env);
    },
  };
}

function attachMistralMiddleware(
  middlewares: {
    use: (
      path: string,
      handler: (
        req: import("node:http").IncomingMessage,
        res: import("node:http").ServerResponse,
      ) => void | Promise<void>,
    ) => void;
  },
  env: Record<string, string>,
) {
  middlewares.use("/api/mistral", async (req, res) => {
    if (req.method !== "POST") {
      res.statusCode = 405;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }

    const apiKey = env.MISTRAL_API_KEY;
    const model = env.MISTRAL_MODEL || env.VITE_MISTRAL_MODEL || "mistral-small-latest";
    const baseUrl = env.MISTRAL_API_BASE_URL || "https://api.mistral.ai";

    if (!apiKey) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error:
            "La variable MISTRAL_API_KEY est absente. Ajoutez-la dans .env.local avant d'utiliser l'assistant.",
        }),
      );
      return;
    }

    try {
      const body = await readBody(req);
      const payload = JSON.parse(body) as { messages?: MistralMessage[] };

      const upstream = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: payload.messages ?? [],
        }),
      });

      const text = await upstream.text();

      res.statusCode = upstream.status;
      res.setHeader("Content-Type", "application/json");
      res.end(text);
    } catch (error) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error:
            error instanceof Error
              ? error.message
              : "Erreur interne pendant l'appel a l'API Mistral.",
        }),
      );
    }
  });
}

async function readBody(req: import("node:http").IncomingMessage) {
  const chunks: Uint8Array[] = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
}

export default defineConfig({
  plugins: [react(), mistralProxyPlugin()],
});
