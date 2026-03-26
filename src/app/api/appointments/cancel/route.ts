import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    
    await pool.query(
      "UPDATE appointments SET status = 'cancelled' WHERE id = ?",
      [id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
