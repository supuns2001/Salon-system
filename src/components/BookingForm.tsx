'use client';
import { useState, useEffect } from 'react';
import { emitQueueUpdate } from '@/lib/socket';

interface BookingFormProps {
  services: any[];
  staff: any[];
  onSuccess: (data: any) => void;
}

export default function BookingForm({ services, staff, onSuccess }: BookingFormProps) {
  const [formData, setFormData] = useState({
    service_id: '',
    staff_id: '',
    customer_name: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
  });
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<any>(null);
  const [fetchingAvailability, setFetchingAvailability] = useState(false);

  useEffect(() => {
    if (formData.date) {
      fetchAvailability(formData.date);
    }
  }, [formData.date]);

  const fetchAvailability = async (date: string) => {
    setFetchingAvailability(true);
    try {
      const res = await fetch(`/api/booking/availability?date=${date}`);
      const data = await res.json();
      setAvailability(data);
      // Reset staff and time if not available on new date
      setFormData(prev => ({ ...prev, staff_id: '', time: '' }));
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingAvailability(false);
    }
  };

  const generateTimeSlots = () => {
    if (!availability || availability.is_closed) return [];
    
    const slots = [];
    const open = availability.workingHours.open_time.split(':');
    const close = availability.workingHours.close_time.split(':');
    
    let currentHour = parseInt(open[0]);
    let currentMin = parseInt(open[1]);
    const endHour = parseInt(close[0]);
    const endMin = parseInt(close[1]);

    const now = new Date();
    const isToday = formData.date === now.toISOString().split('T')[0];

    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
      
      // Filter out past slots if today
      if (!isToday || (currentHour > now.getHours() || (currentHour === now.getHours() && currentMin > now.getMinutes()))) {
        slots.push(timeStr);
      }
      
      currentMin += 30;
      if (currentMin >= 60) {
        currentHour += 1;
        currentMin = 0;
      }
    }
    return slots;
  };

  const getFilteredStaff = () => {
    if (!formData.time || !availability?.availableStaff) return availability?.availableStaff || [];
    
    return availability.availableStaff.filter((s: any) => {
      const start = s.start_time;
      const end = s.end_time;
      return formData.time >= start && formData.time <= end;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        emitQueueUpdate();
        onSuccess(data);
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Select Service</label>
          <select 
            required
            className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 outline-none focus:border-gold text-white appearance-none"
            value={formData.service_id}
            onChange={(e) => setFormData({...formData, service_id: e.target.value})}
          >
            <option value="" className="bg-zinc-900">Choose a service</option>
            {services.map(s => <option key={s.id} value={s.id} className="bg-zinc-900">{s.name} - ${s.price}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Select Stylist</label>
          <select 
            required
            disabled={fetchingAvailability || availability?.is_closed}
            className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 outline-none focus:border-gold disabled:opacity-50 text-white appearance-none"
            value={formData.staff_id}
            onChange={(e) => setFormData({...formData, staff_id: e.target.value})}
          >
            <option value="" className="bg-zinc-900">{availability?.is_closed ? 'Salon Closed' : 'Choose a stylist'}</option>
            {getFilteredStaff().map((s: any) => (
              <option key={s.id} value={s.id} className="bg-zinc-900">{s.name} ({s.role})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
          <input 
            type="date" 
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 outline-none focus:border-gold text-white"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Time</label>
          <select 
            required
            disabled={fetchingAvailability || availability?.is_closed}
            className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 outline-none focus:border-gold disabled:opacity-50 text-white appearance-none"
            value={formData.time}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
          >
            <option value="" className="bg-zinc-900">{availability?.is_closed ? 'Salon Closed' : 'Select Time'}</option>
            {generateTimeSlots().map(slot => (
              <option key={slot} value={slot} className="bg-zinc-900">{slot}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Your Name</label>
        <input 
          type="text" 
          required
          placeholder="John Doe"
          className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 outline-none focus:border-gold text-white"
          value={formData.customer_name}
          onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
        <input 
          type="tel" 
          required
          placeholder="+1 234 567 890"
          className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 outline-none focus:border-gold text-white"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="w-full bg-gold text-black font-black py-4 rounded-lg text-lg hover:bg-gold-muted transition-colors disabled:opacity-50"
      >
        {loading ? 'CONFIRMING...' : 'CONFIRM BOOKING'}
      </button>
    </form>
  );
}
