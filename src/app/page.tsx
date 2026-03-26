'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ServiceCard from '@/components/ServiceCard';
import StaffCard from '@/components/StaffCard';

export default function Home() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/gallery').then(res => res.json()).then(data => setGallery(data.slice(0, 6)));
    fetch('/api/staff').then(res => res.json()).then(data => setStaff(data.slice(0, 3)));
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=2000" 
            alt="Salon Hero" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 text-center px-4">
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter animate-fade-in">
            LUXE <span className="text-gold">SALON</span>
          </h1>
          <p className="text-xl md:text-3xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Where Artistry Meets Precision. Redefine your style in the most luxurious setting.
          </p>
          <div className="flex flex-col sm:row gap-6 justify-center">
            <Link href="/booking" className="bg-gold text-black px-10 py-5 rounded-full text-xl font-black hover:scale-105 transition-transform shadow-lg shadow-gold/20">
              Book Appointment
            </Link>
            <Link href="/gallery" className="border border-white/20 bg-white/5 backdrop-blur-md px-10 py-5 rounded-full text-xl font-black hover:bg-white/10 transition-colors">
              Explore Gallery
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-gold rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 px-4 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">THE <span className="text-gold">PHILOSOPHY</span></h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                At Luxe Salon, we believe that your hair is the ultimate expression of your identity. Our mission is to provide an unparalleled grooming experience that combines traditional craftsmanship with modern innovation.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Every client is a canvas, and our master stylists are dedicated to bringing out the most confident version of you through tailored cuts and premium treatments.
              </p>
              <Link href="/about" className="text-gold font-bold text-lg hover:underline flex items-center gap-2">
                Discover Our Story &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden glass-card">
                <img src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Interior" />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden glass-card mt-12">
                <img src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Service" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-4 bg-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-10 hover:border-gold/30 transition-colors">
              <div className="text-5xl mb-6">🧴</div>
              <h3 className="text-2xl font-bold mb-4">Master Craftsmanship</h3>
              <p className="text-gray-400 leading-relaxed">Our team consists of internationally trained stylists with decades of collective experience in high-fashion hairdressing.</p>
            </div>
            <div className="glass-card p-10 hover:border-gold/30 transition-colors">
              <div className="text-5xl mb-6">💎</div>
              <h3 className="text-2xl font-bold mb-4">Luxury Experience</h3>
              <p className="text-gray-400 leading-relaxed">From the moment you walk through our doors, you are treated to a premium environment designed for ultimate relaxation.</p>
            </div>
            <div className="glass-card p-10 hover:border-gold/30 transition-colors">
              <div className="text-5xl mb-6">🌿</div>
              <h3 className="text-2xl font-bold mb-4">Eco-Friendly Luxury</h3>
              <p className="text-gray-400 leading-relaxed">We exclusively use sustainable, vegan-certified products that are as good for the planet as they are for your hair.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Home Gallery Section */}
      <section className="py-24 px-4 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">CURATED <span className="text-gold">WORKS</span></h2>
            <div className="w-24 h-1 bg-gold mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {gallery.length > 0 ? (
              gallery.map((img) => (
                <div key={img.id} className="aspect-square rounded-2xl overflow-hidden glass-card group relative">
                  <img 
                    src={img.url} 
                    alt={img.caption || 'Salon Work'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <p className="text-gold font-bold">{img.caption}</p>
                  </div>
                </div>
              ))
            ) : (
              [1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-square rounded-2xl bg-white/5 border border-white/10 animate-pulse"></div>
              ))
            )}
          </div>
          <div className="text-center mt-12">
            <Link href="/gallery" className="inline-block border border-gold text-gold px-8 py-3 rounded-full font-bold hover:bg-gold hover:text-black transition-all">
              View All Moments
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Staff */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-bold tracking-tight">MEET THE <span className="text-gold">ARTISTS</span></h2>
              <div className="w-16 h-1 bg-gold mt-2"></div>
            </div>
            <Link href="/about" className="text-gold hover:underline font-bold">More About Us &rarr;</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {staff.length > 0 ? (
              staff.map((member) => (
                <div key={member.id} className="glass-card group hover:border-gold/50 transition-all p-6">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden mb-6 relative">
                    <img src={member.photo_url || 'https://via.placeholder.com/400x500'} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
                       <p className="font-black text-xl">{member.name}</p>
                       <p className="text-gold text-xs uppercase font-bold">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-3 italic mb-4">"{member.bio}"</p>
                  <p className="text-white text-xs font-bold uppercase tracking-widest">{member.experience} Experience</p>
                </div>
              ))
            ) : (
              [1, 2, 3].map(i => (
                <div key={i} className="aspect-[3/4] rounded-xl bg-white/5 border border-white/10 animate-pulse"></div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-20" alt="CTA BG" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-8">READY FOR A <span className="text-gold">TRANSFORMATION?</span></h2>
          <p className="text-2xl text-gray-400 mb-12">Your throne awaits. Book your premium session today and experience the gold standard of grooming.</p>
          <Link href="/booking" className="inline-block bg-gold text-black px-12 py-6 rounded-full text-2xl font-black hover:scale-110 transition-transform shadow-2xl shadow-gold/30">
            SECURE YOUR SPOT
          </Link>
        </div>
      </section>
    </div>
  );
}
