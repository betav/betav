# Alpha Empire Logistics System (AEL)

Full-stack logistics dashboard with React + Vite frontend, Express backend, and SQLite database.

## Project Structure

- `frontend/` React app (Vite + TailwindCSS)
- `backend/` Express REST API + SQLite (`ael.db`)

## Features

- **Dashboard** with KPI cards (mock values)
- **Loads**: create, list, and update status
- **Trucks**: add and list trucks
- **Drivers**: add and list drivers
- Dark theme + red accent enterprise UI

## Run Locally

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs at `http://localhost:4000`.

### 2) Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` (default Vite).

## API Endpoints

### Loads
- `GET /api/loads`
- `POST /api/loads`
- `PUT /api/loads/:id`
- `DELETE /api/loads/:id`

### Trucks
- `GET /api/trucks`
- `POST /api/trucks`
- `PUT /api/trucks/:id`
- `DELETE /api/trucks/:id`

### Drivers
- `GET /api/drivers`
- `POST /api/drivers`
- `PUT /api/drivers/:id`
- `DELETE /api/drivers/:id`

## Notes

- SQLite file is auto-created as `backend/ael.db`.
- Designed to be clean and expandable for future modules (auth, dispatching, invoicing, analytics).
