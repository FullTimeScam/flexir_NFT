"use client"

import React, { useState } from 'react'

export default function BottomTabs() {
  const [activeTab, setActiveTab] = useState<'orders' | 'positions' | 'history'>('orders')

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex border-b border-gray-200">
        <button
          className={`p-2 ${activeTab === 'orders' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          오더 목록
        </button>
        <button
          className={`p-2 ${activeTab === 'positions' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
          onClick={() => setActiveTab('positions')}
        >
          포지션 목록
        </button>
        <button
          className={`p-2 ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          히스토리
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {activeTab === 'orders' && <div>오더 목록 컨텐츠 예시</div>}
        {activeTab === 'positions' && <div>포지션 목록 컨텐츠 예시</div>}
        {activeTab === 'history' && <div>히스토리 컨텐츠 예시</div>}
      </div>
    </div>
  )
}
