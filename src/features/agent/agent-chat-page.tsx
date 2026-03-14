"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AgentMessageRenderer } from "@/features/agent/agent-message-renderer";
import type { AgentMessage } from "@/types/agent";
import { Sparkles } from "lucide-react";
import { useAgentQuery } from "@/hooks/use-agent";
import { askAgent } from "@/api/agent";

export function AgentChatPage() {
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<AgentMessage[]>([]);

  const thread = useQuery({
    queryKey: ["agent-thread"],
    queryFn: () => askAgent({ message: "" })
  });

  React.useEffect(() => {
    if (thread.data?.messages) setMessages(thread.data.messages);
  }, [thread.data]);

  const mutation = useAgentQuery();

  function send(message: string) {
    const trimmed = message.trim();
    if (!trimmed) return;
    setInput("");

    const optimistic: AgentMessage = {
      id: `local_${Date.now()}`,
      role: "user",
      createdAt: new Date().toISOString(),
      toolCalls: [],
      content: [{ type: "text", text: message }]
    };
    setMessages((prev) => [...prev, optimistic]);

    mutation.mutate(
      { message: trimmed },
      {
        onSuccess: (data) => {
          setMessages((prev) => {
            // Replace thread with server response to keep it canonical
            const serverMessages = data.messages;
            // Keep any optimistic user message not present (fallback)
            const merged = [...prev];
            const seen = new Set(serverMessages.map((m) => m.id));
            for (const m of merged) if (!seen.has(m.id)) serverMessages.unshift(m);
            return serverMessages;
          });
        }
      }
    );
  }

  const suggested = [
    "Which providers changed address this month?",
    "Show providers with conflicting NPIs.",
    "Which providers appeared for the first time?"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xl font-semibold tracking-tight">AI Roster Agent</div>
          <div className="text-sm text-muted-foreground max-w-2xl">
            Chat UI is wired for structured responses (text, tables, charts, insights). Backend/LLM
            integration can replace the mock API later with minimal UI changes.
          </div>
        </div>
        <Badge variant="outline">POST /api/agent/chat</Badge>
      </div>

      <Card className="border-white/5 bg-slate-950/60">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="flex items-center gap-2 text-sky-100">
            <Sparkles className="h-4 w-4 text-sky-400" />
            RosterIQ Agent Console
          </CardTitle>
          <CardDescription>Streaming-ready message renderer + tool call indicators.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {suggested.map((s) => (
              <Button
                key={s}
                variant="outline"
                size="sm"
                className="border-sky-500/40 bg-sky-500/5 hover:bg-sky-500/20"
                onClick={() => send(s)}
              >
                {s}
              </Button>
            ))}
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-950/80 p-4 shadow-inner shadow-black/60">
            <div className="space-y-3">
              {messages.map((m) => (
                <AgentMessageRenderer key={m.id} message={m} />
              ))}
              {mutation.isPending && (
                <div className="text-sm text-muted-foreground">Assistant is thinking…</div>
              )}
              {thread.isLoading && messages.length === 0 && (
                <div className="text-sm text-muted-foreground">Loading thread…</div>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask: “Which providers changed address this month?”"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
            />
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Enter to send • Shift+Enter for newline
              </div>
              <Button
                onClick={() => send(input)}
              >
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

