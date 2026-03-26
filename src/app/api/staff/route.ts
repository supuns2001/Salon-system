import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM staff ORDER BY name ASC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, role, experience, bio, photo_url } = await req.json();
    const [result]: any = await pool.query(
      'INSERT INTO staff (name, role, experience, bio, photo_url) VALUES (?, ?, ?, ?, ?)',
      [name, role, experience, bio, photo_url]
    );
    return NextResponse.json({ id: result.insertId, name, role, experience, bio, photo_url }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
