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

  const { customerName, garment, priceNaira, deliveryFeeNaira } = body as Record<
    string,
    unknown
  >;

  if (typeof customerName !== "string" || customerName.trim() === "") {
    console.warn("[orders] validation failed: customerName");
    return NextResponse.json(
      { error: "Please enter the customer's name." },
      { status: 400 }
    );
  }

  if (typeof garment !== "string" || garment.trim() === "") {
    console.warn("[orders] validation failed: garment");
    return NextResponse.json(
      { error: "Please enter the garment." },
      { status: 400 }
    );
  }

  let parsedPrice: number | null = null;
  if (typeof priceNaira === "number") {
    if (Number.isInteger(priceNaira) && priceNaira > 0) {
      parsedPrice = priceNaira;
    }
  } else if (typeof priceNaira === "string") {
    const trimmed = priceNaira.trim();
    if (/^\d+$/.test(trimmed)) {
      const val = parseInt(trimmed, 10);
      if (val > 0) {
        parsedPrice = val;
      }
    }
  }

  if (parsedPrice === null) {
    console.warn("[orders] validation failed: priceNaira");
    return NextResponse.json(
      { error: "Please enter a price in whole naira, greater than 0." },
      { status: 400 }
    );
  }

  let parsedDeliveryFee: number | null = null;
  if (
    deliveryFeeNaira === undefined ||
    deliveryFeeNaira === null ||
    (typeof deliveryFeeNaira === "string" && deliveryFeeNaira.trim() === "")
  ) {
    parsedDeliveryFee = null;
  } else if (typeof deliveryFeeNaira === "number") {
    if (Number.isInteger(deliveryFeeNaira) && deliveryFeeNaira >= 0) {
      parsedDeliveryFee = deliveryFeeNaira;
    } else {
      console.warn("[orders] validation failed: deliveryFeeNaira");
      return NextResponse.json(
        {
          error:
            "Delivery fee must be a whole number of naira, or left blank if not quoted yet.",
        },
        { status: 400 }
      );
    }
  } else if (typeof deliveryFeeNaira === "string") {
    const trimmed = deliveryFeeNaira.trim();
    if (/^\d+$/.test(trimmed)) {
      const val = parseInt(trimmed, 10);
      if (val >= 0) {
        parsedDeliveryFee = val;
      } else {
        console.warn("[orders] validation failed: deliveryFeeNaira");
        return NextResponse.json(
          {
            error:
              "Delivery fee must be a whole number of naira, or left blank if not quoted yet.",
          },
          { status: 400 }
        );
      }
    } else {
      console.warn("[orders] validation failed: deliveryFeeNaira");
      return NextResponse.json(
        {
          error:
            "Delivery fee must be a whole number of naira, or left blank if not quoted yet.",
        },
        { status: 400 }
      );
    }
  } else {
    console.warn("[orders] validation failed: deliveryFeeNaira");
    return NextResponse.json(
      {
        error:
          "Delivery fee must be a whole number of naira, or left blank if not quoted yet.",
      },
      { status: 400 }
    );
  }

  try {
    const order = await prisma.order.create({
      data: {
        customerName: customerName.trim(),
        garment: garment.trim(),
        priceNaira: parsedPrice,
        deliveryFeeNaira: parsedDeliveryFee,
      },
    });

    console.log(`[orders] write succeeded id=${order.id}`);
    return NextResponse.json(
      { id: order.id, createdAt: order.createdAt.toISOString() },
      { status: 201 }
    );
  } catch (error: any) {
    const errorName = error?.name || "Error";
    console.error(`[orders] write failed: ${errorName}`);
    return NextResponse.json(
      { error: "Could not save the order" },
      { status: 500 }
    );
  }
}

