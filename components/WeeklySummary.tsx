"use client";

type Trade = {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  strategy?: string | null;
  createdAt?: string; // ✅ match your DB
};

export default function WeeklySummary({ trades }: { trades: Trade[] }) {
  const weeklyData: Record<string, number> = {};
  const monthlyData: Record<string, number> = {};
  const yearlyData: Record<string, number> = {};

  trades.forEach((t) => {
    const date = new Date(t.createdAt || Date.now());

    const pnl =
      t.type === "BUY"
        ? (t.exitPrice - t.entryPrice) * t.quantity
        : (t.entryPrice - t.exitPrice) * t.quantity;

    // =========================
    // 📊 WEEKLY
    // =========================
    const week = Math.ceil(date.getDate() / 7);
    const weekKey = `Week ${week}`;
    weeklyData[weekKey] = (weeklyData[weekKey] || 0) + pnl;

    // =========================
    // 📅 MONTHLY
    // =========================
    const monthKey = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    }); // e.g. May 2026
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + pnl;

    // =========================
    // 📈 YEARLY
    // =========================
    const yearKey = `${date.getFullYear()}`;
    yearlyData[yearKey] = (yearlyData[yearKey] || 0) + pnl;
  });

  // 🔥 reusable UI
  const renderSection = (title: string, data: Record<string, number>) => (
    <div className="glass-card space-y-3">
      <h2 className="font-semibold text-lg">{title}</h2>

      {Object.keys(data).length === 0 && (
        <p className="text-sm text-gray-400">No data</p>
      )}

      {Object.entries(data).map(([key, pnl]) => (
        <div
          key={key}
          className="flex justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:scale-[1.02] transition"
        >
          <span>{key}</span>

          <span
            className={
              pnl >= 0
                ? "text-green-500 font-medium"
                : "text-red-500 font-medium"
            }
          >
            ₹ {pnl.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {renderSection("📊 Weekly Summary", weeklyData)}
      {renderSection("📅 Monthly Summary", monthlyData)}
      {renderSection("📈 Yearly Summary", yearlyData)}
    </div>
  );
}