"use client";

import * as React from "react";
import type { AgentContent, AgentMessage } from "@/types/agent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/cn";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function AgentMessageRenderer({ message }: { message: AgentMessage }) {
  return (
    <div className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "w-full max-w-3xl rounded-xl border bg-card px-4 py-3 shadow-sm",
          message.role === "user" && "bg-primary text-primary-foreground border-primary/40"
        )}
      >
        {message.toolCalls.length > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {message.toolCalls.map((t, idx) => (
              <Badge key={idx} variant={t.status === "error" ? "destructive" : "outline"}>
                {t.name} • {t.status}
              </Badge>
            ))}
          </div>
        )}
        <div className="space-y-3">
          {message.content.map((c, idx) => (
            <ContentBlock key={idx} role={message.role} content={c} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ContentBlock({
  content,
  role
}: {
  content: AgentContent;
  role: AgentMessage["role"];
}) {
  if (content.type === "text") {
    return <div className={cn("text-sm leading-relaxed whitespace-pre-wrap", role === "user" && "text-primary-foreground")}>{content.text}</div>;
  }

  if (content.type === "insight") {
    return (
      <div className={cn("rounded-xl border bg-muted/20 p-3", role === "user" && "bg-white/10 border-white/20")}>
        <div className={cn("text-sm font-medium", role === "user" && "text-primary-foreground")}>{content.title}</div>
        <div className={cn("text-sm text-muted-foreground mt-1", role === "user" && "text-primary-foreground/80")}>{content.body}</div>
      </div>
    );
  }

  if (content.type === "table") {
    return (
      <Card className={cn(role === "user" && "bg-white/5 border-white/20")}>
        {content.title && (
          <CardHeader className="pb-2">
            <CardTitle className={cn("text-sm", role === "user" && "text-primary-foreground")}>
              {content.title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className={cn("p-0", !content.title && "pt-0")}>
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  {content.columns.map((c) => (
                    <TableHead key={c}>{c}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {content.rows.map((r, idx) => (
                  <TableRow key={idx}>
                    {r.map((cell, j) => (
                      <TableCell key={j} className="text-muted-foreground">
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (content.type === "chart") {
    return (
      <Card className={cn(role === "user" && "bg-white/5 border-white/20")}>
        {content.title && (
          <CardHeader className="pb-2">
            <CardTitle className={cn("text-sm", role === "user" && "text-primary-foreground")}>
              {content.title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {content.kind === "bar" ? (
                <BarChart data={content.data as any}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              ) : content.kind === "line" ? (
                <LineChart data={content.data as any}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="y" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              ) : (
                <PieChart>
                  <Tooltip />
                  <Pie data={content.data as any} dataKey="value" nameKey="name" fill="hsl(var(--primary))" />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Chart rendering supports mock bar/line/pie blocks (AI integration ready).
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}

