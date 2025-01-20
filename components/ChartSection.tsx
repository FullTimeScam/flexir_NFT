"use client"

import React, { useEffect, useRef, useState } from 'react'
import {
  createChart,
  IChartApi,
  BarData,
  CandlestickData,
  CrosshairMode,
} from 'lightweight-charts'

type Candle = {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// 심볼 목록 예시
const SYMBOL_LIST = [
  'FLEX/USDT',
  'BTC/USDT',
  'ETH/USDT',
  'BNB/USDT',
  'XRP/USDT',
  'DOGE/USDT',
  'LTC/USDT',
  'SOL/USDT',
  'MATIC/USDT',
  'DOT/USDT',
]

// 드롭다운 + 24h 변동/볼륨 등 표시
function SymbolInfoBar({
  selectedSymbol,
  setSelectedSymbol,
}: {
  selectedSymbol: string
  setSelectedSymbol: (sym: string) => void
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const priceChange24h = '+3.42%'
  const volume24h = '12,345.67'

  return (
    <div className="relative flex justify-between items-center mb-2">
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
            style={{ width: '8rem' }}
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

  const [selectedSymbol, setSelectedSymbol] = useState('FLEX/USDT')
  const [candles, setCandles] = useState<Candle[]>([])

  // 심볼 변경 시 데이터 재조회
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

  // 차트 생성 / 업데이트
  useEffect(() => {
    if (!chartContainerRef.current || candles.length === 0) return

    const container = chartContainerRef.current
    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#eee' },
        horzLines: { color: '#eee' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false },
    })

    // 캔들 시리즈
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#0ecc83',
      downColor: '#ff4976',
      borderVisible: false,
      wickUpColor: '#0ecc83',
      wickDownColor: '#ff4976',
    })

    // 히스토그램(거래량) 시리즈
    const volumeSeries = chart.addHistogramSeries({
      color: '#d2d2d2',
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    })

    // ▲ 여기서 scaleMargins를 직접 applyOptions 하면 TS 에러
    // 대신 해당 시리즈의 priceScale()에 적용:
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    })

    // 데이터 세팅
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
      color: c.close > c.open ? 'rgba(14,204,131,0.2)' : 'rgba(255,73,118,0.2)',
    }))
    volumeSeries.setData(volumeData)

    // 범위 맞춤
    chart.timeScale().fitContent()

    chartApiRef.current = chart
    return () => {
      chart.remove()
      chartApiRef.current = null
    }
  }, [candles])

  return (
    <div className="w-full h-full flex flex-col">
      {/* 심볼 / 24h */}
      <SymbolInfoBar
        selectedSymbol={selectedSymbol}
        setSelectedSymbol={setSelectedSymbol}
      />

      {/* 차트 컨테이너 (z-0, relative) */}
      <div className="flex-1 relative z-0" ref={chartContainerRef} />
    </div>
  )
}
