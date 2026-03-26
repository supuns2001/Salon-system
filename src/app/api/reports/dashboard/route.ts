import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // 1. Totals Today
    const [totals]: any = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN type = 'walkin' THEN 1 ELSE 0 END) as walkins,
        SUM(CASE WHEN type = 'online' THEN 1 ELSE 0 END) as online,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM appointments 
      WHERE DATE(date) = CURDATE()
    `);

    // 2. Revenue Today (joining with services to get prices)
    const [revenue]: any = await pool.query(`
      SELECT SUM(s.price) as total_revenue
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      WHERE DATE(a.date) = CURDATE() AND a.status = 'completed'
    `);

    // 3. Appointments per day (last 7 days)
    const [dailyAppointments]: any = await pool.query(`
      SELECT DATE(date) as day, COUNT(*) as count
      FROM appointments
      WHERE date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(date)
      ORDER BY DATE(date) ASC
    `);

    // Ensure all 7 days are present, even if count is 0
    const filledDailyAppointments = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      // Format as YYYY-MM-DD safely using local time
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      let foundDateStr = dateString;
      const existing = dailyAppointments.find((x: any) => {
        // x.day is returned from DB which usually acts as local or UTC midnight
        const xDateObj = new Date(x.day);
        const xYear = xDateObj.getFullYear();
        const xMonth = String(xDateObj.getMonth() + 1).padStart(2, '0');
        const xDay = String(xDateObj.getDate()).padStart(2, '0');
        const xDateString = `${xYear}-${xMonth}-${xDay}`;

        if (xDateString === dateString) {
          foundDateStr = x.day; 
          return true;
        }
        return false;
      });

      filledDailyAppointments.push({
        day: existing ? foundDateStr : dateString,
        count: existing ? existing.count : 0
      });
    }

    // 4. Most popular services
    const [popularServices]: any = await pool.query(`
      SELECT s.name, COUNT(*) as count
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      GROUP BY s.id
      ORDER BY count DESC
      LIMIT 5
    `);

    // 5. Staff performance (completed appointments)
    const [staffPerformance]: any = await pool.query(`
      SELECT st.name, COUNT(*) as count
      FROM appointments a
      JOIN staff st ON a.staff_id = st.id
      WHERE a.status = 'completed'
      GROUP BY st.id
      ORDER BY count DESC
    `);

    return NextResponse.json({
      summary: {
        totalToday: totals[0].total || 0,
        walkinsToday: totals[0].walkins || 0,
        onlineToday: totals[0].online || 0,
        completedToday: totals[0].completed || 0,
        revenueToday: revenue[0].total_revenue || 0
      },
      charts: {
        daily: filledDailyAppointments,
        services: popularServices,
        staff: staffPerformance
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
