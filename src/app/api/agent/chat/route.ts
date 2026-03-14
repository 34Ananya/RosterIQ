import { NextResponse } from "next/server";
import { getMockAgentAnswer, getMockAgentThread } from "@/lib/mock/agent";

export async function POST(req: Request) {
  const body = (await req.json()) as { threadId?: string; message?: string };
  const message = body.message?.trim();
  if (!message) return NextResponse.json(getMockAgentThread(body.threadId));
  return NextResponse.json(getMockAgentAnswer(message));
}

