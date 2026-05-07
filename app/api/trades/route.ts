import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

/* =========================
   GET — Fetch user trades
========================= */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trades = await prisma.trade.findMany({
      where: {
        userEmail: session.user.email,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(trades);
  } catch (error: any) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch trades" },
      { status: 500 }
    );
  }
}

/* =========================
   POST — Add new trade
========================= */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const trade = await prisma.trade.create({
      data: {
        symbol: body.symbol,
        type: body.type,
        entryPrice: Number(body.entryPrice),
        exitPrice: Number(body.exitPrice),
        quantity: Number(body.quantity),
        stopLoss: body.stopLoss ? Number(body.stopLoss) : null,
        strategy: body.strategy || null,
        notes: body.notes || null,
        userEmail: session.user.email, // 🔥 CRITICAL for multi-user
      },
    });

    return NextResponse.json(trade);
  } catch (error: any) {
    console.error("POST ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create trade" },
      { status: 500 }
    );
  }
}

/* =========================
   PUT — Update trade (SECURE)
========================= */
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const trade = await prisma.trade.update({
      where: {
        id: body.id, // string (uuid)
      },
      data: {
        symbol: body.symbol,
        type: body.type,
        entryPrice: Number(body.entryPrice),
        exitPrice: Number(body.exitPrice),
        quantity: Number(body.quantity),
        stopLoss: body.stopLoss ? Number(body.stopLoss) : null,
        strategy: body.strategy || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(trade);
  } catch (error: any) {
    console.error("PUT ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update trade" },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE — Delete trade (SECURE)
========================= */
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    await prisma.trade.delete({
      where: {
        id, // string uuid
      },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete trade" },
      { status: 500 }
    );
  }
}