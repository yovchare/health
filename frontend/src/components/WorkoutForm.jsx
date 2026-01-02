import { useState } from 'react';
import apiService from '../services/api';
import './WorkoutForm.css';

function WorkoutForm({ onWorkoutAdded }) {
  const [formData, setFormData] = useState({
    workout_type: '',
    date: new Date().toISOString().split('T')[0],
    duration_minutes: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const workoutTypes = [
    'Running',
    'Cycling',
    'Swimming',
    'Weights',
    'Yoga',
    'Walking',
    'HIIT',
    'Sports',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const dataToSubmit = {
        ...formData,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null
      };

      await apiService.createWorkout(dataToSubmit);
      
      // Reset form
      setFormData({
        workout_type: '',
        date: new Date().toISOString().split('T')[0],
        duration_minutes: '',
        notes: ''
      });

      // Notify parent component
      if (onWorkoutAdded) {
        onWorkoutAdded();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="workout-form">
      <h2>Log Workout</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="workout_type">Workout Type *</label>
          <select
            id="workout_type"
            name="workout_type"
            value={formData.workout_type}
            onChange={handleChange}
            required
          >
            <option value="">Select a workout type</option>
            {workoutTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration_minutes">Duration (minutes)</label>
          <input
            type="number"
            id="duration_minutes"
            name="duration_minutes"
            value={formData.duration_minutes}
            onChange={handleChange}
            min="0"
            placeholder="Optional"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Optional notes about your workout"
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Log Workout'}
        </button>
      </form>
    </div>
  );
}

export default WorkoutForm;
