/**
 * API service for communicating with the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  async fetchWorkouts(startDate = null, endDate = null) {
    let url = `${API_BASE_URL}/workouts/`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch workouts');
    }
    return response.json();
  }

  async createWorkout(workoutData) {
    const response = await fetch(`${API_BASE_URL}/workouts/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workoutData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create workout');
    }
    return response.json();
  }

  async updateWorkout(id, workoutData) {
    const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workoutData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update workout');
    }
    return response.json();
  }

  async deleteWorkout(id) {
    const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete workout');
    }
  }

  async createBackup() {
    const response = await fetch(`${API_BASE_URL}/backups/create`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to create backup');
    }
    return response.json();
  }

  async listBackups() {
    const response = await fetch(`${API_BASE_URL}/backups/list`);
    if (!response.ok) {
      throw new Error('Failed to list backups');
    }
    return response.json();
  }
}

export default new ApiService();
