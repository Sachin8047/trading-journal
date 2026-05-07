export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "RELIANCE.NS";

  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=5m&range=1d`
    );

    const data = await res.json();

    const result = data.chart.result[0];

    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];

    const candles = timestamps.map((t: number, i: number) => ({
      time: t,
      open: quotes.open[i],
      high: quotes.high[i],
      low: quotes.low[i],
      close: quotes.close[i],
    }));

    return Response.json(candles);
  } catch (err) {
    return Response.json({ error: "Failed" });
  }
}