"use client";

type Trade = {
  createdAt?: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  type: "BUY" | "SELL";
};

export default function PNLCalendar({ trades }: { trades: Trade[] }) {
  // ========================
  // 📊 GROUP BY DATE
  // ========================
  const dailyMap: Record<string, { pnl: number; count: number }> = {};

  trades.forEach((t) => {
    const date = new Date(t.createdAt || "").toISOString().split("T")[0];

    const pnl =
      t.type === "BUY"
        ? (t.exitPrice - t.entryPrice) * t.quantity
        : (t.entryPrice - t.exitPrice) * t.quantity;

    if (!dailyMap[date]) {
      dailyMap[date] = { pnl: 0, count: 0 };
    }

    dailyMap[date].pnl += pnl;
    dailyMap[date].count += 1;
  });

  // ========================
  // 📅 CURRENT MONTH
  // ========================
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(year, month, i)
      .toISOString()
      .split("T")[0];

    days.push({
      date,
      data: dailyMap[date],
    });
  }

  // ========================
  // UI
  // ========================
  return (
    <div className="glass-card p-4">
      <h2 className="mb-4 font-semibold">📅 P&L Calendar</h2>

      <div className="grid grid-cols-7 gap-2 text-center text-xs">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="font-semibold text-gray-400">
            {d}
          </div>
        ))}

        {days.map((d, i) => {
          if (!d) return <div key={i}></div>;

          const pnl = d.data?.pnl || 0;
          const count = d.data?.count || 0;

          const bg =
            pnl > 0
              ? "bg-green-100 border-green-400"
              : pnl < 0
              ? "bg-red-100 border-red-400"
              : "bg-gray-100";

          return (
            <div
              key={i}
              className={`p-2 rounded border text-xs ${bg}`}
            >
              <div className="text-gray-500 text-[10px]">
                {new Date(d.date).getDate()}
              </div>

              {count > 0 && (
                <>
                  <div
                    className={`font-semibold ${
                      pnl >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ₹{pnl}
                  </div>

                  <div className="text-[10px] text-gray-500">
                    {count} trades
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}