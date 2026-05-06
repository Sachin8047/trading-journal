import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();


// ✅ GET (only logged-in user's trades)
export async function GET() {
  const trades = await prisma.trade.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(trades);
}


// ✅ POST (create trade with user)


export async function POST(req: Request) {
  try {
    const session = await getServerSession();
   console.log("SESSION EMAIL:", session?.user?.email); 
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("BODY:", body);

    const trade = await prisma.trade.create({
      data: {
        symbol: body.symbol,
        type: body.type,
        entryPrice: Number(body.entryPrice),
        exitPrice: Number(body.exitPrice),
        quantity: Number(body.quantity),
        stopLoss: Number(body.stopLoss),
        strategy: body.strategy,
        notes: body.notes,
        userEmail: session.user.email, // 🔥 IMPORTANT
      },
    });

    return NextResponse.json(trade);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create trade" },
      { status: 500 }
    );
  }
}