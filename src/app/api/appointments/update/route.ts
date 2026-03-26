import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(req: NextRequest) {
  try {
    const { id, date, time, status, staff_id, service_id } = await req.json();
    
    const updates: string[] = [];
    const params: any[] = [];

    if (date) { updates.push('date = ?'); params.push(date); }
    if (time) { updates.push('time = ?'); params.push(time); }
    if (status) { updates.push('status = ?'); params.push(status); }
    if (staff_id) { updates.push('staff_id = ?'); params.push(staff_id); }
    if (service_id) { updates.push('service_id = ?'); params.push(service_id); }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    params.push(id);
    await pool.query(
      `UPDATE appointments SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
