import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./ael.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS loads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    load_id TEXT NOT NULL,
    client TEXT NOT NULL,
    route TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Pending', 'In Transit', 'Delivered')),
    pickup_date TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS trucks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    truck_id TEXT NOT NULL,
    plate_number TEXT NOT NULL,
    status TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    assigned_truck TEXT,
    trips_completed INTEGER DEFAULT 0
  )`);
});

const all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
});
const get = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
});
const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function onRun(err) {
    if (err) reject(err);
    else resolve({ id: this.lastID, changes: this.changes });
  });
});

app.get('/api/loads', async (_, res) => {
  res.json(await all('SELECT * FROM loads ORDER BY id DESC'));
});

app.post('/api/loads', async (req, res) => {
  const { load_id, client, route, status, pickup_date } = req.body;
  const result = await run(
    'INSERT INTO loads (load_id, client, route, status, pickup_date) VALUES (?, ?, ?, ?, ?)',
    [load_id, client, route, status, pickup_date]
  );
  res.status(201).json(await get('SELECT * FROM loads WHERE id = ?', [result.id]));
});

app.put('/api/loads/:id', async (req, res) => {
  const { load_id, client, route, status, pickup_date } = req.body;
  await run(
    'UPDATE loads SET load_id = ?, client = ?, route = ?, status = ?, pickup_date = ? WHERE id = ?',
    [load_id, client, route, status, pickup_date, req.params.id]
  );
  res.json(await get('SELECT * FROM loads WHERE id = ?', [req.params.id]));
});

app.delete('/api/loads/:id', async (req, res) => {
  await run('DELETE FROM loads WHERE id = ?', [req.params.id]);
  res.status(204).end();
});

app.get('/api/trucks', async (_, res) => {
  res.json(await all('SELECT * FROM trucks ORDER BY id DESC'));
});

app.post('/api/trucks', async (req, res) => {
  const { truck_id, plate_number, status } = req.body;
  const result = await run(
    'INSERT INTO trucks (truck_id, plate_number, status) VALUES (?, ?, ?)',
    [truck_id, plate_number, status]
  );
  res.status(201).json(await get('SELECT * FROM trucks WHERE id = ?', [result.id]));
});

app.put('/api/trucks/:id', async (req, res) => {
  const { truck_id, plate_number, status } = req.body;
  await run('UPDATE trucks SET truck_id = ?, plate_number = ?, status = ? WHERE id = ?', [truck_id, plate_number, status, req.params.id]);
  res.json(await get('SELECT * FROM trucks WHERE id = ?', [req.params.id]));
});

app.delete('/api/trucks/:id', async (req, res) => {
  await run('DELETE FROM trucks WHERE id = ?', [req.params.id]);
  res.status(204).end();
});

app.get('/api/drivers', async (_, res) => {
  res.json(await all('SELECT * FROM drivers ORDER BY id DESC'));
});

app.post('/api/drivers', async (req, res) => {
  const { name, assigned_truck, trips_completed } = req.body;
  const result = await run(
    'INSERT INTO drivers (name, assigned_truck, trips_completed) VALUES (?, ?, ?)',
    [name, assigned_truck, Number(trips_completed) || 0]
  );
  res.status(201).json(await get('SELECT * FROM drivers WHERE id = ?', [result.id]));
});

app.put('/api/drivers/:id', async (req, res) => {
  const { name, assigned_truck, trips_completed } = req.body;
  await run(
    'UPDATE drivers SET name = ?, assigned_truck = ?, trips_completed = ? WHERE id = ?',
    [name, assigned_truck, Number(trips_completed) || 0, req.params.id]
  );
  res.json(await get('SELECT * FROM drivers WHERE id = ?', [req.params.id]));
});

app.delete('/api/drivers/:id', async (req, res) => {
  await run('DELETE FROM drivers WHERE id = ?', [req.params.id]);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`AEL backend running on http://localhost:${PORT}`);
});
