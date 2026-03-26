'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // In a real app, you'd store a token or session
        localStorage.setItem('admin_auth', 'true');
        localStorage.setItem('admin_role', data.user.role || 'stylist');
        router.push('/admin');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
            LUXE <span className="text-gold">ADMIN</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            Management Portal Access
          </p>
        </div>

        <div className="glass-card p-10 border-white/5 relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden">
          {/* Subtle top glow */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl text-center font-bold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                Username
              </label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-gold/50 transition-all placeholder:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                Password
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-gold/50 transition-all placeholder:text-gray-600"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-muted text-black font-black py-4 rounded-2xl text-lg transition-all shadow-lg shadow-gold/10 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'AUTHENTICATING...' : 'SECURE LOGIN'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              Authorized Personnel Only
            </p>
            <div className="w-8 h-[1px] bg-white/10 mx-auto mt-4"></div>
          </div>
        </div>

        <button 
          onClick={() => router.push('/')}
          className="mt-8 mx-auto flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-tighter"
        >
          <span>←</span> Back to Salon Website
        </button>
      </div>
    </div>
  );
}
