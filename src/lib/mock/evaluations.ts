import type { EvaluationScenario, EvaluationRunResponse } from "@/types/evaluations";

export const MOCK_SCENARIOS: EvaluationScenario[] = [
  {
    id: "dup_provider",
    title: "Detect duplicate provider across rosters",
    description:
      "Find a provider that appears twice with minor name/address variation and confirm they should be merged.",
    prompt:
      "Detect duplicates across the last two rosters. Return the suspected pair(s) and the merge rationale."
  },
  {
    id: "npi_conflict",
    title: "Detect conflicting NPIs",
    description:
      "Identify providers where the same name maps to different NPIs between uploads.",
    prompt:
      "List providers with conflicting NPIs and provide a recommended remediation action."
  },
  {
    id: "address_drift",
    title: "Detect address drift",
    description:
      "Flag providers whose address changed more than once within 60 days.",
    prompt:
      "Which providers show repeated address drift in the last 60 days? Summarize by provider."
  }
];

export function runMockEvaluation(scenarioId: string): EvaluationRunResponse {
  if (scenarioId === "dup_provider") {
    return {
      scenarioId,
      passed: true,
      score: 0.92,
      expected: "Detect at least one duplicate pair and propose merge.",
      actual:
        "Identified 'Avery Patel' vs 'A. Patel' with near-identical NPI/address; recommended merge with confidence 0.91.",
      notes: ["Correct merge rationale", "Returned structured output"]
    };
  }
  if (scenarioId === "npi_conflict") {
    return {
      scenarioId,
      passed: false,
      score: 0.41,
      expected: "List conflicts with severity and remediation.",
      actual: "Listed conflicts but missed remediation step and severity ordering.",
      notes: ["Missing severity rubric", "No remediation guidance"]
    };
  }
  return {
    scenarioId,
    passed: true,
    score: 0.78,
    expected: "Flag repeated drift and summarize counts.",
    actual: "Flagged two providers with 2+ address changes; included dates and sources.",
    notes: ["Good drift threshold", "Could include confidence deltas"]
  };
}

