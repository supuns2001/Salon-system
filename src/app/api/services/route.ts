import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM services ORDER BY name ASC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, price, duration_minutes } = await req.json();
    const [result]: any = await pool.query(
      'INSERT INTO services (name, description, price, duration_minutes) VALUES (?, ?, ?, ?)',
      [name, description, price, duration_minutes]
    );
    return NextResponse.json({ id: result.insertId, name, description, price, duration_minutes }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
