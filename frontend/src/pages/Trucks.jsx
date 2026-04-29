import { useEffect, useState } from 'react';
const API = 'http://localhost:4000/api/trucks';

export default function Trucks() {
  const [trucks, setTrucks] = useState([]);
  const [form, setForm] = useState({ truck_id: '', plate_number: '', status: 'Available' });
  const fetchTrucks = async () => setTrucks(await (await fetch(API)).json());
  useEffect(() => { fetchTrucks(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ truck_id: '', plate_number: '', status: 'Available' });
    fetchTrucks();
  };

  return <section>
    <h2 className="text-2xl font-bold mb-4">Truck Management</h2>
    <form onSubmit={submit} className="grid md:grid-cols-4 gap-3 bg-zinc-800 p-4 rounded-xl mb-6">
      <input className="bg-zinc-900 p-2 rounded" placeholder="Truck ID" value={form.truck_id} onChange={(e) => setForm({ ...form, truck_id: e.target.value })} required />
      <input className="bg-zinc-900 p-2 rounded" placeholder="Plate Number" value={form.plate_number} onChange={(e) => setForm({ ...form, plate_number: e.target.value })} required />
      <input className="bg-zinc-900 p-2 rounded" placeholder="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} required />
      <button className="bg-accent text-black rounded font-semibold">Add Truck</button>
    </form>
    <div className="grid md:grid-cols-2 gap-3">{trucks.map((t) => <div key={t.id} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4"><p className="font-semibold">{t.truck_id}</p><p>{t.plate_number}</p><p className="text-accent">{t.status}</p></div>)}</div>
  </section>;
}
