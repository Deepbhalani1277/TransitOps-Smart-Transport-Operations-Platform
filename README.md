# TransitOps — Smart Transport Operations Platform

TransitOps is a smart transport operations platform designed to manage and optimize vehicle fleets, driver assignments, trips, maintenance logs, and financial metrics in real-time.

## Tech Stack
- **Frontend**: React (Vite) + TypeScript + Tailwind CSS
- **Backend**: Python FastAPI + SQLAlchemy (PostgreSQL via Neon) + Alembic
- **Database**: PostgreSQL

---

## Getting Started

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # On Windows
   python -m venv .venv
   .venv\Scripts\activate

   # On macOS/Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment template and fill in the database URL (e.g. Neon connection string) and JWT keys:
   ```bash
   cp .env.example .env
   ```
5. Apply database migrations:
   ```bash
   alembic upgrade head
   ```
6. Start the development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend will be available at [http://localhost:8000](http://localhost:8000) and Swagger API docs at [http://localhost:8000/docs](http://localhost:8000/docs).

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node packages:
   ```bash
   npm install
   ```
3. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
4. Start the frontend Vite development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at [http://localhost:5173](http://localhost:5173).

---

## Team Split & Responsibilities

| Role | Developer | Scope / Modules |
|---|---|---|
| **Person 1** | Frontend Lead | Full Vite setup, page layouts, components, router integration, state, styling |
| **Person 2** | Backend Core | `auth`, `vehicles`, `drivers` routers & domain logic |
| **Person 3** | Backend Operations | `trips`, `maintenance`, `fuel_expenses`, `reports` routers & domain logic |

---

## API Contract
The full set of endpoints, request formats, and response shapes can be found in [API_CONTRACT.md](./API_CONTRACT.md).

---

## Business Rules

1. A vehicle with status **"On Trip"** cannot be assigned to another trip.
2. A driver with status **"On Trip"** cannot be assigned to another trip.
3. A driver with status **"Suspended"** cannot be assigned to any trip.
4. **cargo_weight_kg** must not exceed the assigned vehicle's **max_capacity_kg**.
5. Dispatching a trip sets status to **"Dispatched"**, records **dispatched_at**, and sets vehicle + driver to **"On Trip"**.
6. Completing a trip sets status to **"Completed"**, records **completed_at**, **actual_distance_km**, **fuel_consumed_l**, adds to vehicle odometer, and resets vehicle + driver to **"Available"**.
7. A vehicle with status **"In Shop"** (active maintenance) cannot be dispatched.
8. Creating a maintenance log with status **"Active"** sets the vehicle to **"In Shop"**; closing it sets the vehicle back to **"Available"**.
9. **Safety score** adjustments: completing a trip adds +1 (capped at 100); if fuel efficiency is poor (> 10 L / 100 km), subtract 2.
10. Only **"Fleet Manager"** role can create/edit vehicles and drivers; **"Dispatcher"** can create/dispatch trips; **"Safety Officer"** views reports + driver scores; **"Financial Analyst"** views cost/fuel reports.

---

## Branching & Workflow Convention

- **main**: This branch holds the baseline empty project structure, database models, pydantic schemas, and API stubs.
- **Workflow**:
  - Person 1 develops on the `frontend` branch.
  - Person 2 develops on the `backend-core` branch.
  - Person 3 develops on the `backend-ops` branch.
  - Pull Requests (PRs) should be opened and reviewed before merging back to `main`.
