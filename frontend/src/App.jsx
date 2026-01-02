import { useState } from 'react';
import WorkoutList from './components/WorkoutList';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleWorkoutAdded = () => {
    // Trigger a refresh of the workout list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>💪 Health Tracker</h1>
        <p>Track your workouts and build healthy habits</p>
      </header>
      
      <main className="app-main">
        <div className="container">
          <WorkoutList refreshTrigger={refreshTrigger} onWorkoutAdded={handleWorkoutAdded} />
        </div>
      </main>
      
      <footer className="app-footer">
        <p>Health Tracker v1.0.0</p>
      </footer>
    </div>
  );
}

export default App;
