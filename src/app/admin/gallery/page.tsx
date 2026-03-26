'use client';
import { useEffect, useState } from 'react';

export default function GalleryManagement() {
  const [images, setImages] = useState<any[]>([]);
  const [formData, setFormData] = useState({ url: '', caption: '' });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const res = await fetch('/api/gallery');
    const data = await res.json();
    setImages(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setFormData({ url: '', caption: '' });
    fetchImages();
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Manage <span className="text-gold">Gallery</span></h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form */}
        <div className="glass-card p-8 h-fit">
          <h3 className="text-xl font-bold mb-6">Upload Image</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Image URL</label>
              <input 
                required
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-gold"
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Caption</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-gold"
                value={formData.caption}
                onChange={(e) => setFormData({...formData, caption: e.target.value})}
              />
            </div>
            <button className="w-full bg-gold text-black font-bold py-3 rounded-lg hover:bg-gold-muted transition-colors">
              UPLOAD TO GALLERY
            </button>
          </form>
        </div>

        {/* Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          {images.map(img => (
            <div key={img.id} className="aspect-square glass-card overflow-hidden group relative">
              <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-black/80 p-2 text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity">
                {img.caption || 'No caption'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
