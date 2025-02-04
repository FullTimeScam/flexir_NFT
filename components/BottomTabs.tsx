"use client";

import React, { useState } from "react";

// ========== Mock Data ==========

// (1) 미체결(OPEN) Orders (positions, orders 탭도 동일)
const mockOrders = [
  {
    id: "order-1",
    symbol: "CoolCats", // NFT 이름
    side: "BUY",
    orderType: "LIMIT",
    price: 70, // market -> price 0 (무의미)
    amount: 2,
    status: "OPEN",
    createdAt: "2025-01-05 10:00:00",
  },
  {
    id: "order-2",
    symbol: "BoredApes",
    side: "SELL",
    orderType: "LIMIT",
    price: 250, // < 300
    amount: 1,
    status: "OPEN",
    createdAt: "2025-01-06 14:20:00",
  },
  {
    id: "order-3",
    symbol: "Doodles",
    side: "BUY",
    orderType: "LIMIT",
    price: 120,
    amount: 3,
    status: "OPEN",
    createdAt: "2025-01-07 09:00:00",
  },
];

// (2) 보유중인 포지션
const mockPositions = [
  {
    id: "pos-1",
    symbol: "Azuki",
    side: "BUY",
    size: 3,
    entryPrice: 210,
    currentPrice: 250,
    pnl: 120, // (250 - 210)*3
    openedAt: "2025-01-02 11:00:00",
  },
  {
    id: "pos-2",
    symbol: "Doodles",
    side: "SELL",
    size: 2, // 2개 숏 포지션(가정)
    entryPrice: 180,
    currentPrice: 190,
    pnl: -20, // 손실
    openedAt: "2025-01-03 18:00:00",
  },
];

// (3) 히스토리: 오더 + 포지션 혼합
// recordType: "ORDER" or "POSITION"
const mockHistory = [
  {
    id: "hist-1",
    recordType: "ORDER",
    symbol: "CoolCats",
    side: "BUY",
    orderType: "MARKET",
    price: 0,
    amount: 2,
    status: "FILLED", // 체결
    updatedAt: "2025-01-05 10:05:00",
    pnl: null, // 오더이므로 pnl 없음
  },
  {
    id: "hist-2",
    recordType: "ORDER",
    symbol: "BoredApes",
    side: "SELL",
    orderType: "LIMIT",
    price: 260,
    amount: 1,
    status: "CANCELED", // 취소
    updatedAt: "2025-01-06 15:00:00",
    pnl: null,
  },
  {
    id: "hist-3",
    recordType: "POSITION",
    symbol: "Azuki",
    side: "BUY",
    orderType: "", // 포지션에는 구체적 오더타입 대신 빈칸 or "N/A"
    price: 210, // entryPrice
    amount: 3,
    status: "CLOSED", // 포지션 종료
    updatedAt: "2025-01-10 12:00:00",
    pnl: 120, // 최종 PnL
  },
  {
    id: "hist-4",
    recordType: "POSITION",
    symbol: "Doodles",
    side: "SELL",
    orderType: "",
    price: 180,
    amount: 2,
    status: "CLOSED",
    updatedAt: "2025-01-11 08:30:00",
    pnl: -20,
  },
];

export default function BottomTabs() {
  const [activeTab, setActiveTab] = useState<
    "orders" | "positions" | "history"
  >("orders");

  return (
    <div className="w-full h-full flex flex-col">
      {/* 탭 버튼 */}
      <div className="flex border-b border-gray-200">
        <button
          className={`p-2 ${
            activeTab === "orders"
              ? "border-b-2 border-blue-500 text-blue-500"
              : ""
          }`}
          onClick={() => setActiveTab("orders")}
        >
          오더 목록
        </button>
        <button
          className={`p-2 ${
            activeTab === "positions"
              ? "border-b-2 border-blue-500 text-blue-500"
              : ""
          }`}
          onClick={() => setActiveTab("positions")}
        >
          포지션 목록
        </button>
        <button
          className={`p-2 ${
            activeTab === "history"
              ? "border-b-2 border-blue-500 text-blue-500"
              : ""
          }`}
          onClick={() => setActiveTab("history")}
        >
          히스토리
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="flex-1 overflow-y-auto p-2">
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "positions" && <PositionsTab />}
        {activeTab === "history" && <HistoryTab />}
      </div>
    </div>
  );
}

