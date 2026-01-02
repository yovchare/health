import { useState, useEffect } from 'react';
import apiService from '../services/api';
import WorkoutCard from './WorkoutCard';
import WorkoutCalendar from './WorkoutCalendar';
import './WorkoutList.css';

function WorkoutList({ refreshTrigger, onWorkoutAdded }) {
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch workout types and workouts in parallel
      const [types, workouts] = await Promise.all([
        apiService.getWorkoutTypes(),
        apiService.fetchWorkouts()
      ]);
      
      setWorkoutTypes(types);
      
      // Store all workouts for calendar
      setAllWorkouts(workouts);
      
      // Filter today's workouts
      const today = new Date().toISOString().split('T')[0];
      const todayWorkouts = workouts.filter(w => w.date === today);
      setTodaysWorkouts(todayWorkouts);
      
      // Get recent workouts (last 7 days, excluding today)
      const recent = workouts.filter(w => w.date !== today).slice(0, 10);
      setRecentWorkouts(recent);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogWorkout = async (workoutType) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await apiService.createWorkout({
        workout_type: workoutType,
        date: today,
        duration_minutes: null,
        notes: null
      });
      
      // Refresh data
      await fetchData();
      
      if (onWorkoutAdded) {
        onWorkoutAdded();
      }
    } catch (err) {
      alert('Failed to log workout: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    try {
      await apiService.deleteWorkout(id);
      await fetchData();
    } catch (err) {
      alert('Failed to delete workout: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateStr = date.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (dateStr === todayStr) return 'Today';
    if (dateStr === yesterdayStr) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  const isWorkoutLoggedToday = (workoutType) => {
    return todaysWorkouts.some(w => w.workout_type === workoutType);
  };

  const getTodayWorkoutId = (workoutType) => {
    const workout = todaysWorkouts.find(w => w.workout_type === workoutType);
    return workout ? workout.id : null;
  };

  const handleUnlogWorkout = async (workoutId) => {
    if (!workoutId) return;
    
    try {
      await apiService.deleteWorkout(workoutId);
      await fetchData();
      
      if (onWorkoutAdded) {
        onWorkoutAdded();
      }
    } catch (err) {
      alert('Failed to remove workout: ' + err.message);
    }
  };

  if (loading) {
    return <div className="workout-list-loading">Loading...</div>;
  }

  if (error) {
    return <div className="workout-list-error">Error: {error}</div>;
  }

  return (
    <div className="workout-list">
      <section className="today-section">
        <h2>Today's Workouts</h2>
        <div className="workout-cards-grid">
          {workoutTypes.map(type => (
            <WorkoutCard
              key={type}
              workoutType={type}
              onLog={handleLogWorkout}
              onUnlog={handleUnlogWorkout}
              isLoggedToday={isWorkoutLoggedToday(type)}
              todayWorkoutId={getTodayWorkoutId(type)}
            />
          ))}
        </div>
      </section>

      {/* Calendar View */}
      <section className="activity-section">
        <WorkoutCalendar workouts={allWorkouts} />
      </section>

      {recentWorkouts.length > 0 && (
        <section className="history-section">
          <h2>Recent History</h2>
          <div className="history-list">
            {recentWorkouts.map(workout => (
              <div key={workout.id} className="history-item">
                <div className="history-content">
                  <span className="history-type">{workout.workout_type}</span>
                  <span className="history-date">{formatDate(workout.date)}</span>
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(workout.id)}
                  title="Delete workout"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default WorkoutList;
