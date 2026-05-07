"use client";

import { useState } from "react";

type Trade = {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  stopLoss?: number | null;
  strategy?: string | null;
  notes?: string | null;
  entryTime?: string;
  exitTime?: string;
};

type Props = {
  trades: Trade[];
  onRefresh?: () => void; // ✅ FIXED (optional now)
};

export default function TradesTable({ trades, onRefresh }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // ✅ DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this trade?")) return;

    try {
      setLoadingId(id);

      const res = await fetch(`/api/trades/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      onRefresh?.(); // ✅ SAFE CALL
    } catch (err) {
      console.error(err);
      alert("Error deleting trade");
    } finally {
      setLoadingId(null);
    }
  };

  // ✅ CALCULATE P&L
  const calcPnL = (t: Trade) => {
    return t.type === "BUY"
      ? (t.exitPrice - t.entryPrice) * t.quantity
      : (t.entryPrice - t.exitPrice) * t.quantity;
  };

  return (
    <div className="overflow-x-auto">

      <table className="min-w-full text-sm">

        <thead>
          <tr className="border-b text-gray-400">
            <th className="p-2 text-left">Symbol</th>
            <th className="p-2">Type</th>
            <th className="p-2">Entry</th>
            <th className="p-2">Exit</th>
            <th className="p-2">Qty</th>
            <th className="p-2">SL</th>
            <th className="p-2">Strategy</th>
            <th className="p-2">Notes</th>
            <th className="p-2">P&L</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {trades.map((t) => {
            const pnl = calcPnL(t);

            return (
              <tr key={t.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">

                <td className="p-2">{t.symbol}</td>

                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      t.type === "BUY"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {t.type}
                  </span>
                </td>

                <td className="p-2">{t.entryPrice}</td>
                <td className="p-2">{t.exitPrice}</td>
                <td className="p-2">{t.quantity}</td>

                <td className="p-2">{t.stopLoss ?? "-"}</td>
                <td className="p-2">{t.strategy || "-"}</td>
                <td className="p-2">{t.notes || "-"}</td>

                <td
                  className={`p-2 font-semibold ${
                    pnl >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  ₹ {pnl}
                </td>

                <td className="p-2 space-x-2">

                  {/* EDIT (placeholder for now) */}
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => alert("Edit feature next step 😉")}
                  >
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(t.id)}
                    disabled={loadingId === t.id}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    {loadingId === t.id ? "Deleting..." : "Delete"}
                  </button>

                </td>

              </tr>
            );
          })}
        </tbody>

      </table>

      {/* EMPTY STATE */}
      {trades.length === 0 && (
        <p className="text-center py-4 text-gray-400">
          No trades yet
        </p>
      )}

    </div>
  );
}