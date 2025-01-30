"use client"

import React, { useState } from 'react'
import Split from 'react-split'

import ChartSection from '@/components/ChartSection'
import OrderBook from '@/components/OrderBook'
import OrderInput from '@/components/OrderInput'
import BottomTabs from '@/components/BottomTabs'

export default function Home() {
  // ---- 주문 상태 ----
  const [orderType, setOrderType] = useState<"LIMIT" | "STOP_LIMIT">("LIMIT")
  const [limitPrice, setLimitPrice] = useState("")
  const [stopPrice, setStopPrice] = useState("")
  const [amount, setAmount] = useState("")
  const [total, setTotal] = useState("")
  const [sliderValue, setSliderValue] = useState(0)

  // **어느 인풋이 포커스되었는지** (stop or limit)
  const [focusedInput, setFocusedInput] = useState<"stop" | "limit" | null>(null)

  const balance = 1000

  // 오더북 가격 클릭
  const handleOrderBookPriceClick = (price: number) => {
    if (orderType === "STOP_LIMIT") {
      // stop-limit 모드일 때: focusedInput 체크
      if (focusedInput === "stop") {
        // stopPrice 업데이트
        setStopPrice(String(price))
      } else {
        // limitPrice 업데이트
        setLimitPrice(String(price))
        // price 바뀌면 total = price * amount
        const p = parseFloat(String(price)) || 0
        const a = parseFloat(amount) || 0
        setTotal((p * a).toFixed(2))
      }
    } else {
      // LIMIT 모드일 때는 무조건 limitPrice
      setLimitPrice(String(price))
      const p = parseFloat(String(price)) || 0
      const a = parseFloat(amount) || 0
      setTotal((p * a).toFixed(2))
    }
  }

  return (
    <div className="w-full h-full">
      <Split
        className="flex flex-col h-full"
        direction="vertical"
        sizes={[90, 10]}
        minSize={[200, 100]}
        gutterSize={6}
      >
        <Split
          className="flex h-full"
          direction="horizontal"
          sizes={[70, 30]}
          minSize={[300, 200]}
          gutterSize={6}
        >
          {/* 차트 */}
          <div className="p-2">
            <div className="h-full bg-white rounded shadow p-4">
              <ChartSection />
            </div>
          </div>

          {/* 오더북 vs 주문창 */}
          <Split
            className="flex flex-col h-full"
            direction="vertical"
            sizes={[20, 80]}
            minSize={[100, 100]}
            gutterSize={6}
          >
            <div className="p-0">
              <div className="h-full bg-white rounded shadow p-2">
                <OrderBook onPriceClick={handleOrderBookPriceClick} />
              </div>
            </div>

            <div className="p-0">
              <div className="h-full bg-white rounded shadow p-2">
                <OrderInput
                  orderType={orderType}
                  setOrderType={setOrderType}
                  limitPrice={limitPrice}
                  setLimitPrice={setLimitPrice}
                  stopPrice={stopPrice}
                  setStopPrice={setStopPrice}
                  amount={amount}
                  setAmount={setAmount}
                  total={total}
                  setTotal={setTotal}
                  sliderValue={sliderValue}
                  setSliderValue={setSliderValue}
                  balance={balance}
                  focusedInput={focusedInput}
                  setFocusedInput={setFocusedInput}
                />
              </div>
            </div>
          </Split>
        </Split>

        {/* 하단 탭 */}
        <div className="p-2">
          <div className="h-full bg-white rounded shadow p-4">
            <BottomTabs />
          </div>
        </div>
      </Split>
    </div>
  )
}
