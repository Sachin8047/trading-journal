import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ❌ DELETE trade
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.trade.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// ✏️ UPDATE trade
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const updated = await prisma.trade.update({
      where: { id: params.id },
      data: {
        symbol: body.symbol,
        type: body.type,
        entryPrice: Number(body.entryPrice),
        exitPrice: Number(body.exitPrice),
        quantity: Number(body.quantity),
        stopLoss: Number(body.stopLoss),
        strategy: body.strategy,
        notes: body.notes,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}