import { NextResponse } from "next/server";
import { runMockEvaluation } from "@/lib/mock/evaluations";

export async function POST(req: Request) {
  const body = (await req.json()) as { scenarioId?: string };
  if (!body.scenarioId) {
    return NextResponse.json({ message: "scenarioId is required" }, { status: 400 });
  }
  return NextResponse.json(runMockEvaluation(body.scenarioId));
}

