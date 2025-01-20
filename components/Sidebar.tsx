"use client"

import React, { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div
      className={`
        bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-300
        ${isOpen ? 'w-48' : 'w-14'}
      `}
      style={{ minWidth: isOpen ? '12rem' : '3.5rem' }}
    >
      {/* 사이드바 토글 버튼 */}
      <div className="flex items-center justify-end p-2">
        <button onClick={toggleSidebar}>
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* 메뉴 목록 */}
      <nav className="flex flex-col gap-2 px-2">
        <a
          href="#"
          className="flex items-center p-2 rounded hover:bg-gray-100"
        >
          <span className="text-sm font-medium">포인트 마켓</span>
        </a>
        <a
          href="#"
          className="flex items-center p-2 rounded hover:bg-gray-100"
        >
          <span className="text-sm font-medium">NFT 마켓</span>
        </a>
      </nav>
    </div>
  )
}
