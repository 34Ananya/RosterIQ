import { useMutation } from "@tanstack/react-query";
import { askAgent, type AgentQueryRequest, type AgentQueryResponse } from "@/api/agent";
import { useToast } from "@/components/ui/toast";

export function useAgentQuery() {
  const { push } = useToast();

  return useMutation<AgentQueryResponse, Error, AgentQueryRequest>({
    mutationFn: async (payload: AgentQueryRequest) => {
      try {
        return await askAgent(payload);
      } catch (err: any) {
        const msg = err?.message ?? "Agent query failed.";
        push({ type: "error", message: msg, title: "Agent error" });
        throw err;
      }
    }
  });
}

