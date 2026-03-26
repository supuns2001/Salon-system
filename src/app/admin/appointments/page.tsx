'use client';
import { useEffect, useState } from 'react';
import { initiateSocketConnection, emitQueueUpdate, disconnectSocket } from '@/lib/socket';

export default function AppointmentsAdmin() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filter, setFilter] = useState('upcoming'); // today, upcoming, completed, cancelled, all
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [rescheduleData, setRescheduleData] = useState<any>(null); // { id, date, time }

  useEffect(() => {
    const setupSocket = async () => {
      await fetch('/api/socket');
      initiateSocketConnection();
    };
    
    setupSocket();
    return () => disconnectSocket();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [filter, search]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ filter, search });
      const res = await fetch(`/api/appointments?${queryParams.toString()}`);
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch('/api/appointments/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        emitQueueUpdate();
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const cancelAppointment = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const res = await fetch('/api/appointments/cancel', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        emitQueueUpdate();
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  const rescheduleAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/appointments/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: rescheduleData.id, 
          date: rescheduleData.date, 
          time: rescheduleData.time 
        }),
      });
      if (res.ok) {
        setRescheduleData(null);
        emitQueueUpdate();
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error rescheduling:', error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Appointment <span className="text-gold">Management</span></h2>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex bg-white/5 rounded-lg p-1">
          {['today', 'upcoming', 'completed', 'cancelled', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-bold uppercase transition-all ${
                filter === f ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        
        <input
          type="text"
          placeholder="Search customer or phone..."
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-gold flex-grow"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Number</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Staff</th>
              <th className="px-6 py-4">Date/Time</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500">Loading appointments...</td></tr>
            ) : appointments.length === 0 ? (
              <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500">No appointments found.</td></tr>
            ) : appointments.map((apt) => (
              <tr key={apt.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-bold text-gold">#{apt.appointment_number}</td>
                <td className="px-6 py-4">
                  <p className="font-bold">{apt.customer_name}</p>
                  <p className="text-xs text-gray-500">{apt.phone}</p>
                </td>
                <td className="px-6 py-4">{apt.service_name}</td>
                <td className="px-6 py-4">{apt.staff_name}</td>
                <td className="px-6 py-4">
                  <p>{new Date(apt.date).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500">{apt.time}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                    apt.type === 'online' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                  }`}>
                    {apt.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                    apt.status === 'serving' ? 'bg-gold text-black' : 
                    apt.status === 'completed' ? 'bg-green-500/10 text-green-400' : 
                    apt.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                    'bg-zinc-800 text-gray-400'
                  }`}>
                    {apt.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                      <>
                        <button 
                          onClick={() => updateStatus(apt.id, 'completed')}
                          className="p-2 hover:bg-green-500/10 text-green-500 rounded-lg transition-colors"
                          title="Complete"
                        >
                          ✓
                        </button>
                        <button 
                          onClick={() => setRescheduleData({ id: apt.id, date: apt.date.split('T')[0], time: apt.time })}
                          className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
                          title="Reschedule"
                        >
                          🕒
                        </button>
                        <button 
                          onClick={() => cancelAppointment(apt.id)}
                          className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reschedule Modal */}
      {rescheduleData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 w-full max-w-sm border-gold/20">
            <h3 className="text-2xl font-bold mb-6 text-white">Reschedule <span className="text-gold">Appointment</span></h3>
            <form onSubmit={rescheduleAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">New Date</label>
                <input 
                  type="date" 
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-gold"
                  value={rescheduleData.date}
                  onChange={(e) => setRescheduleData({...rescheduleData, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">New Time</label>
                <input 
                  type="time" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-gold"
                  value={rescheduleData.time}
                  onChange={(e) => setRescheduleData({...rescheduleData, time: e.target.value})}
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  type="button"
                  onClick={() => setRescheduleData(null)}
                  className="flex-1 bg-white/5 text-white py-3 rounded-lg font-bold hover:bg-white/10 transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-gold text-black py-3 rounded-lg font-bold hover:bg-gold-muted transition-colors"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
