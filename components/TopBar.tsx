"use client"

import React from 'react'

export default function TopBar() {
  const handleConnectWallet = () => {
    alert('메타마스크 지갑 연결 로직은 추후 구현')
  }

  return (
    <div className="w-full h-14 bg-white border-b border-gray-200 p-2 flex items-center justify-end">
      <button
        onClick={handleConnectWallet}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Connect Wallet
      </button>
    </div>
  )
}
