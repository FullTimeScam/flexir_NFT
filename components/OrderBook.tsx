"use client"

import React from 'react'

type Order = { price: number; amount: number }
interface Props {
  onPriceClick?: (price: number) => void
}

const asksData: Order[] = [
  { price: 125, amount: 72 },
  { price: 126, amount: 65 },
  { price: 127, amount: 55 },
  { price: 128, amount: 45 },
]
const bidsData: Order[] = [
  { price: 124, amount: 72 },
  { price: 123.8, amount: 61 },
  { price: 123, amount: 51 },
  { price: 122, amount: 41 },
]

export default function OrderBook({ onPriceClick }: Props) {
  return (
    <div className="h-full flex flex-col text-sm">
      <h2 className="font-bold mb-1">Order Book</h2>
      <div className="flex-1 flex">
        {/* 매도 */}
        <div className="w-1/2 border-r pr-1">
          <div className="font-medium mb-1">Asks</div>
          {asksData.map((ask, i) => (
            <div
              key={i}
              className="flex cursor-pointer"
              onClick={() => onPriceClick?.(ask.price)}
            >
              <div className="w-1/2 text-red-500">{ask.price.toFixed(3)}</div>
              <div className="w-1/2">{ask.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>
        {/* 매수 */}
        <div className="w-1/2 pl-1">
          <div className="font-medium mb-1">Bids</div>
          {bidsData.map((bid, i) => (
            <div
              key={i}
              className="flex cursor-pointer"
              onClick={() => onPriceClick?.(bid.price)}
            >
              <div className="w-1/2 text-green-500">{bid.price.toFixed(3)}</div>
              <div className="w-1/2">{bid.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
