import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

type MistralMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type GemmaGenerateResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

type ApiHandlerModule = {
  default: (request: Request) => Response | Promise<Response>;
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

const localApiRoutes = [
  {
    path: "/api/projects",
    modulePath: "/api/projects/index.ts",
  },
  {
    path: "/api/documents/index-document",
    modulePath: "/api/documents/index-document.ts",
  },
  {
    path: "/api/documents/rag-context",
    modulePath: "/api/documents/rag-context.ts",
  },
  {
    path: "/api/documents",
    modulePath: "/api/documents/index.ts",
  },
  {
    path: "/api/social",
    modulePath: "/api/social/index.ts",
  },
] satisfies Array<{
  path: string;
  modulePath: string;
}>;

function mistralProxyPlugin(): Plugin {
  return {
    name: "mistral-proxy",
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), "");
      hydrateProcessEnv(env);
      attachMistralMiddleware(server.middlewares, env);
      attachGemmaMiddleware(server.middlewares, env);
      attachLocalApiMiddleware(
        server.middlewares,
        async (modulePath) => (await server.ssrLoadModule(modulePath)) as ApiHandlerModule,
      );
    },
    configurePreviewServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), "");
      hydrateProcessEnv(env);
      attachMistralMiddleware(server.middlewares, env);
      attachGemmaMiddleware(server.middlewares, env);
    },
  };
}

function attachGemmaMiddleware(
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
  middlewares.use("/api/gemma", async (req, res) => {
    if (req.method !== "POST") {
      res.statusCode = 405;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }

    const apiKey = env.GOOGLE_API_KEY;
    const model = env.GEMMA_MODEL || env.VITE_GEMMA_MODEL || "gemma-4-26b-a4b-it";
    const baseUrl = env.GOOGLE_GENERATIVE_API_BASE_URL || "https://generativelanguage.googleapis.com/v1beta";

    if (!apiKey) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error:
            "La variable GOOGLE_API_KEY est absente. Ajoutez-la dans .env.local avant d'utiliser Gemma.",
        }),
      );
      return;
    }

    try {
      const body = await readBody(req);
      const payload = JSON.parse(body) as { messages?: MistralMessage[] };
      const messages = payload.messages ?? [];
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
      const upstream = await fetchGemmaWithRetry(
        `${baseUrl}/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            ...(systemInstruction
              ? { systemInstruction: { parts: [{ text: systemInstruction }] } }
              : {}),
            contents,
          }),
        },
      );
      const result = (await upstream.json()) as GemmaGenerateResponse;
      const content = result.candidates?.[0]?.content?.parts
        ?.map((part) => part.text?.trim() || "")
        .filter(Boolean)
        .join("\n")
        .trim();

      res.statusCode = upstream.status;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify(
          upstream.ok && content
            ? { choices: [{ message: { role: "assistant", content } }], model }
            : { error: result.error?.message || "Gemma n'a pas retourné de réponse exploitable." },
        ),
      );
    } catch (error) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error:
            error instanceof Error
              ? error.message
              : "Erreur interne pendant l'appel à l'API Gemma.",
        }),
      );
    }
  });
}

function hydrateProcessEnv(env: Record<string, string>) {
  for (const [key, value] of Object.entries(env)) {
    process.env[key] = value;
  }
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

function attachLocalApiMiddleware(
  middlewares: {
    use: (
      path: string,
      handler: (
        req: import("node:http").IncomingMessage,
        res: import("node:http").ServerResponse,
      ) => void | Promise<void>,
    ) => void;
  },
  loadModule: (modulePath: string) => Promise<ApiHandlerModule>,
) {
  for (const route of localApiRoutes) {
    middlewares.use(route.path, async (req, res) => {
      try {
        const request = await toWebRequest(req);
        const module = await loadModule(route.modulePath);
        const response = await module.default(request);
        await writeWebResponse(res, response);
      } catch (error) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            error:
              error instanceof Error
                ? error.message
                : "Erreur interne pendant l'execution de l'API locale.",
          }),
        );
      }
    });
  }
}

async function readBody(req: import("node:http").IncomingMessage) {
  const chunks: Uint8Array[] = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
}

async function toWebRequest(req: import("node:http").IncomingMessage) {
  const origin = `http://${req.headers.host || "127.0.0.1:3000"}`;
  const url = new URL(req.url || "/", origin);
  const body = req.method && ["GET", "HEAD"].includes(req.method) ? undefined : await readBody(req);
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(key, item);
      }
      continue;
    }

    if (typeof value === "string") {
      headers.set(key, value);
    }
  }

  return new Request(url, {
    method: req.method,
    headers,
    body,
  });
}

async function writeWebResponse(
  res: import("node:http").ServerResponse,
  response: Response,
) {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  res.end(buffer);
}

export default defineConfig({
  plugins: [react(), mistralProxyPlugin()],
});
