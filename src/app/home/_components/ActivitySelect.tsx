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
    <select onChange={(e) => onActivityChange(Number(e.target.value))}>    
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
