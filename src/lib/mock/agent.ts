import type { AgentChatResponse } from "@/types/agent";

export function getMockAgentThread(threadId = "thread_demo"): AgentChatResponse {
  return {
    threadId,
    messages: [
      {
        id: "m1",
        role: "assistant",
        createdAt: "2026-03-10T16:00:00.000Z",
        toolCalls: [],
        content: [
          {
            type: "text",
            text: "Ask me about provider changes, anomalies, and roster history. I can respond with structured tables/charts."
          },
          {
            type: "insight",
            title: "Tip",
            body: "Try: “Which providers changed address this month?”"
          }
        ]
      }
    ]
  };
}

export function getMockAgentAnswer(prompt: string): AgentChatResponse {
  const now = new Date().toISOString();
  const normalized = prompt.toLowerCase();

  const base: AgentChatResponse = {
    threadId: "thread_demo",
    messages: [
      {
        id: "u_" + now,
        role: "user",
        createdAt: now,
        toolCalls: [],
        content: [{ type: "text", text: prompt }]
      },
      {
        id: "a_" + now,
        role: "assistant",
        createdAt: now,
        toolCalls: [
          { name: "provider.search", status: "done", detail: "Scanned latest roster diff" },
          { name: "provider.diff", status: "done", detail: "Computed field-level changes" }
        ],
        content: [{ type: "text", text: "Here’s what I found." }]
      }
    ]
  };

  if (normalized.includes("changed address")) {
    base.messages[1]!.content.push({
      type: "table",
      title: "Address changes (March)",
      columns: ["Provider", "NPI", "From", "To", "Source"],
      rows: [
        ["Avery Patel", "1234567890", "1200 Market St, SF", "1200 Market Street, SF", "roster_mar_2026.csv"],
        ["Jordan Kim", "1987654321", "44 W 28th St, NY", "44 W 28th Street, NY", "roster_mar_2026.csv"]
      ]
    });
    base.messages[1]!.content.push({
      type: "chart",
      title: "Change volume by type",
      kind: "bar",
      data: [
        { type: "address", count: 2 },
        { type: "specialty", count: 1 },
        { type: "npi", count: 1 }
      ]
    });
    base.messages[1]!.content.push({
      type: "insight",
      title: "Actionable next step",
      body: "Route these two providers to verification; address changes correlate with lower confidence when source formatting differs."
    });
    return base;
  }

  if (normalized.includes("conflicting npi") || normalized.includes("npi")) {
    base.messages[1]!.content.push({
      type: "table",
      title: "Potential NPI conflicts",
      columns: ["Provider", "Current NPI", "Alternate NPI", "Signal", "Severity"],
      rows: [
        ["Quinn Shah", "1555123456", "1555123457", "Rosters disagree", "High"],
        ["Morgan Chen", "1222333444", "1222333449", "Pattern mismatch", "Medium"]
      ]
    });
    base.messages[1]!.content.push({
      type: "insight",
      title: "Why this matters",
      body: "Conflicting NPIs can break downstream claims routing and directory accuracy. Prioritize High severity items."
    });
    return base;
  }

  if (normalized.includes("first time") || normalized.includes("appeared")) {
    base.messages[1]!.content.push({
      type: "table",
      title: "New providers (March)",
      columns: ["Provider", "NPI", "Specialty", "Source", "Confidence"],
      rows: [
        ["Sydney Garcia", "1444555666", "Pediatrics", "roster_mar_2026.csv", "0.79"],
        ["Cameron Lee", "1999000111", "Neurology", "roster_mar_2026.csv", "0.74"]
      ]
    });
    return base;
  }

  base.messages[1]!.content.push({
    type: "insight",
    title: "Supported question types",
    body: "Address changes, conflicting NPIs, first-time providers, anomaly counts, and roster-level summaries."
  });
  return base;
}

