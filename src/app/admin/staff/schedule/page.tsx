'use client';
import { useEffect, useState } from 'react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function StaffScheduleAdmin() {
  const [staff, setStaff] = useState<any[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const staffRes = await fetch('/api/staff');
      const staffData = await staffRes.json();
      setStaff(staffData);
      if (staffData.length > 0) {
        setSelectedStaff(staffData[0]);
        fetchSchedule(staffData[0].id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedule = async (staffId: number) => {
    try {
      const res = await fetch(`/api/staff-schedule?staff_id=${staffId}`);
      const data = await res.json();
      
      // Ensure all 7 days exist in state
      const existingDays = new Map(data.map((d: any) => [d.day_of_week, d]));
      const fullSchedules = DAYS.map((_, index) => {
        return existingDays.get(index) || { 
          staff_id: staffId, 
          day_of_week: index, 
          start_time: '09:00:00', 
          end_time: '18:00:00', 
          is_available: 1 
        };
      });
      setSchedules(fullSchedules);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  const handleStaffChange = (staffId: string) => {
    const s = staff.find(st => st.id === parseInt(staffId));
    setSelectedStaff(s);
    fetchSchedule(parseInt(staffId));
  };

  const handleUpdate = (dayIndex: number, field: string, value: any) => {
    const newSchedules = [...schedules];
    const sched = newSchedules.find(s => s.day_of_week === dayIndex);
    if (sched) {
      sched[field] = value;
      setSchedules(newSchedules);
    }
  };

  const saveSchedules = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/staff-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schedules),
      });
      if (res.ok) {
        alert('Staff schedule saved successfully!');
      }
    } catch (error) {
      console.error('Error saving schedules:', error);
      alert('Failed to save schedules.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-5xl">
      <h2 className="text-3xl font-bold mb-8 text-white">Staff <span className="text-gold">Schedules</span></h2>

      <div className="mb-8 glass-card p-6">
        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Select Staff Member</label>
        <select 
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-gold text-lg"
          value={selectedStaff?.id || ''}
          onChange={(e) => handleStaffChange(e.target.value)}
        >
          {staff.map(s => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
        </select>
      </div>

      <div className="space-y-4 mb-8">
        {DAYS.map((dayName, index) => {
          const sched = schedules.find(s => s.day_of_week === index) || { day_of_week: index, start_time: '09:00:00', end_time: '18:00:00', is_available: 1 };
          return (
            <div key={dayName} className={`glass-card p-6 flex items-center justify-between transition-opacity ${sched.is_available ? '' : 'opacity-50'}`}>
              <div className="flex items-center gap-6 w-1/4">
                <input 
                  type="checkbox" 
                  checked={!!sched.is_available}
                  onChange={(e) => handleUpdate(index, 'is_available', e.target.checked ? 1 : 0)}
                  className="w-5 h-5 accent-gold"
                />
                <span className="text-lg font-bold text-white">{dayName}</span>
              </div>
              
              <div className="flex items-center gap-4 flex-1 justify-center">
                <input 
                  type="time" 
                  disabled={!sched.is_available}
                  value={sched.start_time}
                  onChange={(e) => handleUpdate(index, 'start_time', e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-gold disabled:cursor-not-allowed"
                />
                <span className="text-gray-500">to</span>
                <input 
                  type="time" 
                  disabled={!sched.is_available}
                  value={sched.end_time}
                  onChange={(e) => handleUpdate(index, 'end_time', e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-gold disabled:cursor-not-allowed"
                />
              </div>

              <div className="w-1/4 text-right">
                <span className={`text-xs font-black uppercase px-2 py-1 rounded ${sched.is_available ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {sched.is_available ? 'Available' : 'Off'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        onClick={saveSchedules}
        disabled={saving}
        className="bg-gold text-black font-black py-4 px-8 rounded-xl text-lg hover:bg-gold-muted transition-colors disabled:opacity-50"
      >
        {saving ? 'SAVING CHANGES...' : 'SAVE SCHEDULE'}
      </button>
    </div>
  );
}
