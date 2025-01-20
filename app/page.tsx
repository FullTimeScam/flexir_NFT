"use client"

import React from 'react'
import Split from 'react-split'
import ChartSection from '@/components/ChartSection'
import OrderBook from '@/components/OrderBook'
import OrderInput from '@/components/OrderInput'
import BottomTabs from '@/components/BottomTabs'

export default function Home() {
  return (
    <div className="w-full h-full">
      {/* 상/하 분할: 위 70%(차트+오더북/주문), 아래 30%(바텀탭) */}
      <Split
        className="flex flex-col h-full"
        direction="vertical"
        sizes={[70, 30]}
        minSize={[200, 100]}
        gutterSize={6}
      >
        {/* 상단을 다시 좌/우 분할: 왼쪽 70%(차트), 오른쪽 30%(오더북/주문) */}
        <Split
          className="flex h-full"
          direction="horizontal"
          sizes={[70, 30]}
          minSize={[300, 200]}
          gutterSize={6}
        >
          {/* 차트 영역 */}
          <div className="p-2">
            <div className="h-full bg-white rounded shadow p-4">
              <ChartSection />
            </div>
          </div>

          {/* 오른쪽 패널 -> 상/하 분할: 오더북 60%, 주문 40% */}
          <Split
            className="flex flex-col h-full"
            direction="vertical"
            sizes={[60, 40]}
            minSize={[100, 100]}
            gutterSize={6}
          >
            {/* 오더북 */}
            <div className="p-2">
              <div className="h-full bg-white rounded shadow p-4">
                <OrderBook />
              </div>
            </div>
            {/* 주문 입력 */}
            <div className="p-2">
              <div className="h-full bg-white rounded shadow p-4">
                <OrderInput />
              </div>
            </div>
          </Split>
        </Split>

        {/* 하단 탭 (오더/포지션/히스토리) */}
        <div className="p-2">
          <div className="h-full bg-white rounded shadow p-4">
            <BottomTabs />
          </div>
        </div>
      </Split>
    </div>
  )
}
