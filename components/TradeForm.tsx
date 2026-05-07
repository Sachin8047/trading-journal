"use client";

import { useState } from "react";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function TradeForm({ onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    symbol: "",
    type: "BUY",
    entryPrice: "",
    exitPrice: "",
    quantity: "",
    stopLoss: "",
    strategy: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to save trade");
      }

      onSuccess(); // refresh table
    } catch (err) {
      console.error(err);
      alert("Error saving trade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      
      {/* Modal */}
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-xl w-full max-w-lg shadow-xl">
        
        <h2 className="text-2xl font-bold mb-4">📊 Add New Trade</h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          {/* Symbol */}
          <input
            name="symbol"
            placeholder="Symbol (e.g. NIFTY, BTC)"
            className="w-full p-2 border rounded bg-transparent"
            value={form.symbol}
            onChange={handleChange}
            required
          />

          {/* Type */}
          <select
            name="type"
            className="w-full p-2 border rounded bg-transparent"
            value={form.type}
            onChange={handleChange}
          >
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>

          {/* Entry */}
          <input
            name="entryPrice"
            type="number"
            placeholder="Entry Price"
            className="w-full p-2 border rounded bg-transparent"
            value={form.entryPrice}
            onChange={handleChange}
            required
          />

          {/* Exit */}
          <input
            name="exitPrice"
            type="number"
            placeholder="Exit Price"
            className="w-full p-2 border rounded bg-transparent"
            value={form.exitPrice}
            onChange={handleChange}
          />

          {/* Quantity */}
          <input
            name="quantity"
            type="number"
            placeholder="Quantity"
            className="w-full p-2 border rounded bg-transparent"
            value={form.quantity}
            onChange={handleChange}
            required
          />

          {/* Stop Loss */}
          <input
            name="stopLoss"
            type="number"
            placeholder="Stop Loss"
            className="w-full p-2 border rounded bg-transparent"
            value={form.stopLoss}
            onChange={handleChange}
          />

          {/* Strategy */}
          <input
            name="strategy"
            placeholder="Strategy (e.g. Breakout)"
            className="w-full p-2 border rounded bg-transparent"
            value={form.strategy}
            onChange={handleChange}
          />

          {/* Notes */}
          <input
            name="notes"
            placeholder="Notes"
            className="w-full p-2 border rounded bg-transparent"
            value={form.notes}
            onChange={handleChange}
          />

          {/* Buttons */}
          <div className="flex justify-between mt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save Trade"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}