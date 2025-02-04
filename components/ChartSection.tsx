"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  IChartApi,
  BarData,
  CandlestickData,
  CrosshairMode,
} from "lightweight-charts";

// ====================== Settle Date Card ======================

function formatNumber(num: number): string {
  return num < 10 ? `0${num}` : String(num);
}

function SettleDateCard() {
  // [예시] 관리자 여부 / 설정에 따라 카운트다운 시작 여부
  // 실제 구현에서는 props나 Context, API 등을 통해 제어하면 됩니다.
  const isCountdownStarted = true; // false면 "TBA" 표시

  // 원하는 목표 시점 (예: 2025-02-03T14:00:00Z)
  const targetDate = new Date("2025-02-05T14:00:00Z").getTime();

  // 남은 시간(초 단위)
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = Date.now();
    return Math.floor((targetDate - now) / 1000);
  });

  useEffect(() => {
    // 카운트다운이 시작되지 않았다면, 타이머도 돌리지 않음
    if (!isCountdownStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isCountdownStarted]);

  // 1) 아직 시작 전
  if (!isCountdownStarted) {
    return (
      <div className="border rounded px-2 py-1 text-xs text-gray-700">
        <div className="font-semibold text-center">settle TBA</div>
      </div>
    );
  }

  // 2) 시작됨. timeLeft > 0 => "settle until" + 카운트다운
  if (timeLeft > 0) {
    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    const mins = Math.floor((timeLeft % 3600) / 60);
    const secs = timeLeft % 60;

    return (
      <div className="border rounded px-2 py-1 text-xs text-gray-700">
        <div className="font-semibold text-center">settle until</div>
        <div className="text-center">
          {days}d {formatNumber(hours)}:{formatNumber(mins)}:
          {formatNumber(secs)}
        </div>
      </div>
    );
  }

  // 3) 시작됨 + timeLeft <= 0 => "settle ended" + 날짜
  const dateStr = new Date(targetDate).toLocaleString();
  return (
    <div className="border rounded px-2 py-1 text-xs text-gray-700">
      <div className="font-semibold text-center">settle ended</div>
      <div className="text-center">{dateStr}</div>
    </div>
  );
}

// ====================== Symbol Info Bar ======================

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

// NFT 스타일 심볼 목록 (FLEX/USDT는 유지)
const SYMBOL_LIST = [
  "FLEX/USDT",
  "CoolCats",
  "BoredApes",
  "CryptoPunks",
  "Azuki",
  "Doodles",
  "Moonbirds",
  "Meebits",
  "CloneX",
  "PudgyPenguins",
];

function SymbolInfoBar({
  selectedSymbol,
  setSelectedSymbol,
}: {
  selectedSymbol: string;
  setSelectedSymbol: (sym: string) => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const priceChange24h = "+3.42%";
  const volume24h = "12,345.67";

  return (
    <div className="relative flex justify-between items-center mb-2">
      {/* 좌측(심볼/드롭다운) */}
      <div className="text-xl font-bold relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2"
        >
          {selectedSymbol}
          <span className="text-sm text-gray-500">▼</span>
        </button>

        {isDropdownOpen && (
          <div
            className="absolute z-50 mt-2 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto"
            style={{ width: "8rem" }}
          >
            {SYMBOL_LIST.map((sym) => (
              <div
                key={sym}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  setSelectedSymbol(sym);
                  setIsDropdownOpen(false);
                }}
              >
                {sym}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 우측(24h정보 + SettleDate) */}
      <div className="flex items-center gap-4">
        <div className="flex gap-4 text-sm">
          <div>
            24h Change: <span className="text-green-500">{priceChange24h}</span>
          </div>
          <div>24h Volume: {volume24h}</div>
        </div>
        {/* settle date card */}
        <SettleDateCard />
      </div>
    </div>
  );
}

// ====================== Chart Section ======================

export default function ChartSection() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartApiRef = useRef<IChartApi | null>(null);

  const [selectedSymbol, setSelectedSymbol] = useState("FLEX/USDT");
  const [candles, setCandles] = useState<Candle[]>([]);

  // 심볼 변경 -> API fetch
  useEffect(() => {
    fetch(`/api/candle-data?symbol=${encodeURIComponent(selectedSymbol)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setCandles(json.data);
        }
      })
      .catch(console.error);
  }, [selectedSymbol]);

  // 차트 생성/갱신
  useEffect(() => {
    if (!chartContainerRef.current || candles.length === 0) return;

    const container = chartContainerRef.current;
    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#eee" },
        horzLines: { color: "#eee" },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false },
    });

    // 메인 캔들
    const candleSeries = chart.addCandlestickSeries({
      upColor: "#0ecc83",
      downColor: "#ff4976",
      borderVisible: false,
      wickUpColor: "#0ecc83",
      wickDownColor: "#ff4976",
    });

    // 거래량 시리즈
    const volumeSeries = chart.addHistogramSeries({
      color: "#d2d2d2",
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });

    // scaleMargins
    (volumeSeries.priceScale() as any).applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    // 데이터 set
    const candleData: CandlestickData[] = candles.map((c) => ({
      time: c.time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));
    candleSeries.setData(candleData);

    const volumeData: BarData[] = candles.map((c) => ({
      time: c.time,
      value: c.volume,
      color: c.close > c.open ? "rgba(14,204,131,0.2)" : "rgba(255,73,118,0.2)",
    }));
    volumeSeries.setData(volumeData);

    chart.timeScale().fitContent();

    chartApiRef.current = chart;

    return () => {
      chart.remove();
      chartApiRef.current = null;
    };
  }, [candles]);

  return (
    <div className="w-full h-full flex flex-col">
      <SymbolInfoBar
        selectedSymbol={selectedSymbol}
        setSelectedSymbol={setSelectedSymbol}
      />
      <div className="flex-1 relative z-0" ref={chartContainerRef} />
    </div>
  );
}
