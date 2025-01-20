"use client"

import React, { useState } from "react"
import { FiChevronDown } from "react-icons/fi"
import { Slider } from "@mui/material"
// 위 예시는 Tailwind와 궁합이 좋음. (머티리얼 슬라이더, 혹은 다른 라이브러리 사용 가능)

type OrderType = "LIMIT" | "MARKET" | "STOP_LIMIT"

export default function OrderInput() {
  const [orderType, setOrderType] = useState<OrderType>("LIMIT")
  const [price, setPrice] = useState("")
  const [stopPrice, setStopPrice] = useState("")
  const [amount, setAmount] = useState("")
  const [total, setTotal] = useState("")
  // 가정: 사용자의 잔고(가령 USDT or FLEX 잔고)
  const userBalance = 1000 // 예시

  // 주문 타입 변경 시 필드 초기화
  const handleOrderTypeChange = (type: OrderType) => {
    setOrderType(type)
    setPrice("")
    setStopPrice("")
    setAmount("")
    setTotal("")
  }

  // 수량/가격 변경 시 total 계산 (Limit, Stop-Limit)
  const handlePriceChange = (value: string) => {
    setPrice(value)
    if (orderType === "LIMIT" || orderType === "STOP_LIMIT") {
      const p = parseFloat(value) || 0
      const a = parseFloat(amount) || 0
      const newTotal = p * a
      setTotal(newTotal ? newTotal.toString() : "")
    }
  }

  const handleAmountChange = (value: string) => {
    setAmount(value)
    if (orderType === "LIMIT" || orderType === "STOP_LIMIT") {
      const p = parseFloat(price) || 0
      const a = parseFloat(value) || 0
      const newTotal = p * a
      setTotal(newTotal ? newTotal.toString() : "")
    }
  }

  // total도 직접 입력 가능(바이낸스는 자동 계산이지만, 예시에선 허용)
  const handleTotalChange = (value: string) => {
    setTotal(value)
    if (orderType === "LIMIT" || orderType === "STOP_LIMIT") {
      const t = parseFloat(value) || 0
      const p = parseFloat(price) || 0
      if (p > 0) {
        const newAmount = t / p
        setAmount(newAmount ? newAmount.toString() : "")
      }
    }
  }

  // 수량 퍼센트 버튼/슬라이더
  const handleSetPercent = (pct: number) => {
    // 가정: userBalance는 'USDT 잔고'라고 치고,
    // 가격이 있어야 amount를 계산할 수 있음
    const p = parseFloat(price)
    if (p > 0) {
      const alloc = userBalance * (pct / 100)
      // 수량 = (쓸 금액) / (가격)
      const newAmount = alloc / p
      setAmount(newAmount.toFixed(3))
      setTotal((alloc).toFixed(3))
    } else {
      // 혹은 Market 주문일 때, Amount = userBalance * pct%
      if (orderType === "MARKET") {
        const amt = userBalance * (pct / 100)
        setAmount(amt.toFixed(3))
        // Market일 땐 price가 없으므로 total은 비활성일 수도
        setTotal("")
      }
    }
  }

  // Stop-limit일 때 stopPrice도 처리
  const handleStopPriceChange = (value: string) => {
    setStopPrice(value)
    // 별도 로직: stopPrice는 발동 가격. total 계산은 limit price+amount로 하므로 여기서는 없음
  }

  // 매수/매도 버튼 클릭
  const handleBuy = () => {
    const msg = `BUY ${orderType}\n` +
      `Price: ${price}, Stop: ${stopPrice}, Amount: ${amount}, Total: ${total}`
    alert(msg)
    // 실제로는 모달 or 스마트 컨트랙트 호출
  }
  const handleSell = () => {
    const msg = `SELL ${orderType}\n` +
      `Price: ${price}, Stop: ${stopPrice}, Amount: ${amount}, Total: ${total}`
    alert(msg)
  }

  return (
    <div className="flex flex-col text-sm h-full">
      {/* 주문타입 탭 (LIMIT / MARKET / STOP_LIMIT) */}
      <div className="flex border-b border-gray-200 mb-2">
        <button
          onClick={() => handleOrderTypeChange("LIMIT")}
          className={`px-2 py-1 ${
            orderType === "LIMIT"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
        >
          Limit
        </button>
        <button
          onClick={() => handleOrderTypeChange("MARKET")}
          className={`px-2 py-1 ${
            orderType === "MARKET"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
        >
          Market
        </button>
        <button
          onClick={() => handleOrderTypeChange("STOP_LIMIT")}
          className={`px-2 py-1 ${
            orderType === "STOP_LIMIT"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
        >
          Stop-Limit
        </button>
      </div>

      {/* 폼 영역 */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Stop-Limit: stopPrice 필드 */}
        {orderType === "STOP_LIMIT" && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Stop Price</label>
            <input
              type="number"
              className="border px-2 py-1 w-full rounded"
              value={stopPrice}
              onChange={(e) => handleStopPriceChange(e.target.value)}
            />
          </div>
        )}

        {/* Price (Limit / Stop-Limit만 활성, Market은 비활성화) */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Price</label>
          <input
            type="number"
            disabled={orderType === "MARKET"}
            className={`border px-2 py-1 w-full rounded ${
              orderType === "MARKET" ? "bg-gray-100 text-gray-400" : ""
            }`}
            placeholder={orderType === "MARKET" ? "Market Price" : ""}
            value={price}
            onChange={(e) => handlePriceChange(e.target.value)}
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Amount</label>
          <input
            type="number"
            className="border px-2 py-1 w-full rounded"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
          />
        </div>

        {/* 수량 퍼센트 (간단 버튼 25/50/75/100) */}
        <div className="flex items-center gap-2">
          {[25, 50, 75, 100].map((pct) => (
            <button
              key={pct}
              onClick={() => handleSetPercent(pct)}
              className="text-xs border rounded px-2 py-1 text-gray-500 hover:bg-gray-100"
            >
              {pct}%
            </button>
          ))}
        </div>

        {/* Slider 예시 (머티리얼 UI) - optional
            npm install @mui/material @emotion/react @emotion/styled
        */}
        <div className="mt-2">
          <Slider
            value={amount ? Math.min((parseFloat(amount) / userBalance) * 100, 100) : 0}
            onChange={(e, newValue) => {
              if (Array.isArray(newValue)) return
              handleSetPercent(newValue)
            }}
            aria-label="Order Amount"
            valueLabelDisplay="auto"
            step={5}
            marks
            min={0}
            max={100}
          />
        </div>

        {/* Total (Limit / Stop-limit)만 입력 가능.
            Market이면 자동 계산 or 미표시 가능(단순화) */}
        {orderType !== "MARKET" && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Total</label>
            <input
              type="number"
              className="border px-2 py-1 w-full rounded"
              value={total}
              onChange={(e) => handleTotalChange(e.target.value)}
            />
          </div>
        )}

        {/* 잔고 안내 (예: USDT) */}
        <div className="text-xs text-gray-400 mt-auto">
          Available: {userBalance.toFixed(2)} USDT
        </div>
      </div>

      {/* 매수/매도 버튼 */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleBuy}
          className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Buy
        </button>
        <button
          onClick={handleSell}
          className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Sell
        </button>
      </div>
    </div>
  )
}
