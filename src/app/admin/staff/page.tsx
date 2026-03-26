'use client';
import { useEffect, useState } from 'react';

export default function StaffManagement() {
  const [staff, setStaff] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', role: '', experience: '', bio: '', photo_url: '' });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    const res = await fetch('/api/staff');
    const data = await res.json();
    setStaff(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setFormData({ name: '', role: '', experience: '', bio: '', photo_url: '' });
    fetchStaff();
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Manage <span className="text-gold">Staff</span></h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form */}
        <div className="glass-card p-8 h-fit">
          <h3 className="text-xl font-bold mb-6">Add New Staff</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input 
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-gold"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Role</label>
              <input 
                required
                placeholder="e.g. Senior Stylist"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-gold"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Photo URL</label>
              <input 
                placeholder="https://..."
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-gold"
                value={formData.photo_url}
                onChange={(e) => setFormData({...formData, photo_url: e.target.value})}
              />
            </div>
            <button className="w-full bg-gold text-black font-bold py-3 rounded-lg hover:bg-gold-muted transition-colors">
              ADD STAFF MEMBER
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {staff.map(s => (
            <div key={s.id} className="glass-card p-6 flex items-center gap-6">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-white/5 border border-white/10">
                {s.photo_url && <img src={s.photo_url} alt={s.name} className="w-full h-full object-cover" />}
              </div>
              <div>
                <p className="text-xl font-bold">{s.name}</p>
                <p className="text-gold font-bold text-sm uppercase">{s.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
