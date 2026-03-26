interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
}

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="glass-card p-8 hover:border-gold/50 transition-colors">
      <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
      <p className="text-gray-400 mb-6">{service.description}</p>
      <div className="flex justify-between items-center text-lg font-bold">
        <span className="text-gold">${service.price}</span>
        <span className="text-gray-500">{service.duration_minutes} min</span>
      </div>
    </div>
  );
}
