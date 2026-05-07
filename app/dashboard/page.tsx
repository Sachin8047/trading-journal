"use client";

import { useEffect, useState } from "react";
import TradesTable from "@/components/TradesTable";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function DashboardPage() {
  const [trades, setTrades] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/trades")
      .then((res) => res.json())
      .then((data) => setTrades(data || []));
  }, []);

  let totalPnL = 0;
  let wins = 0;
  let losses = 0;

  const chartData = trades.map((t, index) => {
    const pnl =
      t.type === "BUY"
        ? (Number(t.exitPrice) - Number(t.entryPrice)) * Number(t.quantity)
        : (Number(t.entryPrice) - Number(t.exitPrice)) * Number(t.quantity);

    totalPnL += pnl;

    if (pnl > 0) wins++;
    else if (pnl < 0) losses++;

    return {
      name: `T${index + 1}`,
      pnl: totalPnL,
    };
  });

  const totalTrades = trades.length;
  const winRate =
    totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : "0";

  const buyCount = trades.filter((t) => t.type === "BUY").length;
  const sellCount = trades.filter((t) => t.type === "SELL").length;

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">📊 Dashboard</h1>
        <p className="text-gray-400 text-sm">
          Track your trading performance
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Total Trades" value={totalTrades} />
        <Card
          title="Net P&L"
          value={`₹ ${totalPnL}`}
          highlight={totalPnL >= 0 ? "green" : "red"}
        />
        <Card title="Win Rate" value={`${winRate}%`} />
        <Card title="Wins / Losses" value={`${wins} / ${losses}`} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* EQUITY CURVE */}
        <div className="lg:col-span-2 glass-card">
          <h2 className="mb-4 font-semibold text-lg">Equity Curve</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="pnl"
                stroke="#22c55e"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE SECTION */}
        <div className="space-y-6">

          <div className="glass-card">
            <h2 className="mb-2 font-semibold">Win vs Loss</h2>
            <PieChart width={250} height={200}>
              <Pie
                data={[
                  { name: "Win", value: wins },
                  { name: "Loss", value: losses },
                ]}
                dataKey="value"
                outerRadius={70}
              >
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
              </Pie>
              <Legend />
            </PieChart>
          </div>

          <div className="glass-card">
            <h2 className="mb-2 font-semibold">Trade Types</h2>
            <PieChart width={250} height={200}>
              <Pie
                data={[
                  { name: "BUY", value: buyCount },
                  { name: "SELL", value: sellCount },
                ]}
                dataKey="value"
                outerRadius={70}
              >
                <Cell fill="#3b82f6" />
                <Cell fill="#f59e0b" />
              </Pie>
              <Legend />
            </PieChart>
          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="glass-card">
        <TradesTable trades={trades} />
      </div>

    </div>
  );
}

/* 🔥 CARD COMPONENT */
function Card({
  title,
  value,
  highlight,
}: {
  title: string;
  value: any;
  highlight?: "green" | "red";
}) {
  return (
    <div className="glass-card p-4">
      <p className="text-sm text-gray-400">{title}</p>
      <h2
        className={`text-2xl font-bold ${
          highlight === "green"
            ? "text-green-400"
            : highlight === "red"
            ? "text-red-400"
            : ""
        }`}
      >
        {value}
      </h2>
    </div>
  );
}