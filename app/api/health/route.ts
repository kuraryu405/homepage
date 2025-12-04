import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import type { Health as HealthType } from '@/types/health';

// テーブル名を定数化（将来変えるときもここだけでOK）
const TABLE_NAME = 'health_v2';

export async function GET(): Promise<NextResponse<HealthType>> {
  try {
    // 新テーブルから最新1件を取得
    const { rows } = await sql<HealthType>`
      SELECT steps, sleepTime as "sleepTime"
      FROM ${TABLE_NAME}
      ORDER BY created_at DESC
      LIMIT 1
    `;

    console.log('GET request - rows found:', rows.length);

    if (!rows[0]) {
      return NextResponse.json<HealthType>(
        { steps: 0, sleepTime: 0 },
        { status: 200 },
      );
    }

    const data = rows[0];
    console.log('GET request - returning data:', data);

    return NextResponse.json<HealthType>(
      {
        steps: data.steps,
        sleepTime: Number(data.sleepTime),
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json<HealthType>(
      { steps: 0, sleepTime: 0 },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    // リクエストボディを取得
    let body;
    try {
      body = await request.json();
      console.log('Received POST body:', body);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json<HealthType>(
        { steps: 0, sleepTime: 0 },
        { status: 400 },
      );
    }

    // 大文字小文字の揺らぎを吸収して数値に変換
    const steps = Number(body.steps ?? body.Steps ?? 0) || 0;
    const sleepTimeInSeconds =
      Number(body.sleepTime ?? body.SleepTime ?? body.sleeptime ?? 0) || 0;
    const sleepTime = sleepTimeInSeconds / 3600; // 秒 → 時間

    console.log(
      'Parsed values - steps:',
      steps,
      'sleepTime (seconds):',
      sleepTimeInSeconds,
      'sleepTime (hours):',
      sleepTime,
    );

    // 新しいテーブル定義（小数OKなNUMERIC型）
    await sql`
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        id SERIAL PRIMARY KEY,
        steps INT NOT NULL,
        sleepTime NUMERIC(5, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // データを挿入
    await sql`
      INSERT INTO ${TABLE_NAME} (steps, sleepTime)
      VALUES (${steps}, ${sleepTime})
    `;

    return NextResponse.json<HealthType>(
      {
        steps,
        sleepTime,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('POST error details:', error);
    return NextResponse.json<HealthType>(
      { steps: 0, sleepTime: 0 },
      { status: 500 },
    );
  }
}
