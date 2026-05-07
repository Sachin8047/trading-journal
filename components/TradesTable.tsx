"use client";

import { useState } from "react";

export default function TradesTable({ trades, onRefresh }: any) {
  const [editingTrade, setEditingTrade] = useState<any>(null);

  // ✅ DATE FORMAT FUNCTION (dd-mm-yy)
  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
      .replace(/\//g, "-");
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/trades/${id}`, { method: "DELETE" });
    onRefresh();
  };

  const handleUpdate = async () => {
    await fetch(`/api/trades/${editingTrade.id}`, {
      method: "PUT",
      body: JSON.stringify(editingTrade),
    });

    setEditingTrade(null);
    onRefresh();
  };

  return (
    <div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400">
            <th>Symbol</th>
            <th>Type</th>
            <th>Entry</th>
            <th>Exit</th>
            <th>Qty</th>
            <th>SL</th>
            <th>TP</th>
            <th>Strategy</th>
            <th>Date</th> {/* ✅ NEW */}
            <th>P&L</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {trades.map((t: any) => {
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

                {/* TP */}
                <td>
                  {t.tpLevels?.length ? t.tpLevels.join(", ") : "-"}
                </td>

                <td>{t.strategy ?? "-"}</td>

                {/* ✅ DATE DISPLAY */}
                <td>{formatDate(t.createdAt)}</td>

                {/* P&L */}
                <td
                  className={
                    pnl >= 0
                      ? "text-green-500 font-medium"
                      : "text-red-500 font-medium"
                  }
                >
                  ₹ {pnl.toFixed(2)}
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

      {/* =======================
          EDIT MODAL
      ======================= */}
      {editingTrade && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[400px] space-y-3">
            <h2 className="font-semibold text-lg">Edit Trade</h2>

            <input
              className="w-full border p-2"
              value={editingTrade.symbol}
              onChange={(e) =>
                setEditingTrade({
                  ...editingTrade,
                  symbol: e.target.value,
                })
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

            {/* STOP LOSS */}
            <input
              type="number"
              className="w-full border p-2"
              value={editingTrade.stopLoss || ""}
              onChange={(e) =>
                setEditingTrade({
                  ...editingTrade,
                  stopLoss: Number(e.target.value),
                })
              }
              placeholder="Stop Loss"
            />

            {/* TP EDIT */}
            <div>
              <p className="text-sm font-medium">Take Profit Levels</p>

              {(editingTrade.tpLevels || []).map(
                (tp: number, i: number) => (
                  <div key={i} className="flex gap-2 mt-1">
                    <input
                      type="number"
                      value={tp}
                      onChange={(e) => {
                        const updated = [...editingTrade.tpLevels];
                        updated[i] = Number(e.target.value);

                        setEditingTrade({
                          ...editingTrade,
                          tpLevels: updated,
                        });
                      }}
                      className="border p-1 w-full"
                    />
                    <button
                      onClick={() => {
                        const updated =
                          editingTrade.tpLevels.filter(
                            (_: any, idx: number) => idx !== i
                          );
                        setEditingTrade({
                          ...editingTrade,
                          tpLevels: updated,
                        });
                      }}
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                )
              )}

              <button
                onClick={() =>
                  setEditingTrade({
                    ...editingTrade,
                    tpLevels: [
                      ...(editingTrade.tpLevels || []),
                      0,
                    ],
                  })
                }
                className="text-green-600 text-sm mt-2"
              >
                + Add TP
              </button>
            </div>

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