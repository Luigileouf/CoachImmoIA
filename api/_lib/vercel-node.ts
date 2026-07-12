import type { IncomingMessage, ServerResponse } from "node:http";

export type VercelNodeRequest = IncomingMessage & {
  body?: unknown;
};

export type VercelNodeResponse = ServerResponse;

type WebHandler = (request: Request) => Response | Promise<Response>;

async function toWebRequest(request: VercelNodeRequest) {
  const forwardedProtocol = request.headers["x-forwarded-proto"];
  const forwardedHost = request.headers["x-forwarded-host"];
  const protocol = Array.isArray(forwardedProtocol) ? forwardedProtocol[0] : forwardedProtocol || "https";
  const host = Array.isArray(forwardedHost)
    ? forwardedHost[0]
    : forwardedHost || request.headers.host || "localhost";
  const url = new URL(request.url || "/", `${protocol}://${host}`);
  const method = request.method || "GET";
  const headers = new Headers();

  for (const [key, value] of Object.entries(request.headers)) {
    if (Array.isArray(value)) {
      value.forEach((item) => headers.append(key, item));
    } else if (value !== undefined) {
      headers.set(key, value);
    }
  }

  let body: BodyInit | undefined;
  if (method !== "GET" && method !== "HEAD") {
    if (request.body !== undefined) {
      body = typeof request.body === "string" || Buffer.isBuffer(request.body)
        ? request.body
        : JSON.stringify(request.body);
    } else {
      const chunks: Buffer[] = [];
      for await (const chunk of request) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      body = Buffer.concat(chunks);
    }
  }

  return new Request(url, { method, headers, body });
}

export function adaptWebHandler(handler: WebHandler) {
  return async (
    request: Request | VercelNodeRequest,
    response?: VercelNodeResponse,
  ) => {
    if (request instanceof Request) {
      return handler(request);
    }

    if (!response) {
      throw new Error("La réponse Node Vercel est absente.");
    }

    const webResponse = await handler(await toWebRequest(request));
    response.statusCode = webResponse.status;
    webResponse.headers.forEach((value, key) => response.setHeader(key, value));
    response.end(Buffer.from(await webResponse.arrayBuffer()));
  };
}

export async function readJsonBody<T>(request: VercelNodeRequest): Promise<T> {
  if (request.body !== undefined) {
    if (typeof request.body === "string") {
      return JSON.parse(request.body) as T;
    }

    if (Buffer.isBuffer(request.body)) {
      return JSON.parse(request.body.toString("utf8")) as T;
    }

    return request.body as T;
  }

  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as T;
}

export function sendJson(
  response: VercelNodeResponse,
  data: unknown,
  status = 200,
) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(data));
}
