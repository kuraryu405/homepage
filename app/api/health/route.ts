import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import type { Health as HealthType } from '@/types/health';

export async function GET(): Promise<NextResponse<HealthType>> {
  try {
    const { rows } = await sql<HealthType>`SELECT * FROM health ORDER BY created_at DESC LIMIT 1`;
    
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
    
    // データを数値に変換（様々なキー名に対応）
    const steps = Number(
      body.steps || body.Step || body.step || 0
    ) || 0;
    const sleepTime = Number(
      body.sleepTime || body.SleepTime || body.sleep_time || 0
    ) || 0;
    
    console.log('Parsed values - steps:', steps, 'sleepTime:', sleepTime);

    // テーブルが存在しない場合は作成
    await sql<HealthType>`CREATE TABLE IF NOT EXISTS health (
      id SERIAL PRIMARY KEY,
      steps INT NOT NULL,
      sleepTime INT NOT NULL,
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
