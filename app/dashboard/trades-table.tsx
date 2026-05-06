"use client";

import { useState } from "react";

export default function TradesTable({ trades, refresh }: any) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<any | null>(null);

  // ❌ Delete trade
  const deleteTrade = async (id: string) => {
    setLoadingId(id);

    await fetch(`/api/trades/${id}`, {
      method: "DELETE",
    });

    setLoadingId(null);
    refresh();
  };

  // ✏️ Start editing
  const onEdit = (trade: any) => {
    setEditing(trade);
  };

  // 💾 Save edited trade
  const saveEdit = async () => {
    await fetch(`/api/trades/${editing.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editing),
    });

    setEditing(null);
    refresh();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">
      <h2 className="text-lg font-bold mb-4">Trade History 📋</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Symbol</th>
              <th className="p-2">Type</th>
              <th className="p-2">Entry</th>
              <th className="p-2">Exit</th>
              <th className="p-2">Qty</th>
              <th className="p-2">P&L</th>
              <th className="p-2">Date</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {trades.map((t: any) => {
              const pnl =
                t.type === "BUY"
                  ? (t.exitPrice - t.entryPrice) * t.quantity
                  : (t.entryPrice - t.exitPrice) * t.quantity;

              return (
                <tr key={t.id} className="border-b">
                  <td className="p-2">{t.symbol}</td>
                  <td className="p-2">{t.type}</td>
                  <td className="p-2">{t.entryPrice}</td>
                  <td className="p-2">{t.exitPrice}</td>
                  <td className="p-2">{t.quantity}</td>

                  <td
                    className={`p-2 font-bold ${
                      pnl >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ₹ {pnl}
                  </td>

                  <td className="p-2">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => onEdit(t)}
                      className="text-blue-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteTrade(t.id)}
                      className="text-red-500"
                    >
                      {loadingId === t.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ✏️ EDIT FORM */}
      {editing && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="font-bold mb-3">Edit Trade ✏️</h3>

          <div className="grid grid-cols-2 gap-2">
            <input
              value={editing.symbol}
              onChange={(e) =>
                setEditing({ ...editing, symbol: e.target.value })
              }
              className="border p-2"
              placeholder="Symbol"
            />

            <select
              value={editing.type}
              onChange={(e) =>
                setEditing({ ...editing, type: e.target.value })
              }
              className="border p-2"
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>

            <input
              value={editing.entryPrice}
              onChange={(e) =>
                setEditing({ ...editing, entryPrice: e.target.value })
              }
              className="border p-2"
              placeholder="Entry"
            />

            <input
              value={editing.exitPrice}
              onChange={(e) =>
                setEditing({ ...editing, exitPrice: e.target.value })
              }
              className="border p-2"
              placeholder="Exit"
            />

            <input
              value={editing.quantity}
              onChange={(e) =>
                setEditing({ ...editing, quantity: e.target.value })
              }
              className="border p-2"
              placeholder="Quantity"
            />

            <input
              value={editing.stopLoss}
              onChange={(e) =>
                setEditing({ ...editing, stopLoss: e.target.value })
              }
              className="border p-2"
              placeholder="Stop Loss"
            />

            <input
              value={editing.strategy || ""}
              onChange={(e) =>
                setEditing({ ...editing, strategy: e.target.value })
              }
              className="border p-2 col-span-2"
              placeholder="Strategy"
            />

            <textarea
              value={editing.notes || ""}
              onChange={(e) =>
                setEditing({ ...editing, notes: e.target.value })
              }
              className="border p-2 col-span-2"
              placeholder="Notes"
            />
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={saveEdit}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Save
            </button>

            <button
              onClick={() => setEditing(null)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}