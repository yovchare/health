"""
Database service for managing DuckDB connection and operations
"""
import duckdb
import os
from pathlib import Path
from app.config import settings


class DatabaseService:
    """Manages DuckDB connection and database operations"""
    
    def __init__(self):
        self.db_path = settings.db_path
        self.connection = None
        self._ensure_data_directory()
        
    def _ensure_data_directory(self):
        """Ensure the data directory exists"""
        Path(self.db_path).parent.mkdir(parents=True, exist_ok=True)
        
    def connect(self):
        """Create a connection to the DuckDB database"""
        if self.connection is None:
            self.connection = duckdb.connect(self.db_path)
            self._initialize_schema()
        return self.connection
    
    def _initialize_schema(self):
        """Initialize the database schema"""
        self.connection.execute("""
            CREATE TABLE IF NOT EXISTS workouts (
                id INTEGER PRIMARY KEY,
                workout_type VARCHAR NOT NULL,
                date DATE NOT NULL,
                duration_minutes INTEGER,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create a sequence for auto-incrementing IDs
        self.connection.execute("""
            CREATE SEQUENCE IF NOT EXISTS workout_id_seq START 1
        """)
        
    def close(self):
        """Close the database connection"""
        if self.connection:
            self.connection.close()
            self.connection = None
    
    def get_connection(self):
        """Get the current connection or create a new one"""
        if self.connection is None:
            self.connect()
        return self.connection


# Global database service instance
db_service = DatabaseService()
