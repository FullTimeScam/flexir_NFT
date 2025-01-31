"use client";

import React from "react";
import { Slider } from "@mui/material";

interface Props {
  orderType: "LIMIT" | "STOP_LIMIT";
  setOrderType: (t: "LIMIT" | "STOP_LIMIT") => void;
  limitPrice: string;
  setLimitPrice: (p: string) => void;
  stopPrice: string;
  setStopPrice: (p: string) => void;
  amount: string;
  setAmount: (amt: string) => void;
  total: string;
  setTotal: (t: string) => void;
  sliderValue: number;
  setSliderValue: (val: number) => void;
  balance: number;

  focusedInput: "stop" | "limit" | null;
  setFocusedInput: (f: "stop" | "limit" | null) => void;

  // 새 prop
  isNFT?: boolean;
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
  isNFT,
}: Props) {
  const handleTypeChange = (type: "LIMIT" | "STOP_LIMIT") => {
    setOrderType(type);
  };

  const toNum = (val: string) => parseFloat(val) || 0;
  const price = toNum(limitPrice);

  // --- integer amount helper ---
  function parseIntAmount(value: string) {
    // floor or parseInt
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return 0;
    return Math.floor(num); // 소수점 버림
  }

  // price*amount => total
  const calcTotal = (p: number, amt: number) => {
    if (p > 0 && amt > 0) {
      return (p * amt).toFixed(2);
    }
    return "";
  };

  // ---- input handlers ----
  const handleLimitPriceChange = (val: string) => {
    setLimitPrice(val);
    const p = toNum(val);
    const amt = parseInt(amount) || 0;
    setTotal(calcTotal(p, amt));
  };

  const handleStopPriceChange = (val: string) => {
    setStopPrice(val);
  };

  // amount input(정수)
  const handleAmountChange = (val: string) => {
    const intAmt = parseIntAmount(val);
    setAmount(String(intAmt));
    const p = price;
    setTotal(calcTotal(p, intAmt));
  };

  // total input => amount = floor(total/price)
  const handleTotalChange = (val: string) => {
    setTotal(val);
    const p = price;
    const t = toNum(val);
    if (p > 0 && t > 0) {
      // NFT => 정수
      const amt = Math.floor(t / p);
      setAmount(String(amt));
    } else {
      setAmount("0");
    }
  };

  // 슬라이더 onChange => amount, total
  const handleSliderChange = (val: number) => {
    setSliderValue(val);
    if (price <= 0) {
      setAmount("0");
      setTotal("");
      return;
    }
    // 사용할 금액 = balance*(val/100)
    const usedMoney = balance * (val / 100);
    // 정수 amount
    const newAmt = Math.floor(usedMoney / price);
    setAmount(String(newAmt));
    setTotal(calcTotal(price, newAmt));
  };

  const handleSetPercent = (pct: number) => {
    handleSliderChange(pct);
  };

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
            onFocus={() => setFocusedInput("stop")}
          />
        </div>
      )}

      {/* limit price */}
      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">Limit Price</label>
        <input
          type="number"
          className="border px-2 py-1 w-full rounded"
          value={limitPrice}
          onChange={(e) => handleLimitPriceChange(e.target.value)}
          onFocus={() => setFocusedInput("limit")}
        />
      </div>

      {/* amount (정수) */}
      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">Amount</label>
        <input
          type="number"
          className="border px-2 py-1 w-full rounded"
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
        />
        {isNFT && <p className="text-xs text-gray-400">*No decimals allowed</p>}
      </div>

      {/* 퍼센트 buttons */}
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

      {/* slider */}
      <div className="mb-2">
        <Slider
          value={sliderValue}
          step={1}
          min={0}
          max={100}
          valueLabelDisplay="auto"
          onChange={(_, newVal) => {
            if (typeof newVal === "number") {
              handleSliderChange(newVal);
            }
          }}
        />
      </div>

      {/* total */}
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
  );
}
