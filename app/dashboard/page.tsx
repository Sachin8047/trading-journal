"use client";

import { useEffect, useState } from "react";
import TradesTable from "./trades-table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrades = () => {
    fetch("/api/trades")
      .then((res) => res.json())
      .then((data) => {
        setTrades(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  // ✅ Profit logic
  const profits = trades.map((t) =>
    t.type === "BUY"
      ? (t.exitPrice - t.entryPrice) * t.quantity
      : (t.entryPrice - t.exitPrice) * t.quantity
  );

  // 📊 Metrics
  const totalTrades = trades.length;
  const netPL = profits.reduce((a, b) => a + b, 0);

  const wins = profits.filter((p) => p > 0);
  const losses = profits.filter((p) => p < 0);

  const winRate = totalTrades
    ? ((wins.length / totalTrades) * 100).toFixed(1)
    : "0";

  // 📈 Equity Curve
  let cumulative = 0;
  const equityData = profits.map((p, i) => {
    cumulative += p;
    return { trade: i + 1, equity: cumulative };
  });

  // 📊 Daily P&L
  const dailyMap: any = {};

  trades.forEach((t) => {
    const date = new Date(t.createdAt).toLocaleDateString();

    const pnl =
      t.type === "BUY"
        ? (t.exitPrice - t.entryPrice) * t.quantity
        : (t.entryPrice - t.exitPrice) * t.quantity;

    if (!dailyMap[date]) dailyMap[date] = 0;
    dailyMap[date] += pnl;
  });

  const dailyData = Object.keys(dailyMap).map((date) => ({
    date,
    pnl: dailyMap[date],
  }));

  // 🥧 Pie
  const pieData = [
    { name: "Wins", value: wins.length },
    { name: "Losses", value: losses.length },
  ];

  // 🔥 Advanced Analytics
  let currentWinStreak = 0;
  let maxWinStreak = 0;
  let currentLossStreak = 0;
  let maxLossStreak = 0;

  profits.forEach((p) => {
    if (p > 0) {
      currentWinStreak++;
      currentLossStreak = 0;
    } else if (p < 0) {
      currentLossStreak++;
      currentWinStreak = 0;
    }

    maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
    maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
  });

  const avgWin =
    wins.length > 0
      ? (wins.reduce((a, b) => a + b, 0) / wins.length).toFixed(2)
      : "0";

  const avgLoss =
    losses.length > 0
      ? (losses.reduce((a, b) => a + b, 0) / losses.length).toFixed(2)
      : "0";

  const profitFactor =
    losses.length > 0
      ? (
          wins.reduce((a, b) => a + b, 0) /
          Math.abs(losses.reduce((a, b) => a + b, 0))
        ).toFixed(2)
      : "0";

  const bestDay =
    dailyData.length > 0
      ? dailyData.reduce((best, curr) =>
          curr.pnl > best.pnl ? curr : best
        )
      : null;

  // 📊 Strategy Analytics
  const strategyMap: any = {};

  trades.forEach((t) => {
    const strategy = t.strategy || "No Strategy";

    const pnl =
      t.type === "BUY"
        ? (t.exitPrice - t.entryPrice) * t.quantity
        : (t.entryPrice - t.exitPrice) * t.quantity;

    if (!strategyMap[strategy]) {
      strategyMap[strategy] = {
        trades: 0,
        pnl: 0,
        wins: 0,
      };
    }

    strategyMap[strategy].trades++;
    strategyMap[strategy].pnl += pnl;

    if (pnl > 0) strategyMap[strategy].wins++;
  });

  const strategyData = Object.keys(strategyMap).map((key) => ({
    name: key,
    trades: strategyMap[key].trades,
    pnl: strategyMap[key].pnl,
    winRate: (
      (strategyMap[key].wins / strategyMap[key].trades) *
      100
    ).toFixed(1),
  }));

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <h1 className="text-2xl font-bold">📊 Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* METRICS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card title="Total Trades" value={totalTrades} />
            <Card title="Net P&L" value={`₹ ${netPL}`} />
            <Card title="Win Rate" value={`${winRate}%`} />
            <Card
              title="Wins / Losses"
              value={`${wins.length} / ${losses.length}`}
            />
          </div>

          {/* EQUITY */}
          <ChartCard title="Equity Curve 📈">
            <LineChart data={equityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="trade" />
              <YAxis />
              <Tooltip />
              <Line dataKey="equity" stroke="#6366f1" />
            </LineChart>
          </ChartCard>

          {/* DAILY */}
          <ChartCard title="Daily P&L 📊">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pnl" fill="#22c55e" />
            </BarChart>
          </ChartCard>

          {/* PIE */}
          <ChartCard title="Win vs Loss 🥧">
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100} label>
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
              </Pie>
              <Legend />
            </PieChart>
          </ChartCard>

          {/* ADVANCED */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card title="Max Win Streak 🔥" value={maxWinStreak} />
            <Card title="Max Loss Streak ⚠️" value={maxLossStreak} />
            <Card title="Avg Win 💰" value={`₹ ${avgWin}`} />
            <Card title="Avg Loss 📉" value={`₹ ${avgLoss}`} />
            <Card title="Profit Factor 📊" value={profitFactor} />
            <Card
              title="Best Day 🧠"
              value={
                bestDay ? `${bestDay.date} (₹${bestDay.pnl})` : "N/A"
              }
            />
          </div>

          {/* STRATEGY */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border dark:border-gray-700">
            <h2 className="font-bold mb-4">Strategy Performance 📊</h2>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Strategy</th>
                  <th className="p-2 text-left">Trades</th>
                  <th className="p-2 text-left">P&L</th>
                  <th className="p-2 text-left">Win Rate</th>
                </tr>
              </thead>

              <tbody>
                {strategyData.map((s: any, i: number) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{s.name}</td>
                    <td className="p-2">{s.trades}</td>
                    <td
                      className={`p-2 font-bold ${
                        s.pnl >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      ₹ {s.pnl}
                    </td>
                    <td className="p-2">{s.winRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TABLE */}
          <TradesTable trades={trades} refresh={fetchTrades} />
        </>
      )}
    </div>
  );
}

// 📦 Card
function Card({ title, value }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

// 📊 Chart Wrapper
function ChartCard({ title, children }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border dark:border-gray-700">
      <h2 className="font-bold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}