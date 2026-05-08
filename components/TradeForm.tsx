"use client";

import { useState, useEffect } from "react";

export default function TradeForm({ onSuccess }: any) {
  const [form, setForm] = useState({
    symbol: "",
    type: "BUY",
    entryPrice: "",
    exitPrice: "",
    quantity: "",
    stopLoss: "",
    strategy: "",
    notes: "",
    entryTime: "",
  });

  const [tpLevels, setTpLevels] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [strategyList, setStrategyList] = useState<string[]>([]);

  // 🔥 Load saved strategies
  useEffect(() => {
    const saved = localStorage.getItem("strategies");
    if (saved) setStrategyList(JSON.parse(saved));
  }, []);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addTP = () => setTpLevels([...tpLevels, 0]);

  const updateTP = (index: number, value: number) => {
    const updated = [...tpLevels];
    updated[index] = value;
    setTpLevels(updated);
  };

  const removeTP = (index: number) => {
    setTpLevels(tpLevels.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // ✅ SAVE strategy locally
      if (form.strategy) {
        const existing = JSON.parse(localStorage.getItem("strategies") || "[]");

        if (!existing.includes(form.strategy)) {
          const updated = [...existing, form.strategy];
          localStorage.setItem("strategies", JSON.stringify(updated));
        }
      }

      const res = await fetch("/api/trades", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          tpLevels,
        }),
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
    <div className="glass-card space-y-4">

      {/* ROW 1 */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">

        <input
          placeholder="Symbol"
          className="input"
          onChange={(e) => handleChange("symbol", e.target.value)}
        />

        <select
          className="input"
          onChange={(e) => handleChange("type", e.target.value)}
        >
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>

        <input
          type="number"
          placeholder="Entry"
          className="input"
          onChange={(e) => handleChange("entryPrice", e.target.value)}
        />

        <input
          type="number"
          placeholder="Exit"
          className="input"
          onChange={(e) => handleChange("exitPrice", e.target.value)}
        />

        <input
          type="number"
          placeholder="Qty"
          className="input"
          onChange={(e) => handleChange("quantity", e.target.value)}
        />

        <input
          type="number"
          placeholder="SL"
          className="input"
          onChange={(e) => handleChange("stopLoss", e.target.value)}
        />
      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

        {/* 🔥 Strategy with suggestions */}
        <div>
          <input
            placeholder="Strategy"
            className="input"
            value={form.strategy}
            onChange={(e) => handleChange("strategy", e.target.value)}
            list="strategy-options"
          />

          <datalist id="strategy-options">
            {strategyList.map((s, i) => (
              <option key={i} value={s} />
            ))}
          </datalist>
        </div>

        <input
          type="datetime-local"
          className="input"
          onChange={(e) => handleChange("entryTime", e.target.value)}
        />

        <textarea
          placeholder="Notes"
          className="input resize-none"
          onChange={(e) => handleChange("notes", e.target.value)}
        />
      </div>

      {/* TP SECTION */}
      <div>
        <p className="font-medium text-sm mb-2">Take Profit Levels</p>

        {tpLevels.map((tp, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="number"
              value={tp}
              onChange={(e) => updateTP(index, Number(e.target.value))}
              className="input flex-1"
              placeholder={`TP ${index + 1}`}
            />
            <button
              onClick={() => removeTP(index)}
              className="text-red-500"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          onClick={addTP}
          className="text-blue-600 text-sm"
        >
          + Add TP
        </button>
      </div>

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
      >
        {loading ? "Saving..." : "Save Trade"}
      </button>
    </div>
  );
}