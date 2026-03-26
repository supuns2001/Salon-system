'use client';
import { useEffect, useState } from 'react';

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('admin_role');
    if (role !== 'owner') {
      window.location.href = '/admin';
    } else {
      setIsOwner(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/reports/dashboard');
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOwner || loading) return <div className="p-8 text-gray-500 text-center">Loading reports...</div>;
  if (!data) return <div className="p-8 text-red-500 text-center">Failed to load data.</div>;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8 text-white">Reports & <span className="text-gold">Analytics</span></h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="glass-card p-6 border-gold/20">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">Total Today</p>
          <p className="text-4xl font-black text-gold">{data.summary.totalToday}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">Walk-Ins</p>
          <p className="text-3xl font-black text-white">{data.summary.walkinsToday}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">Online Bookings</p>
          <p className="text-3xl font-black text-white">{data.summary.onlineToday}</p>
        </div>
        <div className="glass-card p-6 border-green-500/20">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">Revenue Today</p>
          <p className="text-3xl font-black text-green-500">${data.summary.revenueToday}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Services */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-6 text-white">Most Popular <span className="text-gold">Services</span></h3>
          <div className="space-y-4">
            {data.charts.services.map((s: any, i: number) => (
              <div key={s.name} className="flex items-center gap-4">
                <span className="text-gray-500 font-bold w-4">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-bold">{s.name}</span>
                    <span className="text-xs text-gray-500">{s.count} bookings</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gold h-full rounded-full" 
                      style={{ width: `${(s.count / data.charts.services[0].count) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Performance */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-6 text-white">Staff <span className="text-gold">Performance</span></h3>
          <div className="space-y-4">
            {data.charts.staff.map((s: any) => (
              <div key={s.name} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-bold">{s.name}</span>
                    <span className="text-xs text-gray-500">{s.count} completed</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-white h-full rounded-full" 
                      style={{ width: `${(s.count / data.charts.staff[0].count) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Trend */}
        <div className="glass-card p-8 lg:col-span-2">
          <h3 className="text-xl font-bold mb-6 text-white">Last 7 Days <span className="text-gold">Trend</span></h3>
          <div className="flex items-end justify-between gap-4 h-56 pt-8">
            {(() => {
              const maxCount = Math.max(...data.charts.daily.map((d: any) => d.count), 1);
              // A palette of dark, luxurious colors
              const colors = [
                'from-zinc-800 to-zinc-700',
                'from-slate-800 to-slate-700',
                'from-gray-800 to-gray-700',
                'from-neutral-800 to-neutral-700',
                'from-stone-800 to-stone-700',
                'from-zinc-900 to-zinc-800',
                'from-neutral-900 to-neutral-800'
              ];

              return data.charts.daily.map((d: any, index: number) => {
                const heightPercentage = (d.count / maxCount) * 100;
                // Only show number inside the bar if it's tall enough, otherwise show it above
                const isTallEnough = heightPercentage > 20;
                // Cycle through the vibrant color palette based on index
                const colorClass = colors[index % colors.length];

                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                    <div className="relative w-full max-w-[190px] flex-1 flex flex-col items-center justify-end">
                      {/* Value display: Shows above if bar is too short */}
                      {!isTallEnough && (
                        <span className="text-lg font-bold text-white mb-2 transform transition-transform group-hover:-translate-y-1">
                          {d.count}
                        </span>
                      )}
                      <div 
                        className={`w-full bg-gradient-to-t ${colorClass} border-gold/20 border-t-2 opacity-80 hover:opacity-100 rounded-t-lg transition-all flex flex-col items-center justify-start overflow-hidden shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] pt-2`}
                        style={{ height: `${heightPercentage}%`, minHeight: '4px' }}
                      >
                        {/* Value display: Shows inside if bar is tall enough */}
                        {isTallEnough && (
                          <span className="text-lg font-bold text-gray-300 drop-shadow-md">
                            {d.count}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-400 font-bold uppercase h-6 group-hover:text-white transition-colors">
                      {new Date(d.day).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
