import api, { USE_MOCK } from "@/api/client";
import type { AgentMessage } from "@/types/agent";
import { getMockAgentAnswer } from "@/lib/mock/agent";

export interface AgentQueryRequest {
  threadId?: string;
  message: string;
}

export interface AgentQueryResponse {
  threadId: string;
  messages: AgentMessage[];
}

export async function askAgent(
  payload: AgentQueryRequest
): Promise<AgentQueryResponse> {
  if (USE_MOCK) {
    return Promise.resolve(getMockAgentAnswer(payload.message));
  }

  const res = await api.post<AgentQueryResponse>("/api/agent/query", payload);
  return res.data;
}

import { apiRequest } from "@/api/http";
import { AgentChatResponseSchema } from "@/types/agent";

export async function sendAgentMessage(payload: { threadId?: string; message: string }) {
  return apiRequest("/api/agent/chat", AgentChatResponseSchema, {
    method: "POST",
    body: payload
  });
}

