import { NextResponse } from "next/server";
import { getMockProviderMemory } from "@/lib/mock/providers";

export async function GET(
  _req: Request,
  { params }: { params: { providerId: string } }
) {
  return NextResponse.json(getMockProviderMemory(params.providerId));
}

