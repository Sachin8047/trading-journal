"use client";

import { useEffect, useRef } from "react";
import { UTCTimestamp } from "lightweight-charts";
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  ColorType,
  CrosshairMode,
  createSeriesMarkers,
} from "lightweight-charts";

export default function TradingChart({
  trades,
  symbol = "RELIANCE.NS",
}: any) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // ===============================
    // 🔥 CREATE CHART
    // ===============================
    const chart = createChart(chartRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#0f172a" },
        textColor: "#cbd5f5",
      },
      grid: {
        vertLines: { color: "#1e293b" },
        horzLines: { color: "#1e293b" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: "#334155",
      },
      timeScale: {
        borderColor: "#334155",
        timeVisible: true,
      },
      width: chartRef.current.clientWidth,
      height: 350,
    });

    // ===============================
    // 🔥 LOAD DATA
    // ===============================
    const loadData = async () => {
      try {
        let candles: any[] = [];

        const res = await fetch(`/api/market?symbol=${symbol}`);
        const data = await res.json();

        if (Array.isArray(data) && data.length) {
          candles = data
            .filter(
              (c) =>
                c.open != null &&
                c.high != null &&
                c.low != null &&
                c.close != null &&
                c.time != null
            )
            .map((c) => ({
              time: c.time as UTCTimestamp, // ✅ FIX
              open: c.open,
              high: c.high,
              low: c.low,
              close: c.close,
            }));
        }

        // =========================
        // 🔥 SAFE FALLBACK (FIXED)
        // =========================
        if (!candles.length) {
          const now = Math.floor(Date.now() / 1000);

          candles = [
            {
              time: (now - 300 * 4) as UTCTimestamp,
              open: 100,
              high: 120,
              low: 90,
              close: 110,
            },
            {
              time: (now - 300 * 3) as UTCTimestamp,
              open: 110,
              high: 130,
              low: 100,
              close: 125,
            },
            {
              time: (now - 300 * 2) as UTCTimestamp,
              open: 125,
              high: 140,
              low: 120,
              close: 135,
            },
            {
              time: (now - 300) as UTCTimestamp,
              open: 135,
              high: 150,
              low: 130,
              close: 145,
            },
            {
              time: now as UTCTimestamp,
              open: 145,
              high: 160,
              low: 140,
              close: 155,
            },
          ];
        }

        // =========================
        // 🔥 CANDLE SERIES
        // =========================
        const candleSeries = chart.addSeries(CandlestickSeries);
        candleSeries.setData(candles);

        // =========================
        // 🔥 MARKERS (BUY / SELL)
        // =========================
        const markers = trades.map((t: any, i: number) => ({
          time: candles[Math.min(i, candles.length - 1)].time,
          position: t.type === "BUY" ? "belowBar" : "aboveBar",
          color: t.type === "BUY" ? "#22c55e" : "#ef4444",
          shape: t.type === "BUY" ? "arrowUp" : "arrowDown",
          text: `${t.symbol}`,
        }));

        createSeriesMarkers(candleSeries, markers);

        // =========================
        // 🔥 ENTRY / SL / TP LINES
        // =========================
        trades.forEach((t: any) => {
          candleSeries.createPriceLine({
            price: t.entryPrice,
            color: "#22c55e",
            lineWidth: 1,
            title: "Entry",
          });

          if (t.stopLoss) {
            candleSeries.createPriceLine({
              price: t.stopLoss,
              color: "#ef4444",
              lineWidth: 1,
              title: "SL",
            });
          }

          if (t.exitPrice) {
            candleSeries.createPriceLine({
              price: t.exitPrice,
              color: "#3b82f6",
              lineWidth: 1,
              title: "TP",
            });
          }
        });

        // =========================
        // 🔥 EQUITY CURVE
        // =========================
        let total = 0;

        const pnlData = trades.map((t: any, i: number) => {
          const pnl =
            t.type === "BUY"
              ? (t.exitPrice - t.entryPrice) * t.quantity
              : (t.entryPrice - t.exitPrice) * t.quantity;

          total += pnl;

          return {
            time: candles[Math.min(i, candles.length - 1)].time,
            value: total,
          };
        });

        const pnlSeries = chart.addSeries(LineSeries, {
          color: "#facc15",
          lineWidth: 2,
        });

        pnlSeries.setData(pnlData);

        chart.timeScale().fitContent();
      } catch (err) {
        console.error("Chart error:", err);
      }
    };

    loadData();

    // ===============================
    // 🔥 RESPONSIVE
    // ===============================
    const handleResize = () => {
      chart.applyOptions({
        width: chartRef.current?.clientWidth || 400,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [trades, symbol]);

  return <div ref={chartRef} className="w-full h-[350px]" />;
}