import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol') || 'FLEX/USDT'

  const dataCount = 30
  const now = Math.floor(Date.now() / 1000)
  const oneMinute = 60

  let basePrice = 1.23
  if (symbol === 'BTC/USDT') basePrice = 27000
  if (symbol === 'ETH/USDT') basePrice = 1800
  if (symbol === 'BNB/USDT') basePrice = 300
  if (symbol === 'XRP/USDT') basePrice = 0.5
  // ...

  const candles = []
  for (let i = 0; i < dataCount; i++) {
    const time = now - (dataCount - i) * oneMinute

    // open
    const open = basePrice
    // 변동폭: ±2%로 크게
    const randomPercent = 0.02
    const closeShift = (Math.random() - 0.5) * randomPercent * basePrice
    const close = parseFloat((open + closeShift).toFixed(2))

    const high =
      Math.max(open, close) + Math.random() * randomPercent * basePrice
    const low =
      Math.min(open, close) - Math.random() * randomPercent * basePrice

    // 거래량은 0 ~ 100 사이
    const volume = parseFloat((Math.random() * 100).toFixed(2))

    candles.push({
      time,
      open,
      high,
      low,
      close,
      volume,
    })

    // 다음 캔들의 open = 현재 close
    basePrice = close
  }

  return NextResponse.json({
    success: true,
    symbol,
    data: candles,
  })
}
