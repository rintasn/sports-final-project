import React from 'react';    
import { z } from 'zod';    
    
// Define the schema for activities    
const activitySchema = z.object({    
  id: z.number(),    
  name: z.string(),    
});    
    
type ActivitySelectProps = {    
  activities: z.infer<typeof activitySchema>[];    
  onActivityChange: (id: number) => void;    
};    
    
const ActivitySelect: React.FC<ActivitySelectProps> = ({ activities, onActivityChange }) => {    
  return (
    <select 
      onChange={(e) => onActivityChange(Number(e.target.value))}
      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
      style={{
        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 1rem center',
        backgroundSize: '1em'
      }}
    >
      <option value="">Pilih Aktivitas</option>
      {activities.length > 0 ? (
        activities.map(activity => (
          <option key={activity.id} value={activity.id}>
            {activity.name}
          </option>
        ))
      ) : (
        <option disabled>No activities available</option>
      )}
    </select>
  );  
};    
    
export default ActivitySelect;    
