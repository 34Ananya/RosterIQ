"use client";

import * as React from "react";
import { askAgent } from "@/api/agent";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  from: "user" | "agent";
  text: string;
}

interface LastResponse {
  reasoning: string;
  usedTools: string[];
  suggestedActions: string[];
}

export function AgentPage() {
  const [rosterId, setRosterId] = React.useState("");
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [lastResponse, setLastResponse] = React.useState<LastResponse | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { from: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const response = await askAgent({ message: input });
      const agentMessage: Message = { from: "agent", text: response.messages[response.messages.length - 1]?.content[0]?.text || "Response" };
      setMessages(prev => [...prev, agentMessage]);
      setLastResponse({
        reasoning: "Analyzed roster data for changes and anomalies.",
        usedTools: response.messages[response.messages.length - 1]?.toolCalls.map((tc: any) => tc.name) || [],
        suggestedActions: ["Verify provider details", "Update records"]
      });
    } catch (error) {
      console.error("Agent query failed:", error);
      setMessages(prev => [...prev, { from: "agent", text: "Error occurred." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-[2fr,3fr] gap-4">
      {/* Left Panel */}
      <div className="space-y-4">
        <h2>Roster Agent Chat</h2>
        <Input
          value={rosterId}
          onChange={(e) => setRosterId(e.target.value)}
          placeholder="Current roster ID (optional)"
        />
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={msg.from === "user" ? "bg-sky-600 text-white ml-auto p-2 rounded" : "bg-slate-800 text-slate-100 mr-auto p-2 rounded"}>
              {msg.text}
            </div>
          ))}
          {loading && <p>Thinking...</p>}
        </div>
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about providers..."
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="space-y-4">
        <h3 className="text-sky-300">Reasoning</h3>
        <p>{lastResponse?.reasoning}</p>
        <h3 className="text-emerald-300">Tools Used</h3>
        <ul>
          {lastResponse?.usedTools.map((tool: string, i: number) => <li key={i}>{tool}</li>)}
        </ul>
        <h3 className="text-orange-300">Suggested Actions</h3>
        <ul>
          {lastResponse?.suggestedActions.map((action: string, i: number) => <li key={i}>{action}</li>)}
        </ul>
      </div>
    </div>
  );
}