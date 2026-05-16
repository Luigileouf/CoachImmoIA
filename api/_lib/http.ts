export function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init);
}

export function methodNotAllowed(allowed: string[]) {
  return json(
    {
      error: "Method not allowed",
      allowed,
    },
    { status: 405 },
  );
}
