import { useMemo } from 'react';
import './WorkoutCalendar.css';

function WorkoutCalendar({ workouts }) {
  // Define workout colors and priority
  const workoutConfig = {
    'Yoga': { color: '#9C27B0', priority: 1 },
    'Kettlebell Training': { color: '#FF5722', priority: 2 },
    'Powerlifting': { color: '#F44336', priority: 3 },
    'Golf': { color: '#4CAF50', priority: 4 },
    'Running': { color: '#2196F3', priority: 5 },
    'Hiking': { color: '#795548', priority: 6 }
  };

  // Generate calendar data organized by month (last 3 months)
  const monthsData = useMemo(() => {
    const today = new Date();
    const months = [];

    // Generate 3 months of data (current month and 2 previous)
    for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - monthOffset, 1);
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      
      // Get first and last day of this month
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      // Generate all days in this month
      const days = [];
      for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().split('T')[0];
        
        // Get workouts for this day
        const dayWorkouts = workouts
          .filter(w => w.date === dateStr)
          .map(w => ({
            type: w.workout_type,
            color: workoutConfig[w.workout_type]?.color || '#757575',
            priority: workoutConfig[w.workout_type]?.priority || 999
          }))
          .sort((a, b) => a.priority - b.priority)
          .slice(0, 2); // Take top 2 by priority
        
        days.push({
          date: dateStr,
          dateObj: date,
          workouts: dayWorkouts
        });
      }
      
      months.push({
        monthDate,
        year,
        month,
        firstDay,
        days
      });
    }
    
    // Reverse to show oldest to newest (left to right)
    return months.reverse();
  }, [workouts]);

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDate = (dateObj) => {
    return dateObj.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const renderCell = (day) => {
    if (!day) {
      return <div className="calendar-cell empty"></div>;
    }

    const { workouts, dateObj } = day;
    const isToday = dateObj.toDateString() === new Date().toDateString();
    const dayNumber = dateObj.getDate();
    
    if (workouts.length === 0) {
      return (
        <div 
          className={`calendar-cell no-workout ${isToday ? 'today' : ''}`}
          title={formatDate(dateObj)}
        >
          <span className="cell-date">{dayNumber}</span>
        </div>
      );
    }
    
    if (workouts.length === 1) {
      return (
        <div 
          className={`calendar-cell single-workout ${isToday ? 'today' : ''}`}
          style={{ backgroundColor: workouts[0].color }}
          title={`${formatDate(dateObj)} - ${workouts[0].type}`}
        >
          <span className="cell-date">{dayNumber}</span>
        </div>
      );
    }
    
    // Two or more workouts - diagonal split
    return (
      <div 
        className={`calendar-cell dual-workout ${isToday ? 'today' : ''}`}
        title={`${formatDate(dateObj)} - ${workouts.map(w => w.type).join(', ')}`}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon 
            points="0,0 100,0 100,100" 
            fill={workouts[0].color}
          />
          <polygon 
            points="0,0 0,100 100,100" 
            fill={workouts[1].color}
          />
        </svg>
        <span className="cell-date">{dayNumber}</span>
      </div>
    );
  };

  const renderMonth = (monthData) => {
    const { monthDate, firstDay, days } = monthData;
    
    // Create weeks array with padding
    const weeks = [];
    let currentWeek = [];
    
    // Pad the beginning with empty cells
    const startDay = firstDay.getDay();
    for (let i = 0; i < startDay; i++) {
      currentWeek.push(null);
    }
    
    // Add all days
    days.forEach((day) => {
      currentWeek.push(day);
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    // Pad the last week if needed
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }
    
    return (
      <div key={monthDate.toISOString()} className="month-calendar">
        <h3 className="month-title">{getMonthName(monthDate)}</h3>
        <div className="calendar-container">
          {/* Day labels */}
          <div className="calendar-day-labels">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar grid */}
          <div className="calendar-grid">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="calendar-week">
                {week.map((day, dayIndex) => (
                  <div key={dayIndex}>
                    {renderCell(day)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="workout-calendar">
      <h2>Activity Calendar</h2>
      
      {/* Legend */}
      <div className="calendar-legend">
        {Object.entries(workoutConfig).map(([type, config]) => (
          <div key={type} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: config.color }}
            ></div>
            <span className="legend-label">{type}</span>
          </div>
        ))}
      </div>

      {/* Monthly Calendars */}
      <div className="months-container">
        {monthsData.map(monthData => renderMonth(monthData))}
      </div>
    </div>
  );
}

export default WorkoutCalendar;
