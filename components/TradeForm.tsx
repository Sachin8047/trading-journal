"use client";

import { useState } from "react";

export default function TradeForm() {
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

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/trades", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    console.log("Saved:", data);

    alert("Trade Saved ✅");

    // reset form
    setForm({
      symbol: "",
      type: "BUY",
      entryPrice: "",
      exitPrice: "",
      quantity: "",
      stopLoss: "",
      strategy: "",
      notes: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow space-y-4"
    >
      <h2 className="text-xl font-bold">Add Trade</h2>

      <input name="symbol" placeholder="Stock (e.g. NIFTY)" onChange={handleChange} value={form.symbol} className="w-full border p-2 rounded" />

      <select name="type" onChange={handleChange} value={form.type} className="w-full border p-2 rounded">
        <option value="BUY">Buy</option>
        <option value="SELL">Sell</option>
      </select>

      <input name="entryPrice" placeholder="Entry Price" onChange={handleChange} value={form.entryPrice} className="w-full border p-2 rounded" />

      <input name="exitPrice" placeholder="Exit Price" onChange={handleChange} value={form.exitPrice} className="w-full border p-2 rounded" />

      <input name="quantity" placeholder="Quantity" onChange={handleChange} value={form.quantity} className="w-full border p-2 rounded" />

      <input name="stopLoss" placeholder="Stop Loss" onChange={handleChange} value={form.stopLoss} className="w-full border p-2 rounded" />

      <input name="strategy" placeholder="Strategy (optional)" onChange={handleChange} value={form.strategy} className="w-full border p-2 rounded" />

      <textarea name="notes" placeholder="Notes" onChange={handleChange} value={form.notes} className="w-full border p-2 rounded" />

      <button className="bg-black text-white px-4 py-2 rounded w-full">
        Save Trade
      </button>
    </form>
  );
}