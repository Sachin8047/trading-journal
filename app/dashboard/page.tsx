"use client";

import { useEffect, useState } from "react";
import TradesTable from "@/components/TradesTable";
import TradeForm from "@/components/TradeForm";
import PNLCalendar from "@/components/PNLCalendar";
import WeeklySummary from "@/components/WeeklySummary";
import TradingChart from "@/components/TradingChart";
import StrategySummary from "@/components/StrategySummary";

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

  // ✅ STRATEGY FILTER
  const [selectedStrategy, setSelectedStrategy] = useState("ALL");

  // 🔥 SYMBOL FILTER
  const [selectedSymbol, setSelectedSymbol] = useState("RELIANCE.NS");

  // =========================
  // FETCH TRADES
  // =========================
  const fetchTrades = async () => {
    const res = await fetch("/api/trades");
    const data = await res.json();
    setTrades(data || []);
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  // =========================
  // STRATEGY LIST (AUTO)
  // =========================
  const strategies = [
    "ALL",
    ...new Set(trades.map((t) => t.strategy).filter(Boolean)),
  ];

  // =========================
  // FILTER
  // =========================
  const filteredTrades =
    selectedStrategy === "ALL"
      ? trades
      : trades.filter((t) => t.strategy === selectedStrategy);

  // =========================
  // KPI CALCULATIONS
  // =========================
  const totalTrades = filteredTrades.length;

  const tradePnls = filteredTrades.map((t) =>
    t.type === "BUY"
      ? (t.exitPrice - t.entryPrice) * t.quantity
      : (t.entryPrice - t.exitPrice) * t.quantity
  );

  const totalPnl = tradePnls.reduce((acc, val) => acc + val, 0);

  const wins = tradePnls.filter((p) => p > 0).length;
  const winRate = totalTrades
    ? ((wins / totalTrades) * 100).toFixed(1)
    : "0";

  const avgPnl = totalTrades ? totalPnl / totalTrades : 0;

  // =========================
  // EQUITY CURVE
  // =========================
  let running = 0;
  const equityData = tradePnls.map((p, i) => {
    running += p;
    return { name: `T${i + 1}`, pnl: running };
  });

  // =========================
  // DAILY P&L
  // =========================
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

  // =========================
  // UI
  // =========================
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">📊 Dashboard</h1>
          <p className="text-sm text-gray-400">
            Track your performance
          </p>
        </div>

        <div className="flex gap-3 items-center">
          {/* 🔥 STRATEGY DROPDOWN */}
          <select
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm bg-white dark:bg-gray-900"
          >
            {strategies.map((s: any) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            + Add Trade
          </button>
        </div>
      </div>

      {/* FORM */}
      {showForm && (
        <TradeForm
          onSuccess={() => {
            setShowForm(false);
            fetchTrades();
          }}
        />
      )}

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-card">
          <p className="text-sm text-gray-400">Net P&L</p>
          <h2
            className={`text-xl font-semibold ${
              totalPnl >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            ₹ {totalPnl.toFixed(2)}
          </h2>
        </div>

        <div className="glass-card">
          <p className="text-sm text-gray-400">Total Trades</p>
          <h2 className="text-xl font-semibold">{totalTrades}</h2>
        </div>

        <div className="glass-card">
          <p className="text-sm text-gray-400">Wins</p>
          <h2 className="text-xl font-semibold text-green-500">
            {wins}
          </h2>
        </div>

        <div className="glass-card">
          <p className="text-sm text-gray-400">Win Rate</p>
          <h2 className="text-xl font-semibold text-blue-500">
            {winRate}%
          </h2>
        </div>

        <div className="glass-card">
          <p className="text-sm text-gray-400">Avg P&L</p>
          <h2 className="text-xl font-semibold">
            ₹ {avgPnl.toFixed(2)}
          </h2>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* CHART */}
          <div className="glass-card">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-medium">
                📈 Trade Chart
              </h2>

              <select
                value={selectedSymbol}
                onChange={(e) =>
                  setSelectedSymbol(e.target.value)
                }
                className="border px-2 py-1 rounded text-sm"
              >
                <option value="RELIANCE.NS">RELIANCE</option>
                <option value="TCS.NS">TCS</option>
                <option value="INFY.NS">INFY</option>
                <option value="HDFCBANK.NS">HDFC BANK</option>
              </select>
            </div>

            <TradingChart
              trades={filteredTrades}
              symbol={selectedSymbol}
            />
          </div>

          {/* EQUITY */}
          <div className="glass-card">
            <h2 className="text-sm font-medium mb-2">
              Equity Curve
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={equityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line dataKey="pnl" stroke="#22c55e" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* DAILY */}
          <div className="glass-card">
            <h2 className="text-sm font-medium mb-2">
              Daily P&L
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pnl" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* TABLE */}
          <div className="glass-card">
            <TradesTable
              trades={filteredTrades}
              onRefresh={fetchTrades}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div className="glass-card">
            <h2 className="text-sm font-medium mb-2">
              📅 Calendar
            </h2>
            <PNLCalendar trades={filteredTrades} />
          </div>

          <div className="glass-card">
            <h2 className="text-sm font-medium mb-2">
              📊 Summary
            </h2>

            <div className="space-y-4">
              <WeeklySummary trades={filteredTrades} />
              <StrategySummary trades={filteredTrades} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}