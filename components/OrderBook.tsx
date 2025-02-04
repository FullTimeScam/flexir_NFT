"use client";

import React from "react";

type Order = { price: number; amount: number };
interface Props {
  onPriceClick?: (price: number) => void;
}

// 예시 데이터
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
  // ====== 상단 "Buyers vs Sellers" 게이지 ======
  const totalAsks = asksData.reduce((acc, ask) => acc + ask.amount, 0);
  const totalBids = bidsData.reduce((acc, bid) => acc + bid.amount, 0);
  const totalAll = totalAsks + totalBids || 1;

  const buyerRatio = (totalBids / totalAll) * 100;
  const sellerRatio = (totalAsks / totalAll) * 100;

  // ====== 막대 배경(Asks/Bids)용 최대 수량 ======
  const maxAskAmt = Math.max(...asksData.map((a) => a.amount), 0);
  const maxBidAmt = Math.max(...bidsData.map((b) => b.amount), 0);

  return (
    <div className="h-full flex flex-col text-sm bg-gray-50 p-2 rounded">
      <h2 className="font-bold mb-2 text-base">Order Book</h2>

      {/* ===== 상단 게이지 (Buyers vs Sellers) ===== */}
      <div className="relative w-full h-3 bg-gray-200 rounded mb-2">
        {/* 구매자(녹색) */}
        <div
          className="absolute left-0 top-0 h-3 bg-green-500 rounded-l"
          style={{ width: `${buyerRatio}%` }}
        />
        {/* 판매자(빨강) */}
        <div
          className="absolute right-0 top-0 h-3 bg-red-500 rounded-r"
          style={{ width: `${sellerRatio}%` }}
        />
        {/* 중앙 텍스트 */}
        <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold">
          Buyers: {buyerRatio.toFixed(1)}% | Sellers: {sellerRatio.toFixed(1)}%
        </div>
      </div>

      <div className="flex-1 flex gap-2">
        {/* ===== 매도(Asks) 영역 ===== */}
        <div className="w-1/2 border-r pr-1">
          <div className="font-medium mb-1">Asks</div>
          {/* 컬럼 제목 */}
          <div className="flex font-medium text-xs border-b border-gray-300 pb-1 mb-1">
            <div className="w-1/2 text-gray-400">가격</div>
            <div className="w-1/2 text-gray-400">수량</div>
          </div>
          {asksData.map((ask, i) => {
            // 현재 행 수량 대비 최대값 비율
            const ratio = maxAskAmt ? (ask.amount / maxAskAmt) * 100 : 0;
            return (
              <div
                key={i}
                className="flex cursor-pointer text-xs relative"
                onClick={() => onPriceClick?.(ask.price)}
                style={{
                  // 빨간 막대 배경 (왼->오른쪽)
                  background: `linear-gradient(to left, rgba(255,0,0,0.2) ${ratio}%, transparent 0%)`,
                }}
              >
                <div className="w-1/2 text-red-500">{ask.price.toFixed(3)}</div>
                {/* 수량 정수 */}
                <div className="w-1/2">{ask.amount.toFixed(0)}</div>
              </div>
            );
          })}
        </div>

        {/* ===== 매수(Bids) 영역 ===== */}
        <div className="w-1/2 pl-1">
          <div className="font-medium mb-1">Bids</div>
          {/* 컬럼 제목 */}
          <div className="flex font-medium text-xs border-b border-gray-300 pb-1 mb-1">
            <div className="w-1/2 text-gray-500">가격</div>
            <div className="w-1/2 text-gray-500">수량</div>
          </div>
          {bidsData.map((bid, i) => {
            const ratio = maxBidAmt ? (bid.amount / maxBidAmt) * 100 : 0;
            return (
              <div
                key={i}
                className="flex cursor-pointer text-xs relative"
                onClick={() => onPriceClick?.(bid.price)}
                style={{
                  // 초록 막대 배경
                  background: `linear-gradient(to left, rgba(0,255,0,0.2) ${ratio}%, transparent 0%)`,
                }}
              >
                <div className="w-1/2 text-green-500">
                  {bid.price.toFixed(3)}
                </div>
                <div className="w-1/2">{bid.amount.toFixed(0)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
