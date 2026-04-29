const navItems = ['Dashboard', 'Loads', 'Trucks', 'Drivers'];

export default function Sidebar({ current, onSelect }) {
  return (
    <aside className="w-full md:w-64 bg-zinc-950 border-r border-zinc-800 p-4">
      <h1 className="text-xl font-bold text-accent mb-6">AEL System</h1>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => onSelect(item)}
            className={`w-full text-left px-3 py-2 rounded ${current === item ? 'bg-accent text-black font-semibold' : 'hover:bg-zinc-800'}`}
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}
