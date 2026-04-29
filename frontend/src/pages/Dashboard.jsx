const cards = [
  { title: 'Total Revenue', value: '$1,245,000' },
  { title: 'Active Trips', value: '42' },
  { title: 'Delivered Loads', value: '1,380' },
  { title: 'Total Profit', value: '$325,000' },
  { title: 'Trucks Count', value: '88' },
  { title: 'Drivers Count', value: '112' }
];

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.title} className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
            <p className="text-zinc-400 text-sm">{card.title}</p>
            <p className="text-2xl font-bold text-accent mt-2">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
