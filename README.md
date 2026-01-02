# 💪 Health Tracker

A full-stack health tracking application that allows users to log workouts and track their fitness progress. Built with FastAPI (Python) backend and React frontend.

## 🎯 Features

- **Workout Logging**: Log different types of workouts with date, duration, and notes
- **Workout History**: View all logged workouts in reverse chronological order
- **Data Persistence**: Uses DuckDB for fast analytics-ready data storage
- **Automatic Backups**: All data is automatically backed up to JSON files
- **RESTful API**: Clean API design with full CRUD operations
- **Modern UI**: Responsive React interface with intuitive design

## 🏗️ Project Structure

```
health/
├── backend/                 # Python FastAPI backend
│   ├── app/
│   │   ├── models/         # Pydantic data models
│   │   ├── routes/         # API route handlers
│   │   ├── services/       # Business logic (DB, backups)
│   │   ├── config.py       # Configuration management
│   │   └── main.py         # FastAPI application entry point
│   ├── data/               # DuckDB database files
│   ├── backups/            # JSON backup files
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
│
└── frontend/               # React frontend
    ├── src/
    │   ├── components/     # React components
    │   ├── services/       # API service layer
    │   ├── App.jsx         # Main app component
    │   └── main.jsx        # React entry point
    ├── package.json        # Node dependencies
    └── vite.config.js      # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher (with npm)
- pip (Python package manager)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create environment configuration:
   ```bash
   cp .env.example .env
   # Edit .env if needed to customize settings
   ```

5. Run the backend server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment configuration:
   ```bash
   cp .env.example .env
   # Edit .env if needed to customize API URL
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`

## 📊 Database & Backups

### DuckDB

- The application uses DuckDB, an in-process SQL database optimized for analytics
- Database file is stored in `backend/data/health.db`
- Perfect for future analytics features and dashboard development

### Automatic Backups

- JSON backups are automatically created:
  - On application startup
  - After every create/update/delete operation
  - On application shutdown
- Backups are stored in `backend/backups/`
- Each backup is timestamped: `workouts_backup_YYYYMMDD_HHMMSS.json`

### Manual Backup Operations

You can also manage backups via the API:

- **Create backup**: `POST /api/backups/create`
- **List backups**: `GET /api/backups/list`
- **Restore backup**: `POST /api/backups/restore/{filename}`

## 🔌 API Endpoints

### Workouts

- `GET /api/workouts/` - Get all workouts (with optional date filtering)
- `POST /api/workouts/` - Create a new workout
- `GET /api/workouts/{id}` - Get a specific workout
- `PUT /api/workouts/{id}` - Update a workout
- `DELETE /api/workouts/{id}` - Delete a workout

### Backups

- `POST /api/backups/create` - Create a manual backup
- `GET /api/backups/list` - List all backup files
- `POST /api/backups/restore/{filename}` - Restore from a backup

### Example API Request

```bash
# Create a workout
curl -X POST "http://localhost:8000/api/workouts/" \
  -H "Content-Type: application/json" \
  -d '{
    "workout_type": "Running",
    "date": "2026-01-01",
    "duration_minutes": 30,
    "notes": "Morning run in the park"
  }'
```

## 🎨 Workout Types

The application supports the following workout types:
- Running
- Cycling
- Swimming
- Weights
- Yoga
- Walking
- HIIT
- Sports
- Other

## 🔮 Future Enhancements

This is version 1.0 with basic workout tracking. Future plans include:

- **Analytics Dashboard**: Visualize workout trends and progress
- **Goal Setting**: Set and track fitness goals
- **Additional Metrics**: Heart rate, calories, distance, etc.
- **User Authentication**: Multi-user support with auth
- **Mobile App**: Native mobile applications
- **Workout Plans**: Pre-defined workout routines
- **Social Features**: Share progress with friends

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **Pydantic**: Data validation using Python type annotations
- **DuckDB**: In-process SQL OLAP database
- **Uvicorn**: ASGI server for running FastAPI
- **Python 3.8+**: Core programming language

### Frontend
- **React 18**: Modern UI library
- **Vite**: Next generation frontend tooling
- **CSS3**: Styling with modern CSS features

## 📝 Development Notes

### Configuration

Backend configuration can be customized via environment variables in `.env`:
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 8000)
- `CORS_ORIGINS`: Allowed CORS origins
- `DB_PATH`: Path to DuckDB database file
- `BACKUP_PATH`: Path to backup directory
- `BACKUP_INTERVAL_MINUTES`: Backup interval (future feature)

### CORS

The backend is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (alternative dev server)

Add more origins in the `.env` file as needed.

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

This project is open source and available for personal use.

## 🐛 Known Issues

None at this time. Please report any issues you encounter!

---

**Happy tracking! 💪🏃‍♂️🚴‍♀️**
