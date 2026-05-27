# FastAPI Backend

This is the FastAPI backend service for the project, restructured using a clean, scalable architectural pattern (separating models, routes, database state, and utilities).

## Project Structure

The project has been refactored into modular directories:

```text
backend/
├── app/
│   ├── main.py             # Main entry point (CORS, Middlewares, Router inclusion)
│   ├── database.py         # Mock in-memory database state
│   ├── models/             # Pydantic data schemas
│   │   ├── __init__.py
│   │   ├── item.py
│   │   └── todo.py
│   ├── routes/             # API route controllers grouped logically
│   │   ├── __init__.py
│   │   ├── health.py
│   │   ├── item.py
│   │   ├── todo.py
│   │   └── user.py
│   └── utils/              # Helper utilities and exception handlers
│       ├── __init__.py
│       └── exceptions.py
├── requirements.txt        # Backend dependencies
└── readme.md               # This file
```

---

## Prerequisites

Make sure you have Python installed and your virtual environment is set up.

---

## How to Run

### 1. Activate the Virtual Environment
From the project root directory, activate the environment:

**Windows (PowerShell):**
```powershell
.\fastapi\Scripts\activate
```

**macOS/Linux:**
```bash
source fastapi/bin/activate
```

### 2. Install Dependencies
Ensure all packages are installed from the backend folder's requirements:
```powershell
pip install -r requirements.txt
```

### 3. Start the Backend Server

You can start the backend in one of two ways depending on which directory you are currently in:

#### Option A: Run from inside the `backend` folder (Recommended)
First, navigate to the `backend` directory, then start the server:
```powershell
cd backend
uvicorn app.main:app --reload
```

#### Option B: Run from the project root folder
If you are in the root directory of the project and don't want to change folders, you must specify the application directory so Python can find the `app` module:
```powershell
uvicorn app.main:app --reload --app-dir backend
```

The server will start locally on [http://127.0.0.1:8000](http://127.0.0.1:8000).

---

## API Documentation
Once the server is running, you can explore and test the API endpoints interactively:
- **Swagger UI docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc docs**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
