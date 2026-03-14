import { NextResponse } from "next/server";
import { getMockAgentAnswer } from "@/lib/mock/agent";

export async function POST(req: Request) {
  const body = (await req.json()) as { message?: string };
  const message = body.message ?? "";
  return NextResponse.json(getMockAgentAnswer(message));
}

