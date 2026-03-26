'use client';
import { useEffect, useState } from 'react';
import QueueDisplay from '@/components/QueueDisplay';
import { initiateSocketConnection, subscribeToQueueUpdates, disconnectSocket } from '@/lib/socket';

export default function PublicDisplay() {
  const [queue, setQueue] = useState({ nowServing: '-', next: '-', waiting: 0 });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  useEffect(() => {
    const setupSocket = async () => {
      await fetch('/api/socket');
      initiateSocketConnection();
      
      const refreshData = () => {
        fetchQueue();
        fetchAppointments();
      };

      subscribeToQueueUpdates(refreshData);
      refreshData();
    };

    setupSocket();

    const interval = setInterval(() => {
      fetchQueue();
      fetchAppointments();
    }, 30000); // Polling backup
    
    return () => {
      clearInterval(interval);
      disconnectSocket();
    };
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await fetch('/api/queue/status');
      const data = await res.json();
      setQueue(data);
    } catch (err) {
      console.error('Error fetching queue:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments?filter=today');
      const data = await res.json();
      // Show waiting and serving appointments
      setRecentAppointments(data.filter((a: any) => a.status === 'waiting' || a.status === 'serving').slice(0, 10));
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-16 flex flex-col gap-16">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">LUXE <span className="text-gold">LIVE QUEUE</span></h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest mt-2">Real-time Service Status</p>
        </div>
        <div className="text-right">
          <p className="text-gold text-5xl font-black">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p className="text-gray-500 font-bold uppercase">{new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="flex-1">
        <QueueDisplay queue={queue} large />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="glass-card p-10 border-gold/10">
          <h2 className="text-2xl font-black mb-8 border-b border-white/5 pb-4 uppercase tracking-tight">WAITLIST <span className="text-gold">PROGRESS</span></h2>
          <div className="space-y-6">
            {recentAppointments.length > 0 ? (
              recentAppointments.map((apt) => (
                <div key={apt.id} className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-6">
                    <span className={`text-3xl font-black ${apt.status === 'serving' ? 'text-gold' : 'text-gray-400'}`}>#{apt.appointment_number}</span>
                    <div>
                      <p className="text-xl font-bold">{apt.customer_name.split(' ')[0]}</p>
                      <p className="text-sm text-gray-500 uppercase font-black">{apt.service_name}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-lg text-xs font-black uppercase border ${
                    apt.status === 'serving' ? 'bg-gold text-black border-gold' : 'bg-transparent text-gray-500 border-white/10'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-12 italic">Currently no active appointments in queue.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="glass-card p-10 bg-gold/5 border-gold/20 flex-1">
             <h3 className="text-2xl font-black mb-4 text-gold uppercase">Special Notice</h3>
             <p className="text-xl text-gray-300 leading-relaxed mb-6">
               Please be present 5 minutes before your time. Our stylists strive to stay on schedule to provide you with the best experience.
             </p>
             <div className="flex items-center gap-2 text-gold font-bold">
               <span className="animate-pulse">●</span> LIVE SERVICES ACTIVE
             </div>
          </div>
          <div className="glass-card p-10 border-white/5">
             <h3 className="text-2xl font-black mb-4 uppercase">New to Luxe?</h3>
             <p className="text-gray-400 leading-relaxed mb-6">Visit our front desk or scan the QR code to join the queue as a walk-in guest.</p>
             <div className="w-16 h-1 bg-gold"></div>
          </div>
        </div>
      </div>

      <footer className="text-center text-gray-600 font-bold uppercase tracking-widest">
           LUXE SALON EST. 2024 • PREMIUM ARTISTRY & CARE
      </footer>
    </div>
  );
}
