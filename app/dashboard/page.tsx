"use client";

import { useEffect, useState } from "react";
import TradesTable from "@/components/TradesTable";
import PNLCalendar from "@/components/PNLCalendar";
import WeeklySummary from "@/components/WeeklySummary";
import StrategyStats from "@/components/StrategyStats";

type Trade = {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  stopLoss?: number;
  strategy?: string | null;
  createdAt?: string;
};

export default function DashboardPage() {
  const [trades, setTrades] = useState<Trade[]>([]);

  const [selectedStrategy, setSelectedStrategy] = useState("ALL");
  const [selectedSymbol, setSelectedSymbol] = useState("ALL");

  const fetchTrades = async () => {
    const res = await fetch("/api/trades");
    const data = await res.json();
    setTrades(data || []);
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  // FILTERED TRADES
  const filteredTrades = trades.filter((t) => {
    return (
      (selectedStrategy === "ALL" || t.strategy === selectedStrategy) &&
      (selectedSymbol === "ALL" || t.symbol === selectedSymbol)
    );
  });

  // CALCULATIONS
  let totalPnl = 0;
  let wins = 0;

  filteredTrades.forEach((t) => {
    const pnl =
      t.type === "BUY"
        ? (t.exitPrice - t.entryPrice) * t.quantity
        : (t.entryPrice - t.exitPrice) * t.quantity;

    totalPnl += pnl;

    if (pnl > 0) wins++;
  });

  const totalTrades = filteredTrades.length;

  const winRate =
    totalTrades > 0
      ? ((wins / totalTrades) * 100).toFixed(1)
      : "0";

  const avgPnl =
    totalTrades > 0
      ? (totalPnl / totalTrades).toFixed(2)
      : "0";

  // BEST / WORST STRATEGY
  const strategyMap: any = {};

  filteredTrades.forEach((trade) => {
    const strategy = trade.strategy || "No Strategy";

    const pnl =
      trade.type === "BUY"
        ? (trade.exitPrice - trade.entryPrice) * trade.quantity
        : (trade.entryPrice - trade.exitPrice) * trade.quantity;

    if (!strategyMap[strategy]) {
      strategyMap[strategy] = 0;
    }

    strategyMap[strategy] += pnl;
  });

  const strategyEntries = Object.entries(strategyMap);

  const bestStrategy =
    strategyEntries.length > 0
      ? strategyEntries.reduce((a: any, b: any) =>
          a[1] > b[1] ? a : b
        )
      : null;

  const worstStrategy =
    strategyEntries.length > 0
      ? strategyEntries.reduce((a: any, b: any) =>
          a[1] < b[1] ? a : b
        )
      : null;

  // FILTER OPTIONS
  const strategies = [
    "ALL",
    ...new Set(trades.map((t) => t.strategy).filter(Boolean)),
  ];

  const symbols = [
    "ALL",
    ...new Set(trades.map((t) => t.symbol)),
  ];

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="dashboard-title">
            📊 Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Track your trading performance
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex gap-3">

          <div>
            <p className="text-xs text-gray-500 mb-1">
              Strategy
            </p>

            <select
              value={selectedStrategy}
              onChange={(e) =>
                setSelectedStrategy(e.target.value)
              }
              className="input"
            >
              {strategies.map((strategy) => (
                <option key={strategy} value={strategy}>
                  {strategy}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">
              Symbol
            </p>

            <select
              value={selectedSymbol}
              onChange={(e) =>
                setSelectedSymbol(e.target.value)
              }
              className="input"
            >
              {symbols.map((symbol) => (
                <option key={symbol} value={symbol}>
                  {symbol}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="glass-card">
          <p className="text-sm text-gray-500 font-medium">
            Net P&L
          </p>

          <h2
            className={`text-3xl font-bold mt-2 ${
              totalPnl >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            ₹ {totalPnl.toFixed(2)}
          </h2>
        </div>

        <div className="glass-card">
          <p className="text-sm text-gray-500 font-medium">
            Total Trades
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {totalTrades}
          </h2>
        </div>

        <div className="glass-card">
          <p className="text-sm text-gray-500 font-medium">
            Win Rate
          </p>

          <h2 className="text-3xl font-bold text-blue-500 mt-2">
            {winRate}%
          </h2>
        </div>

        <div className="glass-card">
          <p className="text-sm text-gray-500 font-medium">
            Avg P&L
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹ {avgPnl}
          </h2>
        </div>

      </div>

      {/* BEST & WORST STRATEGY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="glass-card">
          <p className="text-sm text-gray-500 font-medium">
            🏆 Best Strategy
          </p>

          <h2 className="text-2xl font-bold text-green-500 mt-2">
            {bestStrategy?.[0] || "-"}
          </h2>

          <p className="mt-1 text-lg font-semibold">
            ₹ {bestStrategy?.[1]?.toFixed(2) || "0"}
          </p>
        </div>

        <div className="glass-card">
          <p className="text-sm text-gray-500 font-medium">
            ⚠️ Worst Strategy
          </p>

          <h2 className="text-2xl font-bold text-red-500 mt-2">
            {worstStrategy?.[0] || "-"}
          </h2>

          <p className="mt-1 text-lg font-semibold">
            ₹ {worstStrategy?.[1]?.toFixed(2) || "0"}
          </p>
        </div>

      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

        {/* LEFT */}
        <div className="xl:col-span-2 space-y-6">

          {/* STRATEGY STATS */}
          <StrategyStats trades={filteredTrades} />

          {/* TABLE */}
          <div className="glass-card p-0 overflow-hidden">
            <TradesTable
              trades={filteredTrades}
              onRefresh={fetchTrades}
            />
          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          <div className="glass-card">
            <PNLCalendar trades={filteredTrades} />
          </div>

          <div className="glass-card">
            <WeeklySummary trades={filteredTrades} />
          </div>

        </div>

      </div>
    </div>
  );
}