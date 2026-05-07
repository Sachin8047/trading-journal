"use client";

import { useState } from "react";

export default function TradeForm({ onSuccess }: any) {
  const [form, setForm] = useState({
    symbol: "",
    type: "BUY",
    entryPrice: "",
    exitPrice: "",
    quantity: "",
    stopLoss: "",
    strategy: "",
    setup: "",
    notes: "",
    entryTime: "",
    exitTime: "",
    rating: "",
    fees: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/trades", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      onSuccess();
    } catch {
      alert("Error saving trade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input placeholder="Symbol" onChange={(e) => handleChange("symbol", e.target.value)} />
      
      <select onChange={(e) => handleChange("type", e.target.value)}>
        <option value="BUY">BUY</option>
        <option value="SELL">SELL</option>
      </select>

      <input placeholder="Entry Price" onChange={(e) => handleChange("entryPrice", e.target.value)} />
      <input placeholder="Exit Price" onChange={(e) => handleChange("exitPrice", e.target.value)} />
      <input placeholder="Quantity" onChange={(e) => handleChange("quantity", e.target.value)} />
      <input placeholder="Stop Loss" onChange={(e) => handleChange("stopLoss", e.target.value)} />

      <input placeholder="Strategy" onChange={(e) => handleChange("strategy", e.target.value)} />

      <select onChange={(e) => handleChange("setup", e.target.value)}>
        <option value="">Setup</option>
        <option value="Breakout">Breakout</option>
        <option value="Scalping">Scalping</option>
        <option value="Reversal">Reversal</option>
      </select>

      <input type="datetime-local" onChange={(e) => handleChange("entryTime", e.target.value)} />
      <input type="datetime-local" onChange={(e) => handleChange("exitTime", e.target.value)} />

      <input placeholder="Rating (1-5)" onChange={(e) => handleChange("rating", e.target.value)} />
      <input placeholder="Fees" onChange={(e) => handleChange("fees", e.target.value)} />

      <textarea placeholder="Notes" onChange={(e) => handleChange("notes", e.target.value)} />

      <button onClick={handleSubmit}>
        {loading ? "Saving..." : "Save Trade"}
      </button>
    </div>
  );
}