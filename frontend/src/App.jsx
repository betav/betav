import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Loads from './pages/Loads';
import Trucks from './pages/Trucks';
import Drivers from './pages/Drivers';

export default function App() {
  const [page, setPage] = useState('Dashboard');

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-white">
      <Sidebar current={page} onSelect={setPage} />
      <main className="flex-1 p-6 bg-zinc-900">
        {page === 'Dashboard' && <Dashboard />}
        {page === 'Loads' && <Loads />}
        {page === 'Trucks' && <Trucks />}
        {page === 'Drivers' && <Drivers />}
      </main>
    </div>
  );
}
