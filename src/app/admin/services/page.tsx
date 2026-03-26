'use client';
import { useEffect, useState } from 'react';

export default function ServiceManagement() {
  const [services, setServices] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', duration_minutes: '' });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const res = await fetch('/api/services');
    const data = await res.json();
    setServices(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setFormData({ name: '', description: '', price: '', duration_minutes: '' });
    fetchServices();
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Manage <span className="text-gold">Services</span></h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 ">
        {/* Form */}
        <div className="glass-card p-5 h-fit ">
          <h3 className="text-xl font-bold mb-6">Add New Service</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Service Name</label>
              <input 
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-gold"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-gold h-24"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Price ($)</label>
                <input 
                  type="number"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-gold"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Duration (Min)</label>
                <input 
                  type="number"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-gold"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({...formData, duration_minutes: e.target.value})}
                />
              </div>
            </div>
            <button className="w-full bg-gold text-black font-bold py-3 rounded-lg hover:bg-gold-muted transition-colors">
              ADD SERVICE
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {services.map(service => (
            <div key={service.id} className="glass-card p-6 flex justify-between items-center">
              <div>
                <p className="text-xl font-bold">{service.name}</p>
                <p className="text-gray-400 text-sm">{service.description}</p>
              </div>
              <div className="text-right">
                <p className="text-gold font-bold text-xl">${service.price}</p>
                <p className="text-gray-500 text-xs uppercase">{service.duration_minutes} Minutes</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
