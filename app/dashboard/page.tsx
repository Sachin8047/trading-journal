"use client";

import { useEffect, useState } from "react";
import TradesTable from "@/components/TradesTable";
import TradeForm from "@/components/TradeForm";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type Trade = {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  strategy?: string | null;
  createdAt?: string;
};

export default function DashboardPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState("ALL");

  const fetchTrades = async () => {
    const res = await fetch("/api/trades");
    const data = await res.json();
    setTrades(data || []);
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const filteredTrades =
    selectedStrategy === "ALL"
      ? trades
      : trades.filter((t) => t.strategy === selectedStrategy);

  // ========================
  // 📈 EQUITY CURVE
  // ========================
  let total = 0;

  const equityData = filteredTrades.map((t, i) => {
    const pnl =
      t.type === "BUY"
        ? (t.exitPrice - t.entryPrice) * t.quantity
        : (t.entryPrice - t.exitPrice) * t.quantity;

    total += pnl;

    return { name: `T${i + 1}`, pnl: total };
  });

  // ========================
  // 📊 DAILY P&L
  // ========================
  const dailyMap: Record<string, number> = {};

  filteredTrades.forEach((t) => {
    const date = new Date(t.createdAt || "").toDateString();

    const pnl =
      t.type === "BUY"
        ? (t.exitPrice - t.entryPrice) * t.quantity
        : (t.entryPrice - t.exitPrice) * t.quantity;

    dailyMap[date] = (dailyMap[date] || 0) + pnl;
  });

  const dailyData = Object.keys(dailyMap).map((d) => ({
    date: d,
    pnl: dailyMap[d],
  }));

  // ========================
  // 💰 TOTAL P&L
  // ========================
  const totalPnL = filteredTrades.reduce((acc, t) => {
    const pnl =
      t.type === "BUY"
        ? (t.exitPrice - t.entryPrice) * t.quantity
        : (t.entryPrice - t.exitPrice) * t.quantity;

    return acc + pnl;
  }, 0);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">📊 Dashboard</h1>
          <p className="text-sm text-gray-400">Track your performance</p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
        >
          + Add Trade
        </button>
      </div>

      {showForm && (
        <TradeForm
          onSuccess={() => {
            setShowForm(false);
            fetchTrades();
          }}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* KPI */}
      <div className="glass-card flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-400">Net P&L</p>
          <h2
            className={`text-xl font-semibold ${
              totalPnL >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            ₹ {totalPnL}
          </h2>
        </div>

        {/* FILTER */}
        <select
          value={selectedStrategy}
          onChange={(e) => setSelectedStrategy(e.target.value)}
          className="border px-3 py-2 rounded text-sm"
        >
          <option value="ALL">All Strategies</option>
          {[...new Set(trades.map((t) => t.strategy).filter(Boolean))].map(
            (s: any) => (
              <option key={s} value={s}>
                {s}
              </option>
            )
          )}
        </select>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* EQUITY */}
        <div className="lg:col-span-2 glass-card">
          <h2 className="text-sm font-medium mb-2 text-gray-400">
            Equity Curve
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={equityData}>
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line
                dataKey="pnl"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* CALENDAR */}
        <div className="glass-card">
          <h2 className="text-sm font-medium mb-2 text-gray-400">
            Calendar
          </h2>
          <Calendar />
        </div>
      </div>

      {/* DAILY P&L */}
      <div className="glass-card">
        <h2 className="text-sm font-medium mb-2 text-gray-400">
          Daily P&L
        </h2>

        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={dailyData}>
            <XAxis dataKey="date" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Bar
              dataKey="pnl"
              fill="#22c55e"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* TABLE */}
      <div className="glass-card">
        <TradesTable trades={filteredTrades} onRefresh={fetchTrades} />
      </div>
    </div>
  );
}