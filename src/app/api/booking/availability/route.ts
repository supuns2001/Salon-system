import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');
    if (!dateStr) return NextResponse.json({ error: 'Date is required' }, { status: 400 });

    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();

    // 1. Get working hours for the day
    const [hours]: any = await pool.query(
      'SELECT * FROM working_hours WHERE day_of_week = ?',
      [dayOfWeek]
    );

    if (hours.length === 0 || hours[0].is_closed) {
      return NextResponse.json({ is_closed: true });
    }

    // 2. Get available staff for the day
    const [staffSchedules]: any = await pool.query(`
      SELECT s.id, s.name, s.role, ss.start_time, ss.end_time 
      FROM staff s
      JOIN staff_schedule ss ON s.id = ss.staff_id
      WHERE ss.day_of_week = ? AND ss.is_available = 1
    `, [dayOfWeek]);

    return NextResponse.json({
      is_closed: false,
      workingHours: hours[0],
      availableStaff: staffSchedules
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
