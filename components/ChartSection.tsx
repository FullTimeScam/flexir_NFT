"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  createChart,
  IChartApi,
  BarData,
  CandlestickData,
  CrosshairMode,
} from "lightweight-charts"

type Candle = {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// 심볼 드롭다운 목록(예시)
const SYMBOL_LIST = [
  "FLEX/USDT",
  "BTC/USDT",
  "ETH/USDT",
  "BNB/USDT",
  "XRP/USDT",
  "DOGE/USDT",
  "LTC/USDT",
  "SOL/USDT",
  "MATIC/USDT",
  "DOT/USDT",
]

function SymbolInfoBar({
  selectedSymbol,
  setSelectedSymbol,
}: {
  selectedSymbol: string
  setSelectedSymbol: (sym: string) => void
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const priceChange24h = "+3.42%" // 임시 예시
  const volume24h = "12,345.67"  // 임시 예시

  return (
    <div className="relative flex justify-between items-center mb-2">
      {/* 심볼 드롭다운 */}
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
                  setSelectedSymbol(sym)
                  setIsDropdownOpen(false)
                }}
              >
                {sym}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 24시간 변화량 / 거래량 (임시) */}
      <div className="flex gap-4 text-sm">
        <div>
          24h Change: <span className="text-green-500">{priceChange24h}</span>
        </div>
        <div>24h Volume: {volume24h}</div>
      </div>
    </div>
  )
}

export default function ChartSection() {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartApiRef = useRef<IChartApi | null>(null)

  const [selectedSymbol, setSelectedSymbol] = useState("FLEX/USDT")
  const [candles, setCandles] = useState<Candle[]>([])

  // 심볼 변경 시 API 재조회
  useEffect(() => {
    fetch(`/api/candle-data?symbol=${encodeURIComponent(selectedSymbol)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setCandles(json.data)
        }
      })
      .catch(console.error)
  }, [selectedSymbol])

  // 차트 생성
  useEffect(() => {
    if (!chartContainerRef.current || candles.length === 0) return

    const container = chartContainerRef.current
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
    })

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#0ecc83",
      downColor: "#ff4976",
      borderVisible: false,
      wickUpColor: "#0ecc83",
      wickDownColor: "#ff4976",
    })

    const volumeSeries = chart.addHistogramSeries({
      color: "#d2d2d2",
      priceFormat: { type: "volume" },
      priceScaleId: "",
    })

    // 타입 선언 문제로, as any 로 캐스팅하여 scaleMargins 적용
    ;(volumeSeries.priceScale() as any).applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    })

    const candleData: CandlestickData[] = candles.map((c) => ({
      time: c.time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }))
    candleSeries.setData(candleData)

    const volumeData: BarData[] = candles.map((c) => ({
      time: c.time,
      value: c.volume,
      color: c.close > c.open ? "rgba(14,204,131,0.2)" : "rgba(255,73,118,0.2)",
    }))
    volumeSeries.setData(volumeData)

    chart.timeScale().fitContent()

    chartApiRef.current = chart

    return () => {
      chart.remove()
      chartApiRef.current = null
    }
  }, [candles])

  return (
    <div className="w-full h-full flex flex-col">
      <SymbolInfoBar
        selectedSymbol={selectedSymbol}
        setSelectedSymbol={setSelectedSymbol}
      />

      {/* 차트 영역 (z-0로 설정) */}
      <div className="flex-1 relative z-0" ref={chartContainerRef} />
    </div>
  )
}
