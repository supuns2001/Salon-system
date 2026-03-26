'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Basic auth check
    const isAuthenticated = localStorage.getItem('admin_auth') === 'true';
    const userRole = localStorage.getItem('admin_role');
    
    if (!isAuthenticated && !isLoginPage) {
      router.push('/admin/login');
    } else {
      setRole(userRole);
      setLoading(false);
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_role');
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Appointments', href: '/admin/appointments' },
    { name: 'Live Queue', href: '/admin/queue' },
    { name: 'Services', href: '/admin/services' },
    { name: 'Staff', href: '/admin/staff' },
    { name: 'Staff Schedule', href: '/admin/staff/schedule' },
    { name: 'Gallery', href: '/admin/gallery' },
    { name: 'Working Hours', href: '/admin/settings/working-hours' },
    { name: 'Reports', href: '/admin/reports', role: 'owner' },
  ].filter(item => !item.role || item.role === role);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
        <p className="text-gold font-black uppercase tracking-widest text-xs">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-white/5 flex flex-col fixed inset-y-0">
        <div className="p-8">
          <h1 className="text-xl font-black text-gold tracking-tighter">LUXE ADMIN</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-xl transition-all ${
                  isActive ? 'bg-gold text-black font-bold shadow-lg shadow-gold/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/5 bg-white/[0.02]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors font-bold text-sm"
          >
            <span>LOGOUT SESSION</span>
            <span>⎋</span>
          </button>
          <Link href="/" className="block text-center mt-4 text-[10px] text-gray-600 hover:text-gray-400 transition-colors font-black uppercase tracking-widest">
            ← LUXE SALON SITE
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-12 bg-black">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

