"use client";

import { useEffect, useState } from "react";
import TradesTable from "@/components/TradesTable";
import TradeForm from "@/components/TradeForm";

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

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ NEW: Strategy filter
  const [selectedStrategy, setSelectedStrategy] = useState("ALL");

  // 🔁 Fetch trades
  const fetchTrades = async () => {
    try {
      const res = await fetch("/api/trades");
      const data = await res.json();
      setTrades(data || []);
    } catch (err) {
      console.error("Error fetching trades:", err);
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [refreshKey]);

  // ✅ After adding trade
  const handleSuccess = () => {
    setShowForm(false);
    setRefreshKey((prev) => prev + 1);
  };

  // ✅ FILTER LOGIC
  const filteredTrades =
    selectedStrategy === "ALL"
      ? trades
      : trades.filter((t) => t.strategy === selectedStrategy);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📈 Trades</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Trade
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <TradeForm
          onSuccess={handleSuccess}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* 🔥 STRATEGY FILTER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">All Trades</h2>

        <select
          value={selectedStrategy}
          onChange={(e) => setSelectedStrategy(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="ALL">All Strategies</option>

          {[...new Set(trades.map((t) => t.strategy).filter(Boolean))].map(
            (s: any) => (
              <option key={s} value={s}>
                {s}
              </option>
            )
          )}
        </select>
      </div>

      {/* TABLE */}
      <div className="glass-card">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <TradesTable
            trades={filteredTrades}
            onRefresh={fetchTrades}
            key={refreshKey}
          />
        )}
      </div>

    </div>
  );
}