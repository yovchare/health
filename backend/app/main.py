"""
Main FastAPI application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.services.database import db_service
from app.services.backup import backup_service
from app.routes import workouts, backups


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    print("🚀 Starting Health Tracker API...")
    db_service.connect()
    print("✅ Database connected")
    
    # Create initial backup on startup
    backup_file = backup_service.backup_to_json()
    print(f"✅ Initial backup created: {backup_file}")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down Health Tracker API...")
    
    # Create final backup on shutdown
    backup_file = backup_service.backup_to_json()
    print(f"✅ Final backup created: {backup_file}")
    
    db_service.close()
    print("✅ Database connection closed")


# Create FastAPI app
app = FastAPI(
    title="Health Tracker API",
    description="API for tracking workouts and health metrics",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.cors_origins == "*" else settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(workouts.router, prefix="/api")
app.include_router(backups.router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Health Tracker API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
