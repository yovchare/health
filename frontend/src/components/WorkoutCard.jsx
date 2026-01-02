import { useState } from 'react';
import { WORKOUT_COLORS } from '../constants/workoutColors';
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

  const workoutColor = WORKOUT_COLORS[workoutType] || '#666';

  return (
    <div 
      className={`workout-card ${isLoggedToday ? 'logged' : ''} ${isLogging ? 'logging' : ''}`}
      onClick={handleClick}
      style={{ boxShadow: `-4px 0 0 0 ${workoutColor}` }}
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
