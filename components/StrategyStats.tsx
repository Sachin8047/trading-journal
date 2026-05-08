"use client";

type Trade = {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  strategy?: string | null;
};

export default function StrategyStats({ trades }: { trades: Trade[] }) {
  const stats: Record<
    string,
    { pnl: number; total: number; wins: number }
  > = {};

  trades.forEach((t) => {
    const strategy = t.strategy || "No Strategy";

    const pnl =
      t.type === "BUY"
        ? (t.exitPrice - t.entryPrice) * t.quantity
        : (t.entryPrice - t.exitPrice) * t.quantity;

    if (!stats[strategy]) {
      stats[strategy] = { pnl: 0, total: 0, wins: 0 };
    }

    stats[strategy].pnl += pnl;
    stats[strategy].total += 1;
    if (pnl > 0) stats[strategy].wins += 1;
  });

  return (
    <div className="glass-card space-y-3">
      <h2 className="font-semibold text-lg">📊 Strategy Performance</h2>

      {Object.entries(stats).map(([strategy, data]) => {
        const winRate =
          data.total > 0 ? (data.wins / data.total) * 100 : 0;

        return (
          <div
            key={strategy}
            className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 space-y-1"
          >
            <div className="flex justify-between">
              <span className="font-medium">{strategy}</span>
              <span
                className={
                  data.pnl >= 0
                    ? "text-green-500 font-semibold"
                    : "text-red-500 font-semibold"
                }
              >
                ₹ {data.pnl.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <span>Trades: {data.total}</span>
              <span>Win Rate: {winRate.toFixed(1)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}