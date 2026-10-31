import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { error: "Request body must be a JSON object." },
      { status: 400 }
    );
  }

  // password / confirmPassword are intentionally ignored — never read, stored, or logged.
  const { fullName, email, phone } = body as Record<string, unknown>;

  try {
    const customer = await prisma.customer.create({
      data: {
        fullName: fullName as string,
        email: email as string,
        phone: (phone as string | undefined) ?? null,
      },
    });

    console.log(`[signup] write succeeded id=${customer.id}`);
    return NextResponse.json({ id: customer.id }, { status: 201 });
  } catch (error: unknown) {
    const errorName = error instanceof Error ? error.name : "Error";
    console.error(`[signup] write failed: ${errorName}`);
    return NextResponse.json(
      { error: "Could not create account." },
      { status: 500 }
    );
  }
}

