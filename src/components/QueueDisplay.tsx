interface QueueData {
  nowServing: string | number;
  next: string | number;
  waiting: number;
}

export default function QueueDisplay({ queue, large = false }: { queue: QueueData, large?: boolean }) {
  const containerClass = large ? "grid grid-cols-1 md:grid-cols-3 gap-6" : "grid grid-cols-1 md:grid-cols-3 gap-4";
  const cardPadding = large ? "p-10" : "p-6";
  const mainTextSize = large ? "text-7xl" : "text-4xl";
  const subTextSize = large ? "text-5xl" : "text-3xl";

  return (
    <div className={containerClass}>
      <div className={`glass-card ${cardPadding} text-center border-gold/30 flex flex-col items-center justify-center`}>
        <p className="text-gray-400 font-bold uppercase tracking-widest mb-2 text-xs">Now Serving</p>
        <p className={`${mainTextSize} font-black text-gold`}>{queue.nowServing}</p>
      </div>
      <div className={`glass-card ${cardPadding} text-center flex flex-col items-center justify-center`}>
        <p className="text-gray-400 font-bold uppercase tracking-widest mb-2 text-xs">Next Up</p>
        <p className={`${subTextSize} font-black text-white`}>{queue.next}</p>
      </div>
      <div className={`glass-card ${cardPadding} text-center flex flex-col items-center justify-center`}>
        <p className="text-gray-400 font-bold uppercase tracking-widest mb-2 text-xs">Waiting</p>
        <p className={`${subTextSize} font-black text-white`}>{queue.waiting}</p>
      </div>
    </div>
  );
}
