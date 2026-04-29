import { useEffect, useState } from 'react';

const API = 'http://localhost:4000/api/loads';
const defaultForm = { load_id: '', client: '', route: '', status: 'Pending', pickup_date: '' };

export default function Loads() {
  const [loads, setLoads] = useState([]);
  const [form, setForm] = useState(defaultForm);

  const fetchLoads = async () => setLoads(await (await fetch(API)).json());
  useEffect(() => { fetchLoads(); }, []);

  const createLoad = async (e) => {
    e.preventDefault();
    await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm(defaultForm);
    fetchLoads();
  };

  const updateStatus = async (load, status) => {
    await fetch(`${API}/${load.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...load, status }) });
    fetchLoads();
  };

  return <section>
    <h2 className="text-2xl font-bold mb-4">Load Management</h2>
    <form onSubmit={createLoad} className="grid md:grid-cols-5 gap-3 bg-zinc-800 p-4 rounded-xl mb-6">
      <input className="bg-zinc-900 p-2 rounded" placeholder="Load ID" value={form.load_id} onChange={(e) => setForm({ ...form, load_id: e.target.value })} required />
      <input className="bg-zinc-900 p-2 rounded" placeholder="Client" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} required />
      <input className="bg-zinc-900 p-2 rounded" placeholder="Route" value={form.route} onChange={(e) => setForm({ ...form, route: e.target.value })} required />
      <select className="bg-zinc-900 p-2 rounded" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
        <option>Pending</option><option>In Transit</option><option>Delivered</option>
      </select>
      <input className="bg-zinc-900 p-2 rounded" type="date" value={form.pickup_date} onChange={(e) => setForm({ ...form, pickup_date: e.target.value })} required />
      <button className="md:col-span-5 bg-accent text-black py-2 rounded font-semibold">Add Load</button>
    </form>

    <div className="overflow-x-auto">
      <table className="w-full text-sm bg-zinc-800 rounded-xl overflow-hidden">
        <thead className="bg-zinc-700"><tr><th className="p-2">Load ID</th><th>Client</th><th>Route</th><th>Status</th><th>Pickup Date</th></tr></thead>
        <tbody>{loads.map((l) => <tr key={l.id} className="border-t border-zinc-700">
          <td className="p-2">{l.load_id}</td><td>{l.client}</td><td>{l.route}</td>
          <td><select className="bg-zinc-900 p-1 rounded" value={l.status} onChange={(e) => updateStatus(l, e.target.value)}><option>Pending</option><option>In Transit</option><option>Delivered</option></select></td>
          <td>{l.pickup_date}</td>
        </tr>)}</tbody>
      </table>
    </div>
  </section>;
}
