"use client";

type Trade = {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  entryPrice: number;
  exitPrice: number;
  quantity: number;
};

export default function TradesTable({ trades }: { trades: Trade[] }) {
  if (!trades || trades.length === 0) {
    return <p>No trades found</p>;
  }

  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Type</th>
          <th>Entry</th>
          <th>Exit</th>
          <th>Qty</th>
          <th>P&L</th>
        </tr>
      </thead>
      <tbody>
        {trades.map((t) => {
          const pnl =
            t.type === "BUY"
              ? (t.exitPrice - t.entryPrice) * t.quantity
              : (t.entryPrice - t.exitPrice) * t.quantity;

          return (
            <tr key={t.id}>
              <td>{t.symbol}</td>
              <td>{t.type}</td>
              <td>{t.entryPrice}</td>
              <td>{t.exitPrice}</td>
              <td>{t.quantity}</td>
              <td>{pnl}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}