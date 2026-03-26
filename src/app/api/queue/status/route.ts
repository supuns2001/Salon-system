import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [nowServing]: any = await pool.query(
      "SELECT appointment_number FROM appointments WHERE DATE(date) = CURDATE() AND status = 'serving' ORDER BY updated_at DESC LIMIT 1"
    );
    
    const [nextUp]: any = await pool.query(
      "SELECT appointment_number FROM appointments WHERE DATE(date) = CURDATE() AND status = 'waiting' ORDER BY time ASC, appointment_number ASC LIMIT 1"
    );

    const [waitingCount]: any = await pool.query(
      "SELECT COUNT(*) as count FROM appointments WHERE DATE(date) = CURDATE() AND status = 'waiting'"
    );

    return NextResponse.json({
      nowServing: nowServing[0]?.appointment_number || '-',
      next: nextUp[0]?.appointment_number || '-',
      waiting: waitingCount[0].count
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
