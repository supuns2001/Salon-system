import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME
    });

    try {
      const [rows]: any = await connection.execute(
        'SELECT id, name, username, role FROM staff WHERE username = ? AND password = ?',
        [username, password]
      );

      if (rows.length > 0) {
        const user = rows[0];
        return NextResponse.json({ 
          success: true, 
          message: 'Login successful',
          user: {
            id: user.id,
            name: user.name,
            role: user.role
          }
        });
      } else {
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid username or password' 
        }, { status: 401 });
      }
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal Server Error' 
    }, { status: 500 });
  }
}
