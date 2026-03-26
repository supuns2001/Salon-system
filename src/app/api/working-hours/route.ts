import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM working_hours ORDER BY day_of_week ASC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const hours = await req.json(); // Array of { day_of_week, open_time, close_time, is_closed }
    
    for (const day of hours) {
      await pool.query(
        'INSERT INTO working_hours (day_of_week, open_time, close_time, is_closed) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE open_time = ?, close_time = ?, is_closed = ?',
        [day.day_of_week, day.open_time, day.close_time, day.is_closed, day.open_time, day.close_time, day.is_closed]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
