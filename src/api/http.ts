import { z, type ZodType } from "zod";

export class ApiError extends Error {
  status: number;
  payload?: unknown;
  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

type RequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

export async function apiRequest<T>(
  path: string,
  schema: ZodType<T>,
  opts: RequestOptions = {}
): Promise<T> {
  const res = await fetch(path, {
    method: opts.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers ?? {})
    },
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
    signal: opts.signal
  });

  const contentType = res.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const msg =
      typeof payload === "string"
        ? payload
        : (payload as any)?.message ?? "Request failed";
    throw new ApiError(msg, res.status, payload);
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiError("Invalid API response shape", 500, {
      issues: parsed.error.issues
    });
  }
  return parsed.data;
}

export const zVoid = z.object({}).passthrough();

