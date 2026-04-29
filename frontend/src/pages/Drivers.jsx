import { useEffect, useState } from 'react';
const API = 'http://localhost:4000/api/drivers';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({ name: '', assigned_truck: '', trips_completed: 0 });

  const fetchDrivers = async () => setDrivers(await (await fetch(API)).json());
  useEffect(() => { fetchDrivers(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ name: '', assigned_truck: '', trips_completed: 0 });
    fetchDrivers();
  };

  return <section>
    <h2 className="text-2xl font-bold mb-4">Driver Management</h2>
    <form onSubmit={submit} className="grid md:grid-cols-4 gap-3 bg-zinc-800 p-4 rounded-xl mb-6">
      <input className="bg-zinc-900 p-2 rounded" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input className="bg-zinc-900 p-2 rounded" placeholder="Assigned Truck" value={form.assigned_truck} onChange={(e) => setForm({ ...form, assigned_truck: e.target.value })} required />
      <input className="bg-zinc-900 p-2 rounded" type="number" min="0" placeholder="Trips Completed" value={form.trips_completed} onChange={(e) => setForm({ ...form, trips_completed: Number(e.target.value) })} required />
      <button className="bg-accent text-black rounded font-semibold">Add Driver</button>
    </form>
    <div className="overflow-x-auto">
      <table className="w-full text-sm bg-zinc-800 rounded-xl overflow-hidden">
        <thead className="bg-zinc-700"><tr><th className="p-2">Name</th><th>Assigned Truck</th><th>Trips Completed</th></tr></thead>
        <tbody>{drivers.map((d) => <tr key={d.id} className="border-t border-zinc-700"><td className="p-2">{d.name}</td><td>{d.assigned_truck}</td><td>{d.trips_completed}</td></tr>)}</tbody>
      </table>
    </div>
  </section>;
}
