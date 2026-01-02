import { useState } from 'react';
import './WorkoutCard.css';

function WorkoutCard({ workoutType, onLog, onUnlog, isLoggedToday, todayWorkoutId }) {
  const [isLogging, setIsLogging] = useState(false);

  const handleClick = async () => {
    if (isLogging) return;
    
    setIsLogging(true);
    try {
      if (isLoggedToday) {
        // Unlog - delete today's workout
        await onUnlog(todayWorkoutId);
      } else {
        // Log new workout
        await onLog(workoutType);
      }
    } finally {
      setIsLogging(false);
    }
  };

  // Map workout types to colors (matching calendar colors)
  const colorMap = {
    'Yoga': '#9C27B0',
    'Running': '#2196F3',
    'Hiking': '#795548',
    'Powerlifting': '#F44336',
    'Kettlebell Training': '#FF5722',
    'Golf': '#4CAF50'
  };

  const workoutColor = colorMap[workoutType] || '#666';

  return (
    <div 
      className={`workout-card ${isLoggedToday ? 'logged' : ''} ${isLogging ? 'logging' : ''}`}
      onClick={handleClick}
      style={{ borderColor: workoutColor }}
    >
      <div className="card-content">
        <div className="workout-name">{workoutType}</div>
        <div className="workout-checkbox" style={{ 
          backgroundColor: isLoggedToday ? workoutColor : 'transparent',
          borderColor: workoutColor 
        }}>
          {isLoggedToday && <span className="checkmark">✓</span>}
        </div>
      </div>
      {isLogging && <div className="loading-spinner"></div>}
    </div>
  );
}

export default WorkoutCard;
