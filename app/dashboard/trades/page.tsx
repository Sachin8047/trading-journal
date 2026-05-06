import TradesTable from "../trades-table";

async function getTrades() {
  const res = await fetch("http://localhost:3000/api/trades", {
    cache: "no-store",
  });
  return res.json();
}

export default async function TradesPage() {
  const trades = await getTrades();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">📋 All Trades</h1>

<TradesTable trades={trades} />    </div>
  );
}