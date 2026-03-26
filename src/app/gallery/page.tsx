'use client';
import { useEffect, useState } from 'react';

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        setImages(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 tracking-tight">SALON <span className="text-gold">GALLERY</span></h2>
        <div className="w-24 h-1 bg-gold mx-auto"></div>
      </div>

      {loading ? (
        <div className="text-center">Loading gallery...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.id} className="aspect-square rounded-xl overflow-hidden glass-card group">
              <img 
                src={img.url} 
                alt={img.caption || 'Salon Photo'} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {img.caption && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center">
                  <p className="text-white font-medium">{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
