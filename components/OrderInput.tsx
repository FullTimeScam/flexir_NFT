"use client"

import React from "react"
import { Slider } from "@mui/material"

interface Props {
  orderType: "LIMIT" | "STOP_LIMIT"
  setOrderType: (t: "LIMIT" | "STOP_LIMIT") => void
  limitPrice: string
  setLimitPrice: (p: string) => void
  stopPrice: string
  setStopPrice: (p: string) => void
  amount: string
  setAmount: (amt: string) => void
  total: string
  setTotal: (t: string) => void
  sliderValue: number
  setSliderValue: (val: number) => void
  balance: number

  // 새로 추가: 어느 인풋이 포커스인지
  focusedInput: "stop" | "limit" | null
  setFocusedInput: (f: "stop" | "limit" | null) => void
}

export default function OrderInput({
  orderType,
  setOrderType,
  limitPrice,
  setLimitPrice,
  stopPrice,
  setStopPrice,
  amount,
  setAmount,
  total,
  setTotal,
  sliderValue,
  setSliderValue,
  balance,
  focusedInput,
  setFocusedInput,
}: Props) {
  const handleTypeChange = (type: "LIMIT" | "STOP_LIMIT") => {
    setOrderType(type)
  }

  const toNum = (val: string) => parseFloat(val) || 0
  const price = toNum(limitPrice)

  // price/amount -> total
  const recalcTotal = (p: number, a: number) => {
    if (p > 0 && a > 0) return (p * a).toFixed(2)
    return ""
  }

  // ---- event handlers ----
  const handleLimitPriceChange = (val: string) => {
    setLimitPrice(val)
    const p = toNum(val)
    const a = toNum(amount)
    setTotal(recalcTotal(p, a))
  }
  const handleStopPriceChange = (val: string) => {
    setStopPrice(val)
  }

  // amount input
  const handleAmountChange = (val: string) => {
    setAmount(val)
    const p = price
    const a = toNum(val)
    setTotal(recalcTotal(p, a))
  }

  // total input -> amount = total/price
  const handleTotalChange = (val: string) => {
    setTotal(val)
    const p = price
    const t = toNum(val)
    if (p > 0 && t > 0) {
      setAmount((t / p).toFixed(3))
    } else {
      setAmount("")
    }
  }

  // 슬라이더/퍼센트
  const handleSliderChange = (val: number) => {
    setSliderValue(val)
    if (price <= 0) {
      setAmount("")
      setTotal("")
      return
    }
    const usedMoney = balance * (val / 100)
    const newAmt = usedMoney / price
    setAmount(newAmt.toFixed(3))
    setTotal((price * newAmt).toFixed(2))
  }

  const handleSetPercent = (pct: number) => {
    handleSliderChange(pct)
  }

  // ---- render ----
  return (
    <div className="text-sm flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-2">
        <button
          onClick={() => handleTypeChange("LIMIT")}
          className={`px-2 py-1 ${
            orderType === "LIMIT"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
        >
          Limit
        </button>
        <button
          onClick={() => handleTypeChange("STOP_LIMIT")}
          className={`px-2 py-1 ${
            orderType === "STOP_LIMIT"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
        >
          Stop-Limit
        </button>
      </div>

      {orderType === "STOP_LIMIT" && (
        <div className="mb-2">
          <label className="block text-xs text-gray-500 mb-1">Stop Price</label>
          <input
            type="number"
            className="border px-2 py-1 w-full rounded"
            value={stopPrice}
            onChange={(e) => handleStopPriceChange(e.target.value)}
            onFocus={() => setFocusedInput("stop")}  // <--- key line
          />
        </div>
      )}

      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">Limit Price</label>
        <input
          type="number"
          className="border px-2 py-1 w-full rounded"
          value={limitPrice}
          onChange={(e) => handleLimitPriceChange(e.target.value)}
          onFocus={() => setFocusedInput("limit")}  // <--- key line
        />
      </div>

      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">Amount</label>
        <input
          type="number"
          className="border px-2 py-1 w-full rounded"
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
        />
      </div>

      {/* 25%..100% Buttons */}
      <div className="flex gap-1 mb-2">
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

      {/* Slider */}
      <div className="mb-2">
        <Slider
          value={sliderValue}
          step={1}
          min={0}
          max={100}
          valueLabelDisplay="auto"
          onChange={(_, newVal) => {
            if (typeof newVal === "number") handleSliderChange(newVal)
          }}
        />
      </div>

      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">Total</label>
        <input
          type="number"
          className="border px-2 py-1 w-full rounded"
          value={total}
          onChange={(e) => handleTotalChange(e.target.value)}
        />
      </div>

      <div className="text-xs text-gray-400 mb-2">
        Balance: {balance.toFixed(2)}
      </div>

      <div className="flex gap-2 mt-auto">
        <button className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Buy
        </button>
        <button className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600">
          Sell
        </button>
      </div>
    </div>
  )
}
