"use client";

import { useState } from "react";
import TradesTable from "@/components/TradesTable";
import TradeForm from "@/components/TradeForm";

export default function TradesPage() {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setShowForm(false);
    setRefreshKey(prev => prev + 1); // 🔄 refresh table
  };

  return (
    <div className="space-y-6">
      
      {/* Top bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📂 Trades</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Trade
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <TradeForm
          onClose={() => setShowForm(false)}
          onSuccess={handleSuccess}
        />
      )}

      {/* Table */}
      <TradesTable key={refreshKey} />
    </div>
  );
}