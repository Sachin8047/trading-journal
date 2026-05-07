"use client";

import { useState } from "react";

type Trade = {
  id: string;
  symbol: string;
  type: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  stopLoss?: number | null;
  strategy?: string | null;
  notes?: string | null;
};

type Props = {
  trades: Trade[];
  onRefresh?: () => void; // 🔥 important
};

export default function TradesTable({ trades, onRefresh }: Props) {
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  const calculatePnL = (t: Trade) => {
    return t.type === "BUY"
      ? (t.exitPrice - t.entryPrice) * t.quantity
      : (t.entryPrice - t.exitPrice) * t.quantity;
  };

  // ❌ DELETE
  const deleteTrade = async (id: string) => {
    await fetch(`/api/trades?id=${id}`, { method: "DELETE" });
    onRefresh?.();
  };

  // 💾 SAVE EDIT
  const saveEdit = async () => {
    if (!editingTrade) return;

    await fetch("/api/trades", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingTrade),
    });

    setEditingTrade(null);
    onRefresh?.();
  };

  return (
    <>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Symbol</th>
            <th>Type</th>
            <th>Entry</th>
            <th>Exit</th>
            <th>Qty</th>
            <th>Stop Loss</th>
            <th>Strategy</th>
            <th>Notes</th>
            <th>P&L</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {trades.map((t) => (
            <tr key={t.id} className="text-center border-t">
              <td>{t.symbol}</td>
              <td>{t.type}</td>
              <td>{t.entryPrice}</td>
              <td>{t.exitPrice}</td>
              <td>{t.quantity}</td>

              <td>{t.stopLoss ?? "-"}</td>
              <td>{t.strategy ?? "-"}</td>
              <td>{t.notes ?? "-"}</td>

              <td
                className={
                  calculatePnL(t) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {calculatePnL(t)}
              </td>

              <td className="space-x-2">
                <button
                  onClick={() => setEditingTrade(t)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTrade(t.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✏️ EDIT MODAL */}
      {editingTrade && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[400px]">
            <h2 className="text-lg font-bold mb-4">Edit Trade</h2>

            <input
              className="border p-2 w-full mb-2"
              value={editingTrade.symbol}
              onChange={(e) =>
                setEditingTrade({
                  ...editingTrade,
                  symbol: e.target.value,
                })
              }
            />

            <select
              className="border p-2 w-full mb-2"
              value={editingTrade.type}
              onChange={(e) =>
                setEditingTrade({
                  ...editingTrade,
                  type: e.target.value,
                })
              }
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>

            <input
              type="number"
              className="border p-2 w-full mb-2"
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
              className="border p-2 w-full mb-2"
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
              className="border p-2 w-full mb-2"
              value={editingTrade.quantity}
              onChange={(e) =>
                setEditingTrade({
                  ...editingTrade,
                  quantity: Number(e.target.value),
                })
              }
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setEditingTrade(null)}
                className="bg-gray-400 px-3 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}