/* ================== 오더 목록 (미체결) ================== */
function OrdersTab() {
  return (
    <div className="w-full overflow-auto">
      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-2 py-1 border-r">Order ID</th>
            <th className="px-2 py-1 border-r">Symbol</th>
            <th className="px-2 py-1 border-r">Side</th>
            <th className="px-2 py-1 border-r">Order Type</th>
            <th className="px-2 py-1 border-r">Price</th>
            <th className="px-2 py-1 border-r">Amount</th>
            <th className="px-2 py-1 border-r">Status</th>
            <th className="px-2 py-1">Created</th>
          </tr>
        </thead>
        <tbody>
          {mockOrders.map((o) => (
            <tr key={o.id} className="border-b">
              <td className="px-2 py-1 border-r">{o.id}</td>
              <td className="px-2 py-1 border-r">{o.symbol}</td>
              <td className="px-2 py-1 border-r">{o.side}</td>
              <td className="px-2 py-1 border-r">{o.orderType}</td>
              <td className="px-2 py-1 border-r">{o.price}</td>
              <td className="px-2 py-1 border-r">{o.amount}</td>
              <td className="px-2 py-1 border-r">{o.status}</td>
              <td className="px-2 py-1">{o.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================== 포지션 목록 (실제 보유중) ================== */
function PositionsTab() {
  return (
    <div className="w-full overflow-auto">
      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-2 py-1 border-r">Position ID</th>
            <th className="px-2 py-1 border-r">Symbol</th>
            <th className="px-2 py-1 border-r">Side</th>
            <th className="px-2 py-1 border-r">Size</th>
            <th className="px-2 py-1 border-r">Entry Price</th>
            <th className="px-2 py-1 border-r">Current Price</th>
            <th className="px-2 py-1 border-r">PnL</th>
            <th className="px-2 py-1">Opened At</th>
          </tr>
        </thead>
        <tbody>
          {mockPositions.map((pos) => {
            const profitStyle =
              pos.pnl >= 0 ? "text-green-500" : "text-red-500";
            return (
              <tr key={pos.id} className="border-b">
                <td className="px-2 py-1 border-r">{pos.id}</td>
                <td className="px-2 py-1 border-r">{pos.symbol}</td>
                <td className="px-2 py-1 border-r">{pos.side}</td>
                <td className="px-2 py-1 border-r">{pos.size}</td>
                <td className="px-2 py-1 border-r">{pos.entryPrice}</td>
                <td className="px-2 py-1 border-r">{pos.currentPrice}</td>
                <td className={`px-2 py-1 border-r ${profitStyle}`}>
                  {pos.pnl}
                </td>
                <td className="px-2 py-1">{pos.openedAt}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ================== 히스토리 (주문 + 포지션) ================== */
function HistoryTab() {
  return (
    <div className="w-full overflow-auto">
      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-2 py-1 border-r">Hist ID</th>
            <th className="px-2 py-1 border-r">주문종류</th>
            {/* ORDER / POSITION */}
            <th className="px-2 py-1 border-r">Symbol</th>
            <th className="px-2 py-1 border-r">Side</th>
            <th className="px-2 py-1 border-r">Type</th>
            {/* orderType or "" */}
            <th className="px-2 py-1 border-r">Price</th>
            <th className="px-2 py-1 border-r">Amount</th>
            <th className="px-2 py-1 border-r">PnL</th>
            {/* only for POSITION */}
            <th className="px-2 py-1 border-r">Status</th>
            <th className="px-2 py-1">Updated</th>
          </tr>
        </thead>
        <tbody>
          {mockHistory.map((h) => {
            const profitStyle =
              h.recordType === "POSITION" && h.pnl && h.pnl < 0
                ? "text-red-500"
                : "text-green-500";

            return (
              <tr key={h.id} className="border-b">
                <td className="px-2 py-1 border-r">{h.id}</td>
                <td className="px-2 py-1 border-r">{h.recordType}</td>
                <td className="px-2 py-1 border-r">{h.symbol}</td>
                <td className="px-2 py-1 border-r">{h.side}</td>
                <td className="px-2 py-1 border-r">
                  {h.recordType === "ORDER" ? h.orderType : ""}
                </td>
                <td className="px-2 py-1 border-r">{h.price}</td>
                <td className="px-2 py-1 border-r">{h.amount}</td>
                {/* pnl: if recordType=POSITION, show h.pnl, else "-" */}
                <td
                  className={`px-2 py-1 border-r ${
                    h.recordType === "POSITION" ? profitStyle : ""
                  }`}
                >
                  {h.recordType === "POSITION" ? h.pnl : "-"}
                </td>
                <td className="px-2 py-1 border-r">{h.status}</td>
                <td className="px-2 py-1">{h.updatedAt}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
