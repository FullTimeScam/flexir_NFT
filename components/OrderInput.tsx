"use client";

import React from "react";
import { Slider } from "@mui/material";

interface Props {
  orderType: "LIMIT" | "MARKET";
  setOrderType: (t: "LIMIT" | "MARKET") => void;
  limitPrice: string;
  setLimitPrice: (p: string) => void;
  amount: string;
  setAmount: (amt: string) => void;
  total: string;
  setTotal: (t: string) => void;
  sliderValue: number;
  setSliderValue: (val: number) => void;
  balance: number;

  // NFT 수량 여부
  isNFT?: boolean;
}

export default function OrderInput({
  orderType,
  setOrderType,
  limitPrice,
  setLimitPrice,
  amount,
  setAmount,
  total,
  setTotal,
  sliderValue,
  setSliderValue,
  balance,
  isNFT,
}: Props) {
  // ---------------------------
  // 헬퍼 함수
  // ---------------------------
  const toNum = (val: string) => parseFloat(val) || 0;
  const parseIntAmount = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return 0;
    return Math.floor(num);
  };

  // price * amount => total
  const calcTotal = (p: number, amt: number) => {
    if (p > 0 && amt > 0) {
      return (p * amt).toFixed(2);
    }
    return "";
  };

  // ---------------------------
  // 탭 전환
  // ---------------------------
  const handleTypeChange = (type: "LIMIT" | "MARKET") => {
    setOrderType(type);
    // 필요 시 상태 초기화
    // setLimitPrice("");
    // setAmount("");
    // setTotal("");
    // setSliderValue(0);
  };

  // ---------------------------
  // 인풋 핸들러
  // ---------------------------
  const handleLimitPriceChange = (val: string) => {
    setLimitPrice(val);
    const p = toNum(val);
    const a = isNFT ? parseIntAmount(amount) : toNum(amount);
    setTotal(calcTotal(p, a));
  };

  const handleAmountChange = (val: string) => {
    let amt = isNFT ? parseIntAmount(val) : toNum(val);
    if (amt < 0) amt = 0;
    setAmount(String(amt));

    // limit이면 price로 total 계산
    if (orderType === "LIMIT") {
      const p = toNum(limitPrice);
      setTotal(calcTotal(p, amt));
    } else {
      // MARKET이면 total 계산은 price가 없음 -> 보통은 불필요
      // (원하면 "market price" 추정치가 있다면 그걸로 계산)
      setTotal("");
    }
  };

  const handleTotalChange = (val: string) => {
    setTotal(val);
    // Limit 일 때만 amount = total / price
    if (orderType === "LIMIT") {
      const p = toNum(limitPrice);
      const t = toNum(val);
      if (p > 0 && t > 0) {
        let amt = t / p;
        if (isNFT) amt = Math.floor(amt);
        setAmount(String(amt));
      } else {
        setAmount("0");
      }
    }
  };

  // 슬라이더
  const handleSliderChange = (val: number) => {
    setSliderValue(val);

    // 사용할 금액 = balance*(val/100)
    // Limit인 경우 price가 필요 => amount = usedMoney / price
    if (orderType === "LIMIT") {
      const p = toNum(limitPrice);
      if (p > 0) {
        const usedMoney = balance * (val / 100);
        let amt = usedMoney / p;
        if (isNFT) amt = Math.floor(amt);
        setAmount(String(amt));

        setTotal(calcTotal(p, amt));
      } else {
        setAmount("0");
        setTotal("");
      }
    } else {
      // MARKET -> 단순히 "amount = balance*(val/100) / someRefPrice" (데모)
      // 혹은 "amount = balance*(val/100)" if we assume direct quantity
      // 여기는 예시로 "amount = (balance*(val/100))" 정수
      let amt = balance * (val / 100);
      if (isNFT) amt = Math.floor(amt);
      setAmount(String(amt));
      setTotal("");
    }
  };

  const handleSetPercent = (pct: number) => {
    handleSliderChange(pct);
  };

  // ---------------------------
  // 잔고 체크
  // ---------------------------
  const totalNum = parseFloat(total) || 0;
  // Market이면 total이 "" => 일단 "canAfford" = true 처리
  const canAfford = orderType === "MARKET" ? true : totalNum <= balance;
  const buyLabel = canAfford ? "Buy" : "Insufficient balance";
  const sellLabel = canAfford ? "Sell" : "Insufficient balance";

  // ---------------------------
  return (
    <div className="text-sm flex flex-col h-full">
      {/* 탭: Limit / Market */}
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
          onClick={() => handleTypeChange("MARKET")}
          className={`px-2 py-1 ${
            orderType === "MARKET"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
        >
          Market
        </button>
      </div>

      {/* Limit Price (Market일 때 비활성화) */}
      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">Price</label>
        <input
          type="number"
          className={`border px-2 py-1 w-full rounded ${
            orderType === "MARKET" ? "bg-gray-100 text-gray-400" : ""
          }`}
          value={limitPrice}
          disabled={orderType === "MARKET"}
          onChange={(e) => handleLimitPriceChange(e.target.value)}
        />
      </div>

      {/* Amount */}
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

      {/* Percent buttons */}
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
            if (typeof newVal === "number") {
              handleSliderChange(newVal);
            }
          }}
        />
      </div>

      {/* Total (Market일 때 비활성 or 숨김) */}
      {orderType === "LIMIT" && (
        <div className="mb-2">
          <label className="block text-xs text-gray-500 mb-1">Total</label>
          <input
            type="number"
            className="border px-2 py-1 w-full rounded"
            value={total}
            onChange={(e) => handleTotalChange(e.target.value)}
          />
        </div>
      )}

      <div className="text-xs text-gray-400 mb-2">
        Balance: {balance.toFixed(2)}
      </div>

      {/* Buy/Sell */}
      <div className="flex gap-2 mt-auto">
        <button
          className={`flex-1 py-2 rounded ${
            canAfford
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {buyLabel}
        </button>
        <button
          className={`flex-1 py-2 rounded ${
            canAfford
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {sellLabel}
        </button>
      </div>
    </div>
  );
}
