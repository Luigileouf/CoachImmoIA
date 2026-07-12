import type { IncomingMessage, ServerResponse } from "node:http";

export type VercelNodeRequest = IncomingMessage & {
  body?: unknown;
};

export type VercelNodeResponse = ServerResponse;

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
