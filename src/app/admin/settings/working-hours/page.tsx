'use client';
import { useEffect, useState } from 'react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function WorkingHoursAdmin() {
  const [hours, setHours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHours();
  }, []);

  const fetchHours = async () => {
    try {
      const res = await fetch('/api/working-hours');
      const data = await res.json();
      setHours(data);
    } catch (error) {
      console.error('Error fetching working hours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (dayIndex: number, field: string, value: any) => {
    const newHours = [...hours];
    const day = newHours.find(h => h.day_of_week === dayIndex);
    if (day) {
      day[field] = value;
      setHours(newHours);
    }
  };

  const saveHours = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/working-hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hours),
      });
      if (res.ok) {
        alert('Working hours saved successfully!');
      }
    } catch (error) {
      console.error('Error saving hours:', error);
      alert('Failed to save working hours.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500 text-center">Loading settings...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <h2 className="text-3xl font-bold mb-8 text-white">Salon <span className="text-gold">Working Hours</span></h2>
      
      <div className="space-y-4 mb-8">
        {DAYS.map((dayName, index) => {
          const dayData = hours.find(h => h.day_of_week === index) || { day_of_week: index, open_time: '09:00:00', close_time: '18:00:00', is_closed: 0 };
          return (
            <div key={dayName} className={`glass-card p-6 flex items-center justify-between transition-opacity ${dayData.is_closed ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-6 w-1/4">
                <input 
                  type="checkbox" 
                  checked={!dayData.is_closed}
                  onChange={(e) => handleUpdate(index, 'is_closed', e.target.checked ? 0 : 1)}
                  className="w-5 h-5 accent-gold"
                />
                <span className="text-lg font-bold text-white">{dayName}</span>
              </div>
              
              <div className="flex items-center gap-4 flex-1 justify-center">
                <input 
                  type="time" 
                  disabled={dayData.is_closed}
                  value={dayData.open_time}
                  onChange={(e) => handleUpdate(index, 'open_time', e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-gold disabled:cursor-not-allowed"
                />
                <span className="text-gray-500">to</span>
                <input 
                  type="time" 
                  disabled={dayData.is_closed}
                  value={dayData.close_time}
                  onChange={(e) => handleUpdate(index, 'close_time', e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-gold disabled:cursor-not-allowed"
                />
              </div>

              <div className="w-1/4 text-right">
                <span className={`text-xs font-black uppercase px-2 py-1 rounded ${dayData.is_closed ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                  {dayData.is_closed ? 'Closed' : 'Open'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        onClick={saveHours}
        disabled={saving}
        className="bg-gold text-black font-black py-4 px-8 rounded-xl text-lg hover:bg-gold-muted transition-colors disabled:opacity-50"
      >
        {saving ? 'SAVING CHANGES...' : 'SAVE WORKING HOURS'}
      </button>
    </div>
  );
}
