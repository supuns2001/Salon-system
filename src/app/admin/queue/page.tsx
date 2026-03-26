'use client';
import QueueDisplay from '@/components/QueueDisplay';
import { useEffect, useState } from 'react';
import { initiateSocketConnection, subscribeToQueueUpdates, emitQueueUpdate, disconnectSocket } from '@/lib/socket';

export default function QueueManagement() {
  const [stats, setStats] = useState({ nowServing: '-', next: '-', waiting: 0 });
  const [appointments, setAppointments] = useState<any[]>([]);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [walkInData, setWalkInData] = useState({
    customer_name: '',
    service_id: '',
    staff_id: ''
  });

  useEffect(() => {
    const setupSocket = async () => {
      await fetch('/api/socket');
      initiateSocketConnection();
      subscribeToQueueUpdates(() => {
        fetchStats();
        fetchAppointments();
      });
    };
    
    setupSocket();

    fetchStats();
    fetchAppointments();
    fetchMetadata();
    const interval = setInterval(() => {
      fetchStats();
      fetchAppointments();
    }, 10000); // Increased interval as we have real-time now
    return () => {
      clearInterval(interval);
      disconnectSocket();
    };
  }, []);

  const fetchMetadata = async () => {
    const [sRes, stRes] = await Promise.all([
      fetch('/api/services'),
      fetch('/api/staff')
    ]);
    setServices(await sRes.json());
    setStaff(await stRes.json());
  };

  const fetchStats = async () => {
    const res = await fetch('/api/queue/status');
    const data = await res.json();
    setStats(data);
  };

  const fetchAppointments = async () => {
    const res = await fetch('/api/appointments');
    const data = await res.json();
    setAppointments(data.filter((a: any) => a.status !== 'completed'));
  };

  const updateStatus = async (id: number, status: string) => {
    await fetch('/api/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointment_id: id, status }),
    });
    emitQueueUpdate();
    fetchStats();
    fetchAppointments();
  };

  const handleAddWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().split(' ')[0].substring(0, 5);
    
    await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...walkInData,
        date: today,
        time: now,
        phone: 'Walk-In',
        type: 'walkin'
      }),
    });
    
    setShowWalkInModal(false);
    setWalkInData({ customer_name: '', service_id: '', staff_id: '' });
    emitQueueUpdate();
    fetchStats();
    fetchAppointments();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Live <span className="text-gold">Queue Control</span></h2>
        <button 
          onClick={() => setShowWalkInModal(true)}
          className="bg-gold text-black px-6 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-gold-muted transition-all"
        >
          <span className="text-2xl leading-none">+</span> ADD WALK-IN CUSTOMER
        </button>
      </div>
      
      <div className="mb-12">
        <QueueDisplay queue={stats} />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {appointments.map((apt) => (
          <div key={apt.id} className={`glass-card p-6 flex flex-col md:flex-row justify-between items-center transition-all ${
            apt.status === 'serving' ? 'border-gold ring-1 ring-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]' : ''
          }`}>
            <div className="flex gap-6 items-center">
              <div className={`text-4xl font-black ${apt.status === 'serving' ? 'text-gold' : 'text-gray-600'}`}>
                #{apt.appointment_number}
              </div>
              <div>
                <p className="text-xl font-bold">{apt.customer_name}</p>
                <p className="text-gray-400">{apt.service_name} • {apt.staff_name} • {apt.time}</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-4 md:mt-0">
              {apt.status === 'waiting' && (
                <button 
                  onClick={() => updateStatus(apt.id, 'serving')}
                  className="bg-gold text-black px-6 py-2 rounded-lg font-bold hover:bg-gold-muted transition-colors"
                >
                  START APPOINTMENT
                </button>
              )}
              {apt.status === 'serving' && (
                <button 
                  onClick={() => updateStatus(apt.id, 'completed')}
                  className="bg-zinc-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-white/10 transition-colors"
                >
                  END APPOINTMENT
                </button>
              )}
              <span className={`px-4 py-2 rounded-lg font-bold border ${
                apt.status === 'serving' ? 'border-gold text-gold' : 'border-white/10 text-gray-500'
              }`}>
                {apt.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}

        {appointments.length === 0 && (
          <div className="glass-card p-12 text-center text-gray-500">
            No active appointments in the queue.
          </div>
        )}
      </div>

      {/* Walk-In Modal */}
      {showWalkInModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 w-full max-w-md border-gold/20">
            <h3 className="text-2xl font-bold mb-6 text-white">Add <span className="text-gold">Walk-In</span></h3>
            <form onSubmit={handleAddWalkIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Customer Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-gold"
                  value={walkInData.customer_name}
                  onChange={(e) => setWalkInData({...walkInData, customer_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Service</label>
                <select 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-gold"
                  value={walkInData.service_id}
                  onChange={(e) => setWalkInData({...walkInData, service_id: e.target.value})}
                >
                  <option value="">Select Service</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Assign Staff</label>
                <select 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-gold"
                  value={walkInData.staff_id}
                  onChange={(e) => setWalkInData({...walkInData, staff_id: e.target.value})}
                >
                  <option value="">Select Staff</option>
                  {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="flex-1 bg-white/5 text-white py-3 rounded-lg font-bold hover:bg-white/10 transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-gold text-black py-3 rounded-lg font-bold hover:bg-gold-muted transition-colors"
                >
                  ADD TO QUEUE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
