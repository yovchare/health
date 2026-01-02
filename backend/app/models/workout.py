from pydantic import BaseModel, Field, validator
from typing import Optional, Literal
from datetime import date as Date, datetime
from enum import Enum


class WorkoutType(str, Enum):
    """Allowed workout types"""
    YOGA = "Yoga"
    RUNNING = "Running"
    HIKING = "Hiking"
    POWERLIFTING = "Powerlifting"
    KETTLEBELL_TRAINING = "Kettlebell Training"
    GOLF = "Golf"


class WorkoutBase(BaseModel):
    """Base workout model with common fields"""
    workout_type: WorkoutType = Field(..., description="Type of workout")
    date: Date = Field(..., description="Date of the workout")
    duration_minutes: Optional[int] = Field(None, description="Duration of workout in minutes")
    notes: Optional[str] = Field(None, description="Additional notes about the workout")


class WorkoutCreate(WorkoutBase):
    """Model for creating a new workout"""
    pass


class WorkoutUpdate(BaseModel):
    """Model for updating an existing workout"""
    workout_type: Optional[WorkoutType] = None
    date: Optional[Date] = None
    duration_minutes: Optional[int] = None
    notes: Optional[str] = None


class Workout(WorkoutBase):
    """Complete workout model with ID and timestamps"""
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
