import { apiRequest } from "@/api/http";
import { EvaluationRunResponseSchema } from "@/types/evaluations";

export async function runEvaluation(payload: { scenarioId: string }) {
  return apiRequest("/api/evaluations/run", EvaluationRunResponseSchema, {
    method: "POST",
    body: payload
  });
}

