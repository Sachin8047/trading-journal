"use client";

import { useEffect, useState } from "react";

export default function TradesTable({ trades }: any) {
  const [data, setData] = useState(trades || []);

  useEffect(() => {
    setData(trades || []);
  }, [trades]);

  // 🗑 DELETE FUNCTION
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this trade?")) return;

    await fetch(`/api/trades/${id}`, {
      method: "DELETE",
    });

    setData((prev: any) => prev.filter((t: any) => t.id !== id));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
      <h2 className="mb-4 font-semibold">Trades</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th>Symbol</th>
            <th>Type</th>
            <th>Entry</th>
            <th>Exit</th>
            <th>Qty</th>
            <th>P&L</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((t: any) => {
            const pnl =
              t.type === "BUY"
                ? (t.exitPrice - t.entryPrice) * t.quantity
                : (t.entryPrice - t.exitPrice) * t.quantity;

            return (
              <tr key={t.id} className="border-b">
                <td>{t.symbol}</td>
                <td>{t.type}</td>
                <td>{t.entryPrice}</td>
                <td>{t.exitPrice}</td>
                <td>{t.quantity}</td>
                <td
                  className={
                    pnl >= 0 ? "text-green-500" : "text-red-500"
                  }
                >
                  {pnl}
                </td>

                {/* 🔥 ACTION BUTTONS */}
                <td className="space-x-2">
                  <button
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                    onClick={() => alert("Edit feature next step 😉")}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(t.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}