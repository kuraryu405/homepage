import { NextResponse } from 'next/server';

// ▼ ここにデータを一時的に保管します（再起動すると消えます）
let temporaryStorage = {
  sleepTime: 0,
  steps: 0,
  lastUpdated: 'まだデータがありません',
};

// ポートフォリオ画面がデータを取りに来るとき（GET）
export async function GET() {
  return NextResponse.json(temporaryStorage);
}

// iPhoneからデータが送られてくるとき（POST）
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("---------------");
    console.log("iPhoneからデータ着弾！:", body);
    console.log("---------------");

    // 送られてきたデータで保管場所を上書き
    // ※iPhone側のキー名（SleepTimeなど）に合わせてください
    if (body.sleepTime) temporaryStorage.sleepTime = Number(body.sleepTime);
    if (body.SleepTime) temporaryStorage.sleepTime = Number(body.SleepTime); // 大文字対策
    
    if (body.steps) temporaryStorage.steps = Number(body.steps);
    
    temporaryStorage.lastUpdated = new Date().toLocaleString('ja-JP');

    return NextResponse.json({ message: '保存完了！', data: temporaryStorage });
  } catch (error) {
    return NextResponse.json({ error: 'データがおかしいかも？' }, { status: 400 });
  }
}