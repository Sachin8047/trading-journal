"use client";

import { useEffect, useState } from "react";

type Trade = {
  id: string;
  symbol: string;
  type: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  createdAt: string;
};

export default function TradesTable({ refreshKey }: { refreshKey: number }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  // 📡 Fetch trades
  const fetchTrades = async () => {
    try {
      const res = await fetch("/api/trades");
      const data = await res.json();

      console.log("FETCHED TRADES:", data); // debug

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
  }, [refreshKey]);

  // 🌀 Loading state
  if (loading) {
    return (
      <div className="text-center py-10 text-gray-400">
        Loading trades...
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4">📊 Trades</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400">
              <th className="p-2">Symbol</th>
              <th className="p-2">Type</th>
              <th className="p-2">Entry</th>
              <th className="p-2">Exit</th>
              <th className="p-2">Qty</th>
              <th className="p-2">P&L</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>

          <tbody>
            {trades.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No trades yet
                </td>
              </tr>
            ) : (
              trades.map((t) => {
                const pnl =
                  t.type === "BUY"
                    ? (t.exitPrice - t.entryPrice) * t.quantity
                    : (t.entryPrice - t.exitPrice) * t.quantity;

                return (
                  <tr
                    key={t.id}
                    className="border-b border-gray-800 hover:bg-gray-800 transition"
                  >
                    <td className="p-2">{t.symbol}</td>

                    <td
                      className={`p-2 font-semibold ${
                        t.type === "BUY"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {t.type}
                    </td>

                    <td className="p-2">₹ {t.entryPrice}</td>
                    <td className="p-2">₹ {t.exitPrice}</td>
                    <td className="p-2">{t.quantity}</td>

                    <td
                      className={`p-2 font-semibold ${
                        pnl >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      ₹ {pnl}
                    </td>

                    <td className="p-2 text-gray-400">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}