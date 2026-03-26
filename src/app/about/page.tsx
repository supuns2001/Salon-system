import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 space-y-32">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            EXPERIENCE <span className="text-gold">EXCELLENCE</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Welcome to Luxe Salon, where beauty meets sophistication. Founded in 2020, we have been dedicated to providing premium hair and beauty services to our discerning clients. Our mission is to enhance your natural beauty with the latest techniques and high-quality products.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold shrink-0">
                📍
              </div>
              <div>
                <h4 className="font-bold text-xl">Location</h4>
                <p className="text-gray-400">123 Fashion St, Style City</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold shrink-0">
                🕒
              </div>
              <div>
                <h4 className="font-bold text-xl">Opening Hours</h4>
                <p className="text-gray-400">Mon - Fri: 09:00 AM - 08:00 PM</p>
                <p className="text-gray-400">Sat - Sun: 10:00 AM - 06:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold shrink-0">
                📞
              </div>
              <div>
                <h4 className="font-bold text-xl">Contact</h4>
                <p className="text-gray-400">Phone: 555-0123</p>
                <p className="text-gray-400">Email: hello@luxesalon.com</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute -inset-4 bg-gold/20 blur-3xl rounded-full z-0"></div>
          <img 
            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=1000" 
            alt="Salon Interior" 
            className="relative z-10 rounded-3xl shadow-2xl border border-white/10"
          />
        </div>
      </div>

      {/* Our Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 relative">
          <div className="absolute -inset-4 bg-gold/10 blur-3xl rounded-full z-0"></div>
          <img 
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000" 
            alt="Salon Service" 
            className="relative z-10 rounded-3xl shadow-2xl border border-white/10 object-cover aspect-video lg:aspect-square"
          />
        </div>
        <div className="order-1 lg:order-2">
          <h3 className="text-3xl font-bold mb-6">Our <span className="text-gold">Story</span></h3>
          <p className="text-gray-300 text-lg mb-6 leading-relaxed">
            What started as a small boutique salon has blossomed into the city's premier destination for personal care and styling. At Luxe Salon, we believe that true beauty comes from within, and our goal is to help you express it outwardly.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            Our team of expert stylists and aestheticians are passionate about their craft, continuously updating their skills with the latest international trends and techniques to bring you unparalleled service.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-12">Why Choose <span className="text-gold">Luxe?</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-gold/30 transition-colors">
            <div className="text-4xl mb-4">✨</div>
            <h4 className="text-xl font-bold mb-4">Premium Products</h4>
            <p className="text-gray-400">We use only the highest quality, luxury brands to ensure the best care for your hair and skin.</p>
          </div>
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-gold/30 transition-colors">
            <div className="text-4xl mb-4">✂️</div>
            <h4 className="text-xl font-bold mb-4">Expert Stylists</h4>
            <p className="text-gray-400">Our professionals are highly trained and experienced in the latest styling techniques.</p>
          </div>
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-gold/30 transition-colors">
            <div className="text-4xl mb-4">🌿</div>
            <h4 className="text-xl font-bold mb-4">Relaxing Atmosphere</h4>
            <p className="text-gray-400">Experience our serene and luxurious environment designed for your ultimate comfort.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gold/10 rounded-3xl p-12 text-center border border-gold/20">
        <h3 className="text-3xl font-bold mb-6">Ready for a Transformation?</h3>
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
          Book your appointment today and let our experts take care of the rest. Experience the Luxe difference.
        </p>
        <Link 
          href="/booking" 
          className="inline-block bg-gold text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-500 transition-colors shadow-lg hover:shadow-gold/20"
        >
          Book an Appointment
        </Link>
      </div>
    </div>
  );
}
