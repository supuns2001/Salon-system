'use client';
import { useEffect, useState } from 'react';
import QueueDisplay from '@/components/QueueDisplay';
import BookingForm from '@/components/BookingForm';
import { initiateSocketConnection, subscribeToQueueUpdates, disconnectSocket } from '@/lib/socket';

export default function BookingPage() {
  const [queue, setQueue] = useState({ nowServing: '-', next: '-', waiting: 0 });
  const [services, setServices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [bookingConfirmed, setBookingConfirmed] = useState<any>(null);

  useEffect(() => {
    const setupSocket = async () => {
      await fetch('/api/socket');
      initiateSocketConnection();
      subscribeToQueueUpdates(() => {
        fetchQueue();
      });
    };

    setupSocket();
    fetchQueue();
    fetch('/api/services').then(res => res.json()).then(setServices);
    fetch('/api/staff').then(res => res.json()).then(setStaff);
    fetch('/api/gallery').then(res => res.json()).then(data => setGallery(data.slice(0, 4)));

    const interval = setInterval(fetchQueue, 15000); // Backup polling
    return () => {
      clearInterval(interval);
      disconnectSocket();
    };
  }, []);

  const fetchQueue = async () => {
    const res = await fetch('/api/queue/status');
    const data = await res.json();
    setQueue(data);
  };

  const handleBookingSuccess = (data: any) => {
    setBookingConfirmed(data);
    fetchQueue();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-16">
        <QueueDisplay queue={queue} large />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
        <div className="glass-card p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8">Book an <span className="text-gold">Appointment</span></h2>
          
          {bookingConfirmed ? (
            <div className="bg-green-500/10 border border-green-500/50 p-8 rounded-xl text-center">
              <p className="text-2xl font-bold text-green-500 mb-2">Booking Confirmed!</p>
              <p className="text-lg mb-6">Your queue number is:</p>
              <p className="text-6xl font-black mb-6">#{bookingConfirmed.appointment_number}</p>
              <button 
                onClick={() => setBookingConfirmed(null)}
                className="bg-white text-black px-6 py-2 rounded-lg font-bold"
              >
                Book Another
              </button>
            </div>
          ) : (
            <BookingForm 
              services={services} 
              staff={staff} 
              onSuccess={handleBookingSuccess} 
            />
          )}
        </div>

        <div className="flex flex-col justify-center">
          <h3 className="text-3xl font-bold mb-6">Real-Time <span className="text-gold">Queue Updates</span></h3>
          <p className="text-gray-400 text-lg mb-8">
            Stay updated with our live queue tracker. Once you book, you'll receive a unique appointment number. Keep this page open to see when it's your turn to be served.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-gray-400">Live Connection Active</span>
            </div>
            
            <div className="glass-card p-6 border-white/5">
              <h4 className="font-bold text-gold mb-2">Safety Protocols</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your safety is our priority. We maintain medical-grade sterilization for all tools and perform deep cleaning between every appointment. Our staff follows strict hygiene protocols to ensure a safe and premium experience.
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
              <p className="italic text-gray-300">"The fastest way to get your hair done. I missed the wait!"</p>
              <p className="mt-2 font-bold">- Sarah J.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Gallery Section */}
      <div className="mb-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-3xl font-bold tracking-tight">LATEST <span className="text-gold">WORK</span></h3>
            <div className="w-16 h-1 bg-gold mt-2"></div>
          </div>
          <a href="/gallery" className="text-gold hover:underline font-bold">View Full Gallery &rarr;</a>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.length > 0 ? (
            gallery.map((img) => (
              <div key={img.id} className="aspect-square rounded-xl overflow-hidden glass-card group relative">
                <img 
                  src={img.url} 
                  alt={img.caption || 'Salon Work'} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))
          ) : (
            // Placeholder images if gallery is empty
            [1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square rounded-xl bg-white/5 border border-white/10 animate-pulse flex items-center justify-center text-gray-700">
                Luxe Salon
              </div>
            ))
          )}
        </div>
      </div>

      {/* Why Choose Us / Testimonials Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-8">
          <div className="text-gold text-3xl mb-4 text-center">🏆</div>
          <h4 className="text-xl font-bold mb-4 text-center">Award Winning</h4>
          <p className="text-gray-400 text-sm text-center leading-relaxed">
            Voted best salon in Style City for three consecutive years. Our master stylists are industry leaders.
          </p>
        </div>
        <div className="glass-card p-8 border-gold/20">
          <div className="text-gold text-3xl mb-4 text-center">✨</div>
          <h4 className="text-xl font-bold mb-4 text-center">Premium Products</h4>
          <p className="text-gray-400 text-sm text-center leading-relaxed">
            We use only the finest organic and high-performance products to ensure your hair stays healthy and vibrant.
          </p>
        </div>
        <div className="glass-card p-8">
          <div className="text-gold text-3xl mb-4 text-center">🤝</div>
          <h4 className="text-xl font-bold mb-4 text-center">Personalized Care</h4>
          <p className="text-gray-400 text-sm text-center leading-relaxed">
            Every service begins with a professional consultation to understand your unique style and needs.
          </p>
        </div>
      </div>
    </div>
  );
}
