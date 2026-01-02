"""
Backup service for exporting and restoring data to/from JSON files
"""
import json
import os
from datetime import datetime
from pathlib import Path
from typing import List, Dict
from app.config import settings
from app.services.database import db_service


class BackupService:
    """Manages JSON backups of the database"""
    
    def __init__(self):
        self.backup_path = Path(settings.backup_path)
        self._ensure_backup_directory()
    
    def _ensure_backup_directory(self):
        """Ensure the backup directory exists"""
        self.backup_path.mkdir(parents=True, exist_ok=True)
    
    def backup_to_json(self) -> str:
        """
        Backup all data to JSON files
        Returns the backup file path
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = self.backup_path / f"workouts_backup_{timestamp}.json"
        
        # Get all workout data
        conn = db_service.get_connection()
        result = conn.execute("SELECT * FROM workouts ORDER BY id").fetchall()
        columns = [desc[0] for desc in conn.execute("SELECT * FROM workouts LIMIT 0").description]
        
        # Convert to list of dictionaries
        workouts = []
        for row in result:
            workout = {}
            for i, col in enumerate(columns):
                value = row[i]
                # Convert date/timestamp objects to strings
                if hasattr(value, 'isoformat'):
                    value = value.isoformat()
                workout[col] = value
            workouts.append(workout)
        
        # Write to JSON file
        with open(backup_file, 'w') as f:
            json.dump({
                'backup_timestamp': timestamp,
                'workouts': workouts
            }, f, indent=2)
        
        return str(backup_file)
    
    def restore_from_json(self, backup_file: str) -> int:
        """
        Restore data from a JSON backup file
        Returns the number of records restored
        """
        with open(backup_file, 'r') as f:
            data = json.load(f)
        
        workouts = data.get('workouts', [])
        if not workouts:
            return 0
        
        conn = db_service.get_connection()
        
        # Clear existing data (optional - you might want to handle this differently)
        # conn.execute("DELETE FROM workouts")
        
        # Insert backup data
        count = 0
        for workout in workouts:
            conn.execute("""
                INSERT INTO workouts (id, workout_type, date, duration_minutes, notes, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            """, [
                workout.get('id'),
                workout.get('workout_type'),
                workout.get('date'),
                workout.get('duration_minutes'),
                workout.get('notes'),
                workout.get('created_at')
            ])
            count += 1
        
        return count
    
    def list_backups(self) -> List[Dict[str, str]]:
        """List all available backup files"""
        backups = []
        for file in sorted(self.backup_path.glob("workouts_backup_*.json"), reverse=True):
            backups.append({
                'filename': file.name,
                'path': str(file),
                'size': file.stat().st_size,
                'created': datetime.fromtimestamp(file.stat().st_mtime).isoformat()
            })
        return backups


# Global backup service instance
backup_service = BackupService()
