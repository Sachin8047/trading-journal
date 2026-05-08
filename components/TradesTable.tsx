"use client";

import { useState } from "react";

export default function TradesTable({ trades, onRefresh }: any) {
  const [editingTrade, setEditingTrade] = useState<any>(null);

  // DATE FORMAT
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

  // DELETE
  const handleDelete = async (id: string) => {
    await fetch(`/api/trades/${id}`, {
      method: "DELETE",
    });

    onRefresh();
  };

  // UPDATE
  const handleUpdate = async () => {
    await fetch(`/api/trades/${editingTrade.id}`, {
      method: "PUT",
      body: JSON.stringify(editingTrade),
    });

    setEditingTrade(null);
    onRefresh();
  };

  return (
    <div className="glass-card overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">

        <div>
          <h2 className="text-2xl font-bold">
            📋 All Trades
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Manage and review your trading history
          </p>
        </div>

        <div className="text-sm text-gray-500">
          Total Trades:{" "}
          <span className="font-bold text-black">
            {trades.length}
          </span>
        </div>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">

        <table className="w-full min-w-[950px]">

          {/* HEAD */}
          <thead className="bg-gray-50 border-b border-gray-200">

            <tr className="text-left text-sm text-gray-500 uppercase tracking-wide">

              <th className="px-4 py-4">Symbol</th>
              <th className="px-4 py-4">Type</th>
              <th className="px-4 py-4">Entry</th>
              <th className="px-4 py-4">Exit</th>
              <th className="px-4 py-4">Qty</th>
              <th className="px-4 py-4">SL</th>
              <th className="px-4 py-4">TP</th>
              <th className="px-4 py-4">Strategy</th>
              <th className="px-4 py-4">Date</th>
              <th className="px-4 py-4">P&L</th>
              <th className="px-4 py-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          {/* BODY */}
          <tbody>

            {trades.map((t: any, index: number) => {
              const pnl =
                t.type === "BUY"
                  ? (t.exitPrice - t.entryPrice) * t.quantity
                  : (t.entryPrice - t.exitPrice) * t.quantity;

              return (
                <tr
                  key={t.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50/40"
                  }`}
                >

                  {/* SYMBOL */}
                  <td className="px-4 py-4 font-semibold">
                    {t.symbol}
                  </td>

                  {/* TYPE */}
                  <td className="px-4 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        t.type === "BUY"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {t.type}
                    </span>

                  </td>

                  {/* ENTRY */}
                  <td className="px-4 py-4 font-medium">
                    ₹ {t.entryPrice}
                  </td>

                  {/* EXIT */}
                  <td className="px-4 py-4 font-medium">
                    ₹ {t.exitPrice}
                  </td>

                  {/* QTY */}
                  <td className="px-4 py-4">
                    {t.quantity}
                  </td>

                  {/* SL */}
                  <td className="px-4 py-4">
                    {t.stopLoss ?? "-"}
                  </td>

                  {/* TP */}
                  <td className="px-4 py-4">
                    {t.tpLevels?.length
                      ? t.tpLevels.join(", ")
                      : "-"}
                  </td>

                  {/* STRATEGY */}
                  <td className="px-4 py-4">

                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      {t.strategy ?? "No Strategy"}
                    </span>

                  </td>

                  {/* DATE */}
                  <td className="px-4 py-4 text-gray-500 text-sm">
                    {formatDate(t.createdAt)}
                  </td>

                  {/* PNL */}
                  <td
                    className={`px-4 py-4 font-bold ${
                      pnl >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    ₹ {pnl.toFixed(2)}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-4">

                    <div className="flex items-center justify-center gap-2">

                      <button
                        onClick={() => setEditingTrade(t)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(t.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

      {/* =======================
          EDIT MODAL
      ======================= */}
      {editingTrade && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[500px] max-h-[90vh] overflow-y-auto">

            <h2 className="text-2xl font-bold mb-5">
              ✏️ Edit Trade
            </h2>

            <div className="space-y-4">

              <input
                className="input w-full"
                value={editingTrade.symbol}
                onChange={(e) =>
                  setEditingTrade({
                    ...editingTrade,
                    symbol: e.target.value,
                  })
                }
                placeholder="Symbol"
              />

              <input
                type="number"
                className="input w-full"
                value={editingTrade.entryPrice}
                onChange={(e) =>
                  setEditingTrade({
                    ...editingTrade,
                    entryPrice: Number(e.target.value),
                  })
                }
                placeholder="Entry Price"
              />

              <input
                type="number"
                className="input w-full"
                value={editingTrade.exitPrice}
                onChange={(e) =>
                  setEditingTrade({
                    ...editingTrade,
                    exitPrice: Number(e.target.value),
                  })
                }
                placeholder="Exit Price"
              />

              <input
                type="number"
                className="input w-full"
                value={editingTrade.quantity}
                onChange={(e) =>
                  setEditingTrade({
                    ...editingTrade,
                    quantity: Number(e.target.value),
                  })
                }
                placeholder="Quantity"
              />

              <input
                type="number"
                className="input w-full"
                value={editingTrade.stopLoss || ""}
                onChange={(e) =>
                  setEditingTrade({
                    ...editingTrade,
                    stopLoss: Number(e.target.value),
                  })
                }
                placeholder="Stop Loss"
              />

              {/* TP LEVELS */}
              <div>

                <p className="font-semibold mb-2">
                  Take Profit Levels
                </p>

                {(editingTrade.tpLevels || []).map(
                  (tp: number, i: number) => (
                    <div
                      key={i}
                      className="flex gap-2 mb-2"
                    >

                      <input
                        type="number"
                        value={tp}
                        onChange={(e) => {
                          const updated = [
                            ...editingTrade.tpLevels,
                          ];

                          updated[i] = Number(
                            e.target.value
                          );

                          setEditingTrade({
                            ...editingTrade,
                            tpLevels: updated,
                          });
                        }}
                        className="input flex-1"
                      />

                      <button
                        onClick={() => {
                          const updated =
                            editingTrade.tpLevels.filter(
                              (_: any, idx: number) =>
                                idx !== i
                            );

                          setEditingTrade({
                            ...editingTrade,
                            tpLevels: updated,
                          });
                        }}
                        className="text-red-500 font-bold"
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
                  className="text-green-600 font-medium text-sm"
                >
                  + Add TP
                </button>

              </div>

            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setEditingTrade(null)}
                className="px-4 py-2 border rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}