"""
Workout routes for CRUD operations
"""
from fastapi import APIRouter, HTTPException
from typing import List
from datetime import date as date_type
from app.models.workout import Workout, WorkoutCreate, WorkoutUpdate
from app.services.database import db_service
from app.services.backup import backup_service


router = APIRouter(prefix="/workouts", tags=["workouts"])


@router.post("/", response_model=Workout, status_code=201)
async def create_workout(workout: WorkoutCreate):
    """Create a new workout entry"""
    conn = db_service.get_connection()
    
    # Get next ID from sequence
    next_id = conn.execute("SELECT nextval('workout_id_seq')").fetchone()[0]
    
    # Insert workout
    conn.execute("""
        INSERT INTO workouts (id, workout_type, date, duration_minutes, notes)
        VALUES (?, ?, ?, ?, ?)
    """, [next_id, workout.workout_type, workout.date, workout.duration_minutes, workout.notes])
    
    # Fetch the created workout
    result = conn.execute("SELECT * FROM workouts WHERE id = ?", [next_id]).fetchone()
    
    # Trigger backup after create
    backup_service.backup_to_json()
    
    return _row_to_workout(result)


@router.get("/", response_model=List[Workout])
async def get_workouts(
    skip: int = 0,
    limit: int = 100,
    start_date: date_type | None = None,
    end_date: date_type | None = None
):
    """Get all workouts with optional date filtering"""
    conn = db_service.get_connection()
    
    query = "SELECT * FROM workouts WHERE 1=1"
    params = []
    
    if start_date:
        query += " AND date >= ?"
        params.append(start_date)
    
    if end_date:
        query += " AND date <= ?"
        params.append(end_date)
    
    query += " ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?"
    params.extend([limit, skip])
    
    result = conn.execute(query, params).fetchall()
    
    return [_row_to_workout(row) for row in result]


@router.get("/{workout_id}", response_model=Workout)
async def get_workout(workout_id: int):
    """Get a specific workout by ID"""
    conn = db_service.get_connection()
    result = conn.execute("SELECT * FROM workouts WHERE id = ?", [workout_id]).fetchone()
    
    if not result:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    return _row_to_workout(result)


@router.put("/{workout_id}", response_model=Workout)
async def update_workout(workout_id: int, workout: WorkoutUpdate):
    """Update an existing workout"""
    conn = db_service.get_connection()
    
    # Check if workout exists
    existing = conn.execute("SELECT * FROM workouts WHERE id = ?", [workout_id]).fetchone()
    if not existing:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    # Build update query dynamically based on provided fields
    update_fields = []
    params = []
    
    if workout.workout_type is not None:
        update_fields.append("workout_type = ?")
        params.append(workout.workout_type)
    
    if workout.date is not None:
        update_fields.append("date = ?")
        params.append(workout.date)
    
    if workout.duration_minutes is not None:
        update_fields.append("duration_minutes = ?")
        params.append(workout.duration_minutes)
    
    if workout.notes is not None:
        update_fields.append("notes = ?")
        params.append(workout.notes)
    
    if not update_fields:
        # No fields to update, return existing workout
        return _row_to_workout(existing)
    
    params.append(workout_id)
    query = f"UPDATE workouts SET {', '.join(update_fields)} WHERE id = ?"
    conn.execute(query, params)
    
    # Fetch updated workout
    result = conn.execute("SELECT * FROM workouts WHERE id = ?", [workout_id]).fetchone()
    
    # Trigger backup after update
    backup_service.backup_to_json()
    
    return _row_to_workout(result)


@router.delete("/{workout_id}", status_code=204)
async def delete_workout(workout_id: int):
    """Delete a workout"""
    conn = db_service.get_connection()
    
    # Check if workout exists
    existing = conn.execute("SELECT * FROM workouts WHERE id = ?", [workout_id]).fetchone()
    if not existing:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    conn.execute("DELETE FROM workouts WHERE id = ?", [workout_id])
    
    # Trigger backup after delete
    backup_service.backup_to_json()
    
    return None


def _row_to_workout(row) -> Workout:
    """Convert a database row to a Workout model"""
    return Workout(
        id=row[0],
        workout_type=row[1],
        date=row[2],
        duration_minutes=row[3],
        notes=row[4],
        created_at=row[5]
    )
