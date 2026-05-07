import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* =========================
   GET — Fetch user trades
========================= */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
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
   POST — Add new trade
========================= */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    console.log("SESSION:", session);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    console.log("BODY:", body);

    const trade = await prisma.trade.create({
      data: {
        symbol: String(body.symbol),
        type: String(body.type),
        entryPrice: parseFloat(body.entryPrice),
        exitPrice: parseFloat(body.exitPrice),
        quantity: parseInt(body.quantity),

        stopLoss: body.stopLoss ? parseFloat(body.stopLoss) : 0,
        strategy: body.strategy || null,
        notes: body.notes || null,

        userEmail: session.user.email,
      },
    });

    return NextResponse.json(trade);
  } catch (error: any) {
    console.error("POST ERROR FULL:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/* =========================
   PUT — Update trade
========================= */
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const trade = await prisma.trade.update({
      where: {
        id: body.id, // ✅ UUID string
      },
      data: {
        symbol: String(body.symbol),
        type: String(body.type),
        entryPrice: parseFloat(body.entryPrice),
        exitPrice: parseFloat(body.exitPrice),
        quantity: parseInt(body.quantity),

        stopLoss: body.stopLoss ? parseFloat(body.stopLoss) : 0,
        strategy: body.strategy || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(trade);
  } catch (error: any) {
    console.error("PUT ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE — Delete trade
========================= */
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
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

    await prisma.trade.delete({
      where: {
        id: id, // ✅ UUID string
      },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}