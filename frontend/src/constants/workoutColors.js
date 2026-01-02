// Workout color definitions - muted/matte palette
export const WORKOUT_COLORS = {
  'Yoga': '#7B68A6',           // Muted purple
  'Running': '#5B8FA3',         // Muted blue
  'Hiking': '#C4A35A',          // Muted yellow
  'Powerlifting': '#B85450',    // Muted red
  'Kettlebell Training': '#B8658B', // Muted fuscia
  'Golf': '#6B9A6E'             // Muted green
};

// Workout priority for calendar display (lower number = higher priority)
export const WORKOUT_PRIORITY = {
  'Yoga': 1,
  'Kettlebell Training': 2,
  'Powerlifting': 3,
  'Golf': 4,
  'Running': 5,
  'Hiking': 6
};

// Combined config for calendar
export const WORKOUT_CONFIG = Object.keys(WORKOUT_COLORS).reduce((acc, workoutType) => {
  acc[workoutType] = {
    color: WORKOUT_COLORS[workoutType],
    priority: WORKOUT_PRIORITY[workoutType]
  };
  return acc;
}, {});
