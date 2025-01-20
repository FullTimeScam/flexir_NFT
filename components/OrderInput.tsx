"use client"

import React, { useState } from 'react'

export default function OrderInput() {
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [orderType, setOrderType] = useState<'BUY' | 'SELL' | null>(null)

  const handleOrder = (type: 'BUY' | 'SELL') => {
    setOrderType(type)
    setIsModalOpen(true)
  }

  const handleConfirm = () => {
    alert(`주문 완료: ${orderType} / Price: ${price}, Qty: ${quantity}`)
    setIsModalOpen(false)
    setPrice('')
    setQuantity('')
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="bg-white p-4 border rounded h-full flex flex-col">
      <h3 className="text-md font-bold mb-2">New Order</h3>
      <div className="mb-2">
        <label className="block text-sm font-medium">Price</label>
        <input
          type="number"
          className="border p-1 w-full"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Quantity</label>
        <input
          type="number"
          className="border p-1 w-full"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      <div className="flex gap-2 mt-auto">
        <button
          className="bg-green-500 text-white px-3 py-1 rounded"
          onClick={() => handleOrder('BUY')}
        >
          매수
        </button>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded"
          onClick={() => handleOrder('SELL')}
        >
          매도
        </button>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-4 rounded shadow-lg min-w-[300px]">
            <h4 className="font-bold text-lg mb-2">주문 확인</h4>
            <p className="text-sm mb-1">타입: {orderType}</p>
            <p className="text-sm mb-1">가격: {price}</p>
            <p className="text-sm mb-1">수량: {quantity}</p>
            <div className="mt-4 flex gap-2 justify-end">
              <button
                className="bg-gray-300 px-3 py-1 rounded"
                onClick={handleCancel}
              >
                취소
              </button>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={handleConfirm}
              >
                컨펌
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
