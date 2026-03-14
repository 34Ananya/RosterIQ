import { z } from "zod";

export const AgentToolCallSchema = z.object({
  name: z.string(),
  status: z.enum(["running", "done", "error"]),
  detail: z.string().optional()
});

export const AgentTableSchema = z.object({
  type: z.literal("table"),
  title: z.string().optional(),
  columns: z.array(z.string()),
  rows: z.array(z.array(z.string()))
});

export const AgentChartSchema = z.object({
  type: z.literal("chart"),
  title: z.string().optional(),
  kind: z.enum(["bar", "line", "pie"]),
  data: z.array(z.record(z.union([z.string(), z.number()])))
});

export const AgentInsightSchema = z.object({
  type: z.literal("insight"),
  title: z.string(),
  body: z.string()
});

export const AgentContentSchema = z.union([
  z.object({ type: z.literal("text"), text: z.string() }),
  AgentTableSchema,
  AgentChartSchema,
  AgentInsightSchema
]);

export type AgentContent = z.infer<typeof AgentContentSchema>;

export const AgentMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  createdAt: z.string(),
  toolCalls: z.array(AgentToolCallSchema).default([]),
  content: z.array(AgentContentSchema)
});

export type AgentMessage = z.infer<typeof AgentMessageSchema>;

export const AgentChatResponseSchema = z.object({
  threadId: z.string(),
  messages: z.array(AgentMessageSchema)
});

export type AgentChatResponse = z.infer<typeof AgentChatResponseSchema>;

