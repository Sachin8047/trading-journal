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
};

export default function TradesTable({
  trades,
  onRefresh,
}: {
  trades: Trade[];
  onRefresh: () => void;
}) {
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  // ========================
  // 🗑 DELETE
  // ========================
  const handleDelete = async (id: string) => {
    await fetch(`/api/trades/${id}`, {
      method: "DELETE",
    });

    onRefresh(); // 🔥 IMPORTANT
  };

  // ========================
  // ✏️ UPDATE
  // ========================
  const handleUpdate = async () => {
    if (!editingTrade) return;

    await fetch("/api/trades", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingTrade),
    });

    setEditingTrade(null);
    onRefresh(); // 🔥 THIS FIXES YOUR ISSUE
  };

  return (
    <div className="overflow-x-auto">

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400">
            <th>Symbol</th>
            <th>Type</th>
            <th>Entry</th>
            <th>Exit</th>
            <th>Qty</th>
            <th>SL</th>
            <th>Strategy</th>
            <th>P&L</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {trades.map((t) => {
            const pnl =
              t.type === "BUY"
                ? (t.exitPrice - t.entryPrice) * t.quantity
                : (t.entryPrice - t.exitPrice) * t.quantity;

            return (
              <tr key={t.id} className="border-t">
                <td>{t.symbol}</td>
                <td>{t.type}</td>
                <td>{t.entryPrice}</td>
                <td>{t.exitPrice}</td>
                <td>{t.quantity}</td>
                <td>{t.stopLoss ?? "-"}</td>
                <td>{t.strategy ?? "-"}</td>

                <td
                  className={
                    pnl >= 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"
                  }
                >
                  ₹ {pnl}
                </td>

                <td className="space-x-2">
                  <button
                    onClick={() => setEditingTrade(t)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(t.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ========================
          EDIT MODAL
      ======================== */}
      {editingTrade && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[400px] space-y-3">

            <h2 className="font-semibold text-lg">Edit Trade</h2>

            <input
              className="w-full border p-2"
              value={editingTrade.symbol}
              onChange={(e) =>
                setEditingTrade({ ...editingTrade, symbol: e.target.value })
              }
            />

            <input
              type="number"
              className="w-full border p-2"
              value={editingTrade.entryPrice}
              onChange={(e) =>
                setEditingTrade({
                  ...editingTrade,
                  entryPrice: Number(e.target.value),
                })
              }
            />

            <input
              type="number"
              className="w-full border p-2"
              value={editingTrade.exitPrice}
              onChange={(e) =>
                setEditingTrade({
                  ...editingTrade,
                  exitPrice: Number(e.target.value),
                })
              }
            />

            <input
              type="number"
              className="w-full border p-2"
              value={editingTrade.quantity}
              onChange={(e) =>
                setEditingTrade({
                  ...editingTrade,
                  quantity: Number(e.target.value),
                })
              }
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingTrade(null)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}