import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { appointment_id, status } = await req.json();
    
    await pool.query(
      'UPDATE appointments SET status = ? WHERE id = ?',
      [status, appointment_id]
    );

    // If status is 'serving', it becomes the current serving number
    // We can fetch the updated queue status here if needed, 
    // or let the client trigger a refresh/broadcast.

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
