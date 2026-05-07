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
  entryTime?: string;
  exitTime?: string;
};

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ FETCH FUNCTION (IMPORTANT)
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

  // ✅ AFTER ADD TRADE
  const handleSuccess = () => {
    setShowForm(false);
    setRefreshKey((prev) => prev + 1);
  };

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

      {/* FORM MODAL */}
      {showForm && (
        <TradeForm
          onSuccess={handleSuccess}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* TABLE */}
      <div className="glass-card">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <TradesTable
  trades={trades}
  onRefresh={fetchTrades}
  key={refreshKey}
/>
        )}
      </div>

    </div>
  );
}