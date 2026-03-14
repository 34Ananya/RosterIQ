import { z } from "zod";

export const EvaluationScenarioSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  prompt: z.string()
});

export type EvaluationScenario = z.infer<typeof EvaluationScenarioSchema>;

export const EvaluationRunRequestSchema = z.object({
  scenarioId: z.string()
});

export const EvaluationRunResponseSchema = z.object({
  scenarioId: z.string(),
  passed: z.boolean(),
  score: z.number().min(0).max(1),
  expected: z.string(),
  actual: z.string(),
  notes: z.array(z.string()).default([])
});

export type EvaluationRunResponse = z.infer<typeof EvaluationRunResponseSchema>;

