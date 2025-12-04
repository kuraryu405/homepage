import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import type { Health as HealthType } from '@/types/health';

export async function GET(): Promise<NextResponse<HealthType>> {
  try {
    const { rows } = await sql<HealthType>`
      SELECT steps, sleepTime as "sleepTime" 
      FROM health_v2 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    console.log('GET request - rows found:', rows.length);

    if (!rows[0]) {
      return NextResponse.json<HealthType>({
        steps: 0,
        sleepTime: 0,
      }, { status: 200 });
    }

    const data = rows[0];
    return NextResponse.json<HealthType>({
      steps: data.steps,
      sleepTime: Number(data.sleepTime),
    });

  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json<HealthType>({ steps: 0, sleepTime: 0 }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json<HealthType>({ steps: 0, sleepTime: 0 }, { status: 400 });
    }
    
    const steps = Number(body.steps ?? body.Steps ?? 0) || 0;
    const sleepTimeInSeconds = Number(body.sleepTime ?? body.SleepTime ?? body.sleeptime ?? 0) || 0;
    const sleepTime = sleepTimeInSeconds / 3600;


    await sql`CREATE TABLE IF NOT EXISTS health_v2 (
      id SERIAL PRIMARY KEY,
      steps INT NOT NULL,
      sleepTime NUMERIC(5, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    await sql`INSERT INTO health_v2 (steps, sleepTime) VALUES (${steps}, ${sleepTime})`;

    return NextResponse.json<HealthType>({
      steps: steps,
      sleepTime: sleepTime,
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST error details:', error);
    return NextResponse.json({ steps: 0, sleepTime: 0 }, { status: 500 });
  }
}