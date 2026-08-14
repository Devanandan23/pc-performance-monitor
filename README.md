# PC Performance Monitor

A learning-focused portfolio project that will grow into a desktop-friendly web dashboard for real PC performance data.

## Stage 1 status

The React frontend has been created with Vite and Git has been initialized. Future stages will add the dashboard UI, navigation, a Python monitoring agent, a Django REST API, and historical storage incrementally.

## Planned architecture

```text
PC metrics (Python + psutil)
            |
       Django REST API
            |
       PostgreSQL history
            |
       React dashboard
```

## Run the frontend

```powershell
cd frontend
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## Project structure

```text
pc-performance-monitor/
├── frontend/            # React + Vite application
├── backend/             # Reserved for Django (future stage)
├── monitoring-agent/    # Reserved for Python + psutil (future stage)
├── README.md
└── .gitignore
```
