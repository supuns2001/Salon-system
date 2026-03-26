'use client';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ nowServing: '-', next: '-', waiting: 0 });
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchAppointments();
    const interval = setInterval(() => {
      fetchStats();
      fetchAppointments();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    const res = await fetch('/api/queue/status');
    const data = await res.json();
    setStats(data);
  };

  const fetchAppointments = async () => {
    const res = await fetch('/api/appointments?filter=today');
    const data = await res.json();
    setAppointments(data);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Dashboard <span className="text-gold">Overview</span></h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="glass-card p-6 border-gold/20">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Serving Now</p>
          <p className="text-4xl font-black text-gold">{stats.nowServing}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Up Next</p>
          <p className="text-3xl font-black">{stats.next}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Waiting</p>
          <p className="text-3xl font-black">{stats.waiting}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Today's Total</p>
          <p className="text-3xl font-black">{appointments.length}</p>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Today's Appointments</h3>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-6 py-4 font-bold text-gray-400"></th>
              <th className="px-6 py-4 font-bold text-gray-400">Customer</th>
              <th className="px-6 py-4 font-bold text-gray-400">Service</th>
              <th className="px-6 py-4 font-bold text-gray-400">Time</th>
              <th className="px-6 py-4 font-bold text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-bold">{apt.appointment_number}</td>
                <td className="px-6 py-4">
                  <p className="font-bold">{apt.customer_name}</p>
                  <p className="text-xs text-gray-500">{apt.phone}</p>
                </td>
                <td className="px-6 py-4">{apt.service_name}</td>
                <td className="px-6 py-4">{apt.time}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    apt.status === 'serving' ? 'bg-gold text-black' : 
                    apt.status === 'completed' ? 'bg-zinc-800 text-gray-400' : 
                    'bg-zinc-700 text-white'
                  }`}>
                    {apt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
