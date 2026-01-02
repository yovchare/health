"""
Backup management routes
"""
from fastapi import APIRouter, HTTPException
from typing import List, Dict
from app.services.backup import backup_service


router = APIRouter(prefix="/backups", tags=["backups"])


@router.post("/create", status_code=201)
async def create_backup():
    """Manually trigger a backup"""
    try:
        backup_file = backup_service.backup_to_json()
        return {
            "message": "Backup created successfully",
            "backup_file": backup_file
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backup failed: {str(e)}")


@router.get("/list", response_model=List[Dict])
async def list_backups():
    """List all available backups"""
    try:
        return backup_service.list_backups()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list backups: {str(e)}")


@router.post("/restore/{filename}")
async def restore_backup(filename: str):
    """Restore data from a backup file"""
    try:
        backup_path = backup_service.backup_path / filename
        if not backup_path.exists():
            raise HTTPException(status_code=404, detail="Backup file not found")
        
        count = backup_service.restore_from_json(str(backup_path))
        return {
            "message": "Backup restored successfully",
            "records_restored": count
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Restore failed: {str(e)}")
