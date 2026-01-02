from pydantic import BaseModel, Field
from typing import Optional
from datetime import date as Date, datetime


class WorkoutBase(BaseModel):
    """Base workout model with common fields"""
    workout_type: str = Field(..., description="Type of workout (e.g., Running, Cycling, Weights)")
    date: Date = Field(..., description="Date of the workout")
    duration_minutes: Optional[int] = Field(None, description="Duration of workout in minutes")
    notes: Optional[str] = Field(None, description="Additional notes about the workout")


class WorkoutCreate(WorkoutBase):
    """Model for creating a new workout"""
    pass


class WorkoutUpdate(BaseModel):
    """Model for updating an existing workout"""
    workout_type: Optional[str] = None
    date: Optional[Date] = None
    duration_minutes: Optional[int] = None
    notes: Optional[str] = None


class Workout(WorkoutBase):
    """Complete workout model with ID and timestamps"""
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
