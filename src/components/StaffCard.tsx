interface Staff {
  id: number;
  name: string;
  role: string;
  photo_url?: string;
}

export default function StaffCard({ staff }: { staff: Staff }) {
  return (
    <div className="glass-card p-6 flex items-center gap-6">
      <div className="w-20 h-20 rounded-full overflow-hidden bg-white/5 border border-white/10">
        {staff.photo_url ? (
          <img src={staff.photo_url} alt={staff.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl text-gray-700">👤</div>
        )}
      </div>
      <div>
        <p className="text-xl font-bold">{staff.name}</p>
        <p className="text-gold font-bold text-sm uppercase">{staff.role}</p>
      </div>
    </div>
  );
}
