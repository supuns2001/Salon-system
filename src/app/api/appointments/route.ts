import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all';
    const search = searchParams.get('search') || '';

    let query = `
      SELECT a.*, s.name as service_name, st.name as staff_name 
      FROM appointments a
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN staff st ON a.staff_id = st.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filter === 'today') {
      query += ' AND DATE(a.date) = CURDATE()';
    } else if (filter === 'upcoming') {
      query += " AND (a.date > CURDATE() OR (a.date = CURDATE() AND a.status IN ('waiting', 'serving')))";
    } else if (filter === 'completed') {
      query += " AND a.status = 'completed'";
    } else if (filter === 'cancelled') {
      query += " AND a.status = 'cancelled'";
    }

    if (search) {
      query += ' AND (a.customer_name LIKE ? OR a.phone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY a.date DESC, a.time ASC';

    const [rows] = await pool.query(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { service_id, staff_id, customer_name, phone, date, time, type } = await req.json();
    const aptType = type || 'online';
    
    // Generate next appointment number for the day
    const [numResult]: any = await pool.query(
      'SELECT COALESCE(MAX(appointment_number), 0) + 1 as next_num FROM appointments WHERE date = ?',
      [date]
    );
    const appointment_number = numResult[0].next_num;

    const [result]: any = await pool.query(
      'INSERT INTO appointments (appointment_number, service_id, staff_id, customer_name, phone, date, time, status, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [appointment_number, service_id, staff_id, customer_name, phone, date, time, 'waiting', aptType]
    );

    return NextResponse.json({ 
      id: result.insertId, 
      appointment_number, 
      status: 'waiting',
      type: aptType
    }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
