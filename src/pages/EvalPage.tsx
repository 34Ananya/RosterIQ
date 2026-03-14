"use client";

import * as React from "react";
import { askAgent } from "@/api/agent";
import { scenarios, type EvalScenario } from "@/eval/scenarios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EvalResult {
  scenarioId: string;
  response: string;
  score: number;
  notes: string;
}

export function EvalPage() {
  const [results, setResults] = React.useState<EvalResult[]>([]);
  const [running, setRunning] = React.useState<string | null>(null);

  const runScenario = async (scenario: EvalScenario) => {
    setRunning(scenario.id);
    try {
      const response = await askAgent({ message: scenario.query });
      const agentResponse = response.messages[response.messages.length - 1]?.content[0]?.text || "No response";
      setResults(prev => [...prev, {
        scenarioId: scenario.id,
        response: agentResponse,
        score: 0,
        notes: ""
      }]);
    } catch (error) {
      console.error("Eval run failed:", error);
    } finally {
      setRunning(null);
    }
  };

  const updateResult = (scenarioId: string, field: keyof EvalResult, value: string | number) => {
    setResults(prev => prev.map(r => r.scenarioId === scenarioId ? { ...r, [field]: value } : r));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1>Evaluation Harness</h1>
      <div className="grid grid-cols-2 gap-4">
        {scenarios.map(scenario => {
          const result = results.find(r => r.scenarioId === scenario.id);
          return (
            <div key={scenario.id} className="border border-slate-800 rounded-md p-4">
              <h3>{scenario.description}</h3>
              <p><strong>Query:</strong> {scenario.query}</p>
              <p><strong>Expected:</strong> {scenario.expectedBehavior}</p>
              <Button onClick={() => runScenario(scenario)} disabled={running === scenario.id}>
                {running === scenario.id ? "Running..." : "Run Scenario"}
              </Button>
              {result && (
                <div className="mt-4">
                  <p><strong>Agent Answer:</strong> {result.response}</p>
                  <div>
                    <label>Score (0-5):</label>
                    <Input
                      type="number"
                      min="0"
                      max="5"
                      value={result.score}
                      onChange={(e) => updateResult(scenario.id, "score", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label>Notes:</label>
                    <Textarea
                      value={result.notes}
                      onChange={(e) => updateResult(scenario.id, "notes", e.target.value)}
                      placeholder="Why this score?"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}