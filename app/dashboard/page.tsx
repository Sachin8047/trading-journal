"use client";

import { useEffect, useState } from "react";
import TradesTable from "@/components/TradesTable";

type Trade = {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  createdAt: string;
};

export default function DashboardPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch trades
  const fetchTrades = async () => {
    try {
      const res = await fetch("/api/trades");
      const data = await res.json();
      setTrades(data || []);
    } catch (err) {
      console.error("Error fetching trades:", err);
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  // Stats
  const totalTrades = trades.length;

  const pnl = trades.reduce((acc, t) => {
    const profit =
      t.type === "BUY"
        ? (t.exitPrice - t.entryPrice) * t.quantity
        : (t.entryPrice - t.exitPrice) * t.quantity;
    return acc + profit;
  }, 0);

  const wins = trades.filter((t) => {
    const profit =
      t.type === "BUY"
        ? t.exitPrice > t.entryPrice
        : t.entryPrice > t.exitPrice;
    return profit;
  }).length;

  const losses = totalTrades - wins;

  const winRate =
    totalTrades === 0 ? 0 : ((wins / totalTrades) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">📊 Trading Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Trades" value={totalTrades} />
        <StatCard title="Net P&L" value={`₹ ${pnl}`} />
        <StatCard title="Win Rate" value={`${winRate}%`} />
        <StatCard title="Wins / Losses" value={`${wins}/${losses}`} />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
        <h2 className="text-lg font-semibold mb-4">Trades</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <TradesTable trades={trades} />
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}