import { useState, useEffect } from 'react';
import apiService from '../services/api';
import WorkoutCard from './WorkoutCard';
import WorkoutCalendar from './WorkoutCalendar';
import './WorkoutList.css';

// Helper function to get today's date in local timezone as YYYY-MM-DD
const getLocalDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function WorkoutList({ refreshTrigger, onWorkoutAdded }) {
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
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
      
      // Filter today's workouts using local date
      const today = getLocalDateString();
      const todayWorkouts = workouts.filter(w => w.date === today);
      setTodaysWorkouts(todayWorkouts);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogWorkout = async (workoutType) => {
    try {
      const localDate = getLocalDateString();
      
      await apiService.createWorkout({
        workout_type: workoutType,
        date: localDate,
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
    </div>
  );
}

export default WorkoutList;
