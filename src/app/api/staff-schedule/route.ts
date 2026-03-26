import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const staff_id = searchParams.get('staff_id');

    let query = 'SELECT * FROM staff_schedule';
    const params = [];

    if (staff_id) {
      query += ' WHERE staff_id = ?';
      params.push(staff_id);
    }
    
    query += ' ORDER BY staff_id, day_of_week ASC';

    const [rows] = await pool.query(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const schedules = await req.json(); // Array of { staff_id, day_of_week, start_time, end_time, is_available }
    
    for (const sched of schedules) {
      await pool.query(
        'INSERT INTO staff_schedule (staff_id, day_of_week, start_time, end_time, is_available) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE start_time = ?, end_time = ?, is_available = ?',
        [sched.staff_id, sched.day_of_week, sched.start_time, sched.end_time, sched.is_available, sched.start_time, sched.end_time, sched.is_available]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
