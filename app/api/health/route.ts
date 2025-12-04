import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import type { Health as HealthType } from '@/types/health';

export async function GET(): Promise<NextResponse<HealthType>> {
  try {
    // const { rows } = await sql<HealthType>`SELECT * FROM health ORDER BY created_at DESC LIMIT 1`;
    const { rows } = await sql<HealthType>`
      SELECT steps, sleepTime as "sleepTime" 
      FROM health 
      ORDER BY created_at DESC 
      LIMIT 1
      `;
    console.log('GET request - rows found:', rows.length);

    if (!rows[0]) {
      console.log('No data found in database');
      return NextResponse.json<HealthType>({
        steps: 0,
        sleepTime: 0,
      }, { status: 200 });
    }

    const data = rows[0];
    console.log('GET request - returning data:', data);
    return NextResponse.json<HealthType>({
      steps: data.steps,
      sleepTime: data.sleepTime,
    });

  } catch (error: any) {
    console.error('GET error:', error);
    
    // データベース接続エラーの場合、より詳細なエラーメッセージを返す
    if (error?.code === 'missing_connection_string') {
      return NextResponse.json(
        { 
          error: 'Database connection not configured',
          message: 'POSTGRES_URL environment variable is not set',
          steps: 0, 
          sleepTime: 0 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json<HealthType>({
      steps: 0,
      sleepTime: 0,
    }, { status: 500 });
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
        { status: 400 }
      );
    }
    
    // データを数値に変換（キー名の大文字・小文字揺れにも対応）
    const steps = Number(
      body.steps ?? body.Steps ?? 0
    ) || 0;
    // sleepTimeは秒数で送られてくるので、時間に変換（3600秒 = 1時間）
    const sleepTimeInSeconds = Number(
      body.sleepTime ?? body.SleepTime ?? body.sleeptime ?? 0
    ) || 0;
    const sleepTime = sleepTimeInSeconds / 3600; // 秒を時間に変換
    
    console.log('Parsed values - steps:', steps, 'sleepTime (seconds):', sleepTimeInSeconds, 'sleepTime (hours):', sleepTime);

    // テーブルが存在しない場合は作成
    // sleepTimeは時間（小数を含む可能性がある）なので、NUMERIC型を使用
    await sql<HealthType>`CREATE TABLE IF NOT EXISTS health (
      id SERIAL PRIMARY KEY,
      steps INT NOT NULL,
      sleepTime NUMERIC(5, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    // データを挿入
    const result = await sql<HealthType>`INSERT INTO health (steps, sleepTime) VALUES (${steps}, ${sleepTime}) RETURNING *`;
    console.log('Inserted data:', result.rows[0]);

    return NextResponse.json<HealthType>({
      steps: steps,
      sleepTime: sleepTime,
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST error details:', error);
    
    // データベース接続エラーの場合、より詳細なエラーメッセージを返す
    if (error?.code === 'missing_connection_string') {
      return NextResponse.json(
        { 
          error: 'Database connection not configured',
          message: 'POSTGRES_URL environment variable is not set',
          steps: 0, 
          sleepTime: 0 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json<HealthType>(
      { steps: 0, sleepTime: 0 },
      { status: 500 }
    );
  }
}
