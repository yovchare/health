# Quick Start Guide

## 🚀 Getting Your Health Tracker Running

This guide will help you get the Health Tracker application up and running in just a few minutes.

## Prerequisites Check

Before starting, make sure you have:
- ✅ Python 3.8+ installed: `python3 --version`
- ✅ Node.js 16+ installed: `node --version`
- ✅ npm installed: `npm --version`

## Option 1: One-Command Startup (Recommended) ⚡

From the **root directory** of the project, simply run:

```bash
./start.sh
```

This unified startup script will automatically:
- ✅ Check system dependencies
- ✅ Create Python virtual environment (if needed)
- ✅ Install all backend dependencies
- ✅ Install all frontend dependencies
- ✅ Create necessary directories
- ✅ Start both backend and frontend servers
- ✅ Display logs and status information

**Press Ctrl+C to stop all services**

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

Logs are written to:
- `backend.log` - Backend server logs
- `frontend.log` - Frontend server logs

You can view logs in real-time with:
```bash
tail -f backend.log
tail -f frontend.log
```

## Option 2: Using Individual Start Scripts

### Start Backend

```bash
cd backend
./start.sh
```

The script will:
- Create a virtual environment if needed
- Install Python dependencies
- Start the FastAPI server on http://localhost:8000

### Start Frontend (in a new terminal)

```bash
cd frontend
./start.sh
```

The script will:
- Install npm dependencies if needed
- Start the Vite dev server on http://localhost:5173

## Option 3: Manual Setup

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup (in a new terminal)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 🎉 Access the Application

- **Frontend App**: http://localhost:5173
- **API Documentation**: http://localhost:8000/docs
- **API Root**: http://localhost:8000

## 🧪 Testing the API

You can test the API using curl:

```bash
# Health check
curl http://localhost:8000/health

# Create a workout
curl -X POST "http://localhost:8000/api/workouts/" \
  -H "Content-Type: application/json" \
  -d '{
    "workout_type": "Running",
    "date": "2026-01-01",
    "duration_minutes": 30,
    "notes": "Morning run"
  }'

# Get all workouts
curl http://localhost:8000/api/workouts/
```

## 🛠️ Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Find and kill the process using port 8000
lsof -ti:8000 | xargs kill -9
```

**Module not found errors:**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### Frontend Issues

**Port already in use:**
```bash
# Find and kill the process using port 5173
lsof -ti:5173 | xargs kill -9
```

**Dependencies issues:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Cannot connect to API:**
- Make sure the backend is running on port 8000
- Check the `.env` file in frontend directory
- Verify CORS settings in backend `.env`

## 📁 Important File Locations

- **Database**: `backend/data/health.db`
- **Backups**: `backend/backups/`
- **Backend Logs**: Check terminal output
- **Frontend Logs**: Check browser console

## 🔧 Development Tips

1. **Backend changes**: The server auto-reloads with `--reload` flag
2. **Frontend changes**: Vite auto-refreshes the browser
3. **View logs**: Keep both terminal windows visible
4. **Database inspection**: Use DuckDB CLI or any SQL client
5. **API testing**: Use the Swagger UI at http://localhost:8000/docs

## 📊 Your First Workout

1. Open http://localhost:5173 in your browser
2. Select a workout type from the dropdown
3. Choose today's date (or any date)
4. Optionally add duration and notes
5. Click "Log Workout"
6. See your workout appear in the history below!

## 🎯 Next Steps

- Log multiple workouts to see your history grow
- Try different workout types
- Add detailed notes about your sessions
- Check the backups folder to see JSON exports
- Explore the API documentation
- Plan your analytics dashboard features!

## 💡 Remember

- Backups are created automatically after every change
- Data is persisted in DuckDB (even if you stop the servers)
- You can restore from any backup using the API

---

Happy tracking! 💪
