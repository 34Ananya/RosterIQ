import { z } from "zod";

export const ProviderFlagSchema = z.object({
  code: z.string(),
  label: z.string(),
  severity: z.enum(["low", "medium", "high"])
});

export const ProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  npi: z.string(),
  specialty: z.string(),
  address: z.string(),
  sourceFile: z.string(),
  confidence: z.number().min(0).max(1),
  flags: z.array(ProviderFlagSchema).default([])
});

export type Provider = z.infer<typeof ProviderSchema>;

export const ProviderListResponseSchema = z.object({
  items: z.array(ProviderSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().nonnegative(),
  pageSize: z.number().int().positive()
});

export type ProviderListResponse = z.infer<typeof ProviderListResponseSchema>;

export const ProviderMemoryEventSchema = z.object({
  id: z.string(),
  at: z.string(),
  sourceFile: z.string(),
  kind: z.enum(["created", "updated", "flagged", "merged"]),
  summary: z.string(),
  changes: z.array(
    z.object({
      field: z.string(),
      from: z.string().nullable(),
      to: z.string().nullable()
    })
  )
});

export type ProviderMemoryEvent = z.infer<typeof ProviderMemoryEventSchema>;

export const ProviderMemoryResponseSchema = z.object({
  provider: ProviderSchema,
  timeline: z.array(ProviderMemoryEventSchema),
  aiSummary: z.string()
});

export type ProviderMemoryResponse = z.infer<typeof ProviderMemoryResponseSchema>;

