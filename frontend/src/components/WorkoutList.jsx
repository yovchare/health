import { useState, useEffect } from 'react';
import apiService from '../services/api';
import './WorkoutList.css';

function WorkoutList({ refreshTrigger }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkouts();
  }, [refreshTrigger]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.fetchWorkouts();
      setWorkouts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    try {
      await apiService.deleteWorkout(id);
      setWorkouts(workouts.filter(w => w.id !== id));
    } catch (err) {
      alert('Failed to delete workout: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return <div className="workout-list-loading">Loading workouts...</div>;
  }

  if (error) {
    return <div className="workout-list-error">Error: {error}</div>;
  }

  if (workouts.length === 0) {
    return (
      <div className="workout-list-empty">
        <p>No workouts logged yet. Start by adding your first workout!</p>
      </div>
    );
  }

  return (
    <div className="workout-list">
      <h2>Workout History</h2>
      <div className="workouts">
        {workouts.map(workout => (
          <div key={workout.id} className="workout-card">
            <div className="workout-header">
              <h3>{workout.workout_type}</h3>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(workout.id)}
                title="Delete workout"
              >
                ×
              </button>
            </div>
            <div className="workout-details">
              <p className="workout-date">{formatDate(workout.date)}</p>
              {workout.duration_minutes && (
                <p className="workout-duration">
                  Duration: {workout.duration_minutes} minutes
                </p>
              )}
              {workout.notes && (
                <p className="workout-notes">{workout.notes}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkoutList;
