import './globals.css'
import { ReactNode } from 'react'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'

export const metadata = {
  title: 'Flexir NFT Market',
  description: 'NFT 마켓 거래 페이지',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="h-screen w-screen flex overflow-hidden">
        {/* 왼쪽: 사이드바 */}
        <Sidebar />

        {/* 오른쪽: 탑바 + 메인 */}
        <div className="flex flex-col w-full h-full">
          <TopBar />
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
