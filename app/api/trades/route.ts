import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* =========================
   GET — Fetch user trades
========================= */
export async function GET() {
  try {
    const session = await getServerSession();

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
      { error: error.message },
      { status: 500 }
    );
  }
}

/* =========================
   POST — Create trade
========================= */
export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const entry = Number(body.entryPrice);
    const exit = Number(body.exitPrice);
    const qty = Number(body.quantity);
    const stopLoss = body.stopLoss ? Number(body.stopLoss) : null;

    // 🔥 P&L
    const pnl =
      body.type === "BUY"
        ? (exit - entry) * qty
        : (entry - exit) * qty;

    // 🔥 ROI
    const invested = entry * qty;
    const roi = invested ? (pnl / invested) * 100 : 0;

    // 🔥 Risk
    const risk =
      stopLoss !== null
        ? Math.abs(entry - stopLoss) * qty
        : null;

    // 🔥 R-Multiple
    const rMultiple =
      risk && risk !== 0 ? pnl / risk : null;

    const trade = await prisma.trade.create({
      data: {
        symbol: body.symbol,
        type: body.type,

        entryPrice: entry,
        exitPrice: exit,
        quantity: qty,

        stopLoss,
        strategy: body.strategy || null,
        setup: body.setup || null,
        notes: body.notes || null,

        entryTime: body.entryTime
          ? new Date(body.entryTime)
          : null,
        exitTime: body.exitTime
          ? new Date(body.exitTime)
          : null,

        rating: body.rating ? Number(body.rating) : null,
        fees: body.fees ? Number(body.fees) : null,

        risk,
        rMultiple,
        roi,

        userEmail: session.user.email,
      },
    });

    return NextResponse.json(trade);
  } catch (error: any) {
    console.error("POST ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/* =========================
   PUT — Update trade (SECURE)
========================= */
export async function PUT(req: Request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const entry = Number(body.entryPrice);
    const exit = Number(body.exitPrice);
    const qty = Number(body.quantity);
    const stopLoss = body.stopLoss ? Number(body.stopLoss) : null;

    const pnl =
      body.type === "BUY"
        ? (exit - entry) * qty
        : (entry - exit) * qty;

    const invested = entry * qty;
    const roi = invested ? (pnl / invested) * 100 : 0;

    const risk =
      stopLoss !== null
        ? Math.abs(entry - stopLoss) * qty
        : null;

    const rMultiple =
      risk && risk !== 0 ? pnl / risk : null;

    const updated = await prisma.trade.updateMany({
      where: {
        id: body.id, // UUID string
        userEmail: session.user.email, // 🔒 SECURITY
      },
      data: {
        symbol: body.symbol,
        type: body.type,

        entryPrice: entry,
        exitPrice: exit,
        quantity: qty,

        stopLoss,
        strategy: body.strategy || null,
        setup: body.setup || null,
        notes: body.notes || null,

        entryTime: body.entryTime
          ? new Date(body.entryTime)
          : null,
        exitTime: body.exitTime
          ? new Date(body.exitTime)
          : null,

        rating: body.rating ? Number(body.rating) : null,
        fees: body.fees ? Number(body.fees) : null,

        risk,
        rMultiple,
        roi,
      },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { error: "Trade not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Updated successfully" });
  } catch (error: any) {
    console.error("PUT ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE — Remove trade (SECURE)
========================= */
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID" },
        { status: 400 }
      );
    }

    const deleted = await prisma.trade.deleteMany({
      where: {
        id,
        userEmail: session.user.email, // 🔒 SECURITY
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Trade not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}