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
]

const bidsData: Order[] = [
  { price: 1.24, amount: 2.2 },
  { price: 1.238, amount: 4.1 },
  { price: 1.235, amount: 1.5 },
  { price: 1.23, amount: 3.0 },
]

export default function OrderBook() {
  // 매도(asks) 오름차순
  const sortedAsks = [...asksData].sort((a, b) => a.price - b.price)
  let cum = 0
  const asksWithTotal = sortedAsks.map((ask) => {
    cum += ask.amount
    return { ...ask, total: cum }
  })
  const totalAsks = asksWithTotal[asksWithTotal.length - 1]?.total || 1

  // 매수(bids) 내림차순
  cum = 0
  const sortedBids = [...bidsData].sort((a, b) => b.price - a.price)
  const bidsWithTotal = sortedBids.map((bid) => {
    cum += bid.amount
    return { ...bid, total: cum }
  })
  const totalBids = bidsWithTotal[bidsWithTotal.length - 1]?.total || 1

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-bold mb-2">Order Book</h2>

      <div className="flex text-xs font-medium pb-1 border-b border-gray-300">
        <div className="w-1/3">Price(USDT)</div>
        <div className="w-1/3">Amount</div>
        <div className="w-1/3 text-right">Total</div>
      </div>

      <div className="flex-1 overflow-auto flex flex-col">
        {/* 매도 asks */}
        {asksWithTotal.map((ask, i) => {
          const depthPct = (ask.total / totalAsks) * 100
          return (
            <div
              key={`ask-${i}`}
              className="flex text-sm"
              style={{
                background: `linear-gradient(to left, rgba(255,0,0,0.15) ${depthPct}%, transparent 0%)`,
              }}
            >
              <div className="w-1/3 text-red-500">{ask.price.toFixed(3)}</div>
              <div className="w-1/3">{ask.amount.toFixed(2)}</div>
              <div className="w-1/3 text-right">{ask.total.toFixed(2)}</div>
            </div>
          )
        })}

        <div className="border-t border-gray-300 my-1" />

        {/* 매수 bids */}
        {bidsWithTotal.map((bid, i) => {
          const depthPct = (bid.total / totalBids) * 100
          return (
            <div
              key={`bid-${i}`}
              className="flex text-sm"
              style={{
                background: `linear-gradient(to left, rgba(0,255,0,0.15) ${depthPct}%, transparent 0%)`,
              }}
            >
              <div className="w-1/3 text-green-500">{bid.price.toFixed(3)}</div>
              <div className="w-1/3">{bid.amount.toFixed(2)}</div>
              <div className="w-1/3 text-right">{bid.total.toFixed(2)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
