"use client";

import React from "react";

type Order = { price: number; amount: number };
interface Props {
  onPriceClick?: (price: number) => void;
}

const asksData: Order[] = [
  { price: 1.25, amount: 50 },
  { price: 1.26, amount: 40 },
  { price: 1.27, amount: 30 },
  { price: 1.28, amount: 20 },
];
const bidsData: Order[] = [
  { price: 1.24, amount: 41 },
  { price: 1.238, amount: 30 },
  { price: 1.229, amount: 22 },
  { price: 1.22, amount: 19 },
];

export default function OrderBook({ onPriceClick }: Props) {
  return (
    <div className="h-full flex flex-col text-sm">
      <h2 className="font-bold mb-1">Order Book</h2>
      <div className="flex-1 flex">
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
  );
}
