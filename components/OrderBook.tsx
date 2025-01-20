"use client"

import React from 'react'

type Order = {
  price: number
  amount: number
}

// 예시 데이터
const asksData: Order[] = [
  { price: 1.25, amount: 1.2 },
  { price: 1.26, amount: 3.5 },
  { price: 1.265, amount: 2.1 },
  { price: 1.27, amount: 1.0 },
  { price: 1.275, amount: 0.9 },
  { price: 1.278, amount: 3.2 },
  { price: 1.28, amount: 2.5 },
  { price: 1.29, amount: 4.2 },
  { price: 1.295, amount: 1.8 },
]

const bidsData: Order[] = [
  { price: 1.24, amount: 2.2 },
  { price: 1.238, amount: 4.1 },
  { price: 1.235, amount: 1.5 },
  { price: 1.23, amount: 3.0 },
  { price: 1.228, amount: 2.2 },
  { price: 1.225, amount: 5.4 },
  { price: 1.22, amount: 6.1 },
  { price: 1.215, amount: 1.2 },
  { price: 1.21, amount: 3.7 },
]

export default function OrderBook() {
  // 매도(asks) - 오름차순
  const sortedAsks = [...asksData].sort((a, b) => a.price - b.price)
  // 매도 상위 8개만
  const topAsks = sortedAsks.slice(0, 8)
  // 각 줄의 total = price * amount
  const askTotals = topAsks.map((ask) => ask.price * ask.amount)
  const maxAskTotal = Math.max(...askTotals, 0.000001)

  // 매수(bids) - 내림차순
  const sortedBids = [...bidsData].sort((a, b) => b.price - a.price)
  // 매수 상위 8개만
  const topBids = sortedBids.slice(0, 8)
  // 각 줄의 total = price * amount
  const bidTotals = topBids.map((bid) => bid.price * bid.amount)
  const maxBidTotal = Math.max(...bidTotals, 0.000001)

  return (
    <div className="h-full flex flex-col text-xs">
      <h2 className="font-bold mb-2">Order Book</h2>

      <div className="flex-1 flex overflow-auto">
        {/* ===== 왼쪽: 매도(asks) ===== */}
        <div className="w-1/2 flex flex-col pr-2 border-r border-gray-300">
          {/* 테이블 헤더 */}
          <div className="flex font-medium pb-1 border-b border-gray-300">
            <div className="w-2/4">Price(USDT)</div>
            <div className="w-1/4">Amount</div>
            <div className="w-1/4 text-right">Total</div>
          </div>

          {/* 매도 8개 */}
          {topAsks.map((ask, i) => {
            const total = ask.price * ask.amount
            const depthPct = (total / maxAskTotal) * 100
            return (
              <div
                key={`ask-${i}`}
                className="flex text-sm"
                style={{
                  background: `linear-gradient(to left, rgba(255,0,0,0.15) ${depthPct}%, transparent 0%)`,
                }}
              >
                <div className="w-2/4 text-red-500">
                  {ask.price.toFixed(3)}
                </div>
                <div className="w-1/4">{ask.amount.toFixed(2)}</div>
                <div className="w-1/4 text-right">{total.toFixed(2)}</div>
              </div>
            )
          })}
        </div>

        {/* ===== 오른쪽: 매수(bids) ===== */}
        <div className="w-1/2 flex flex-col pl-2">
          {/* 테이블 헤더 */}
          <div className="flex font-medium pb-1 border-b border-gray-300">
            <div className="w-2/4">Price(USDT)</div>
            <div className="w-1/4">Amount</div>
            <div className="w-1/4 text-right">Total</div>
          </div>

          {/* 매수 8개 */}
          {topBids.map((bid, i) => {
            const total = bid.price * bid.amount
            const depthPct = (total / maxBidTotal) * 100
            return (
              <div
                key={`bid-${i}`}
                className="flex text-sm"
                style={{
                  background: `linear-gradient(to left, rgba(0,255,0,0.15) ${depthPct}%, transparent 0%)`,
                }}
              >
                <div className="w-2/4 text-green-500">
                  {bid.price.toFixed(3)}
                </div>
                <div className="w-1/4">{bid.amount.toFixed(2)}</div>
                <div className="w-1/4 text-right">{total.toFixed(2)}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
