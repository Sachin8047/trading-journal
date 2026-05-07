"use client";

type Trade = {
  type: "BUY" | "SELL";
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  strategy?: string | null;
};

export default function StrategySummary({ trades }: { trades: Trade[] }) {
  const strategyMap: Record<
    string,
    { pnl: number; total: number; wins: number }
  > = {};

  trades.forEach((t) => {
    const strategy = t.strategy || "No Strategy";

    const pnl =
      t.type === "BUY"
        ? (t.exitPrice - t.entryPrice) * t.quantity
        : (t.entryPrice - t.exitPrice) * t.quantity;

    if (!strategyMap[strategy]) {
      strategyMap[strategy] = { pnl: 0, total: 0, wins: 0 };
    }

    strategyMap[strategy].pnl += pnl;
    strategyMap[strategy].total += 1;
    if (pnl > 0) strategyMap[strategy].wins += 1;
  });

  return (
    <div className="glass-card space-y-3">
      <h2 className="font-semibold text-lg">📊 Strategy Performance</h2>

      {Object.entries(strategyMap).map(([name, data]) => {
        const winRate =
          data.total > 0 ? (data.wins / data.total) * 100 : 0;

        return (
          <div
            key={name}
            className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:scale-[1.02] transition"
          >
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-xs text-gray-400">
                {data.total} trades
              </p>
            </div>

            <div className="text-right">
              <p
                className={
                  data.pnl >= 0
                    ? "text-green-500 font-medium"
                    : "text-red-500 font-medium"
                }
              >
                ₹ {data.pnl.toFixed(2)}
              </p>

              <p className="text-xs text-gray-400">
                {winRate.toFixed(0)}% win
              </p>
            </div>
          </div>
        );
      })}

      {Object.keys(strategyMap).length === 0 && (
        <p className="text-sm text-gray-400">No data</p>
      )}
    </div>
  );
}