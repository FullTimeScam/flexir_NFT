import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "FLEX/USDT";

  // 기존에 30개만 만들었다면 => 30 * 5 = 150개로 (혹은 20→100 etc.)
  // 아래 예시: 1000개
  const dataCount = 1000;

  const now = Math.floor(Date.now() / 1000);
  const oneMinute = 60;

  // 심볼마다 기초 가격 다르게 (예: NFT 가격 <300)
  // 맘에 드는 방식으로 수정 가능
  let basePrice = 1.0;
  if (symbol === "CoolCats") basePrice = 150;
  else if (symbol === "BoredApes") basePrice = 280;
  else if (symbol === "CryptoPunks") basePrice = 290;
  else if (symbol === "Azuki") basePrice = 210;
  else if (symbol === "Doodles") basePrice = 120;
  else if (symbol === "Moonbirds") basePrice = 180;
  else if (symbol === "Meebits") basePrice = 240;
  else if (symbol === "CloneX") basePrice = 190;
  else if (symbol === "PudgyPenguins") basePrice = 100;
  // FLEX/USDT나 기본 등등

  const candles = [];
  for (let i = 0; i < dataCount; i++) {
    // time: 과거 ~ 현재
    const time = now - (dataCount - i) * oneMinute;
    const open = basePrice;
    // 약간의 랜덤 변동
    const close = parseFloat(
      (open + (Math.random() - 0.5) * 0.03 * open).toFixed(2)
    );
    const high = Math.max(open, close) + Math.random() * 0.02 * open;
    const low = Math.min(open, close) - Math.random() * 0.02 * open;
    const volume = parseFloat((Math.random() * 50).toFixed(2)); // 임의 거래량

    candles.push({
      time,
      open,
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close,
      volume,
    });

    // 다음 캔들의 basePrice를 이번 close로 잡음
    basePrice = close;
  }

  return NextResponse.json({
    success: true,
    data: candles,
  });
}
