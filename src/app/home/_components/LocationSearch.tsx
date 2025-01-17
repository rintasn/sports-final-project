import React, { useState } from 'react';  
import { z } from 'zod';  
  
// Define the schema for location    
const locationSchema = z.object({    
  city_id: z.number(),    
  city_name: z.string(),    
});    
  
type LocationSearchProps = {    
  locations: z.infer<typeof locationSchema>[];    
  onLocationChange: (location: string) => void;    
};    
  
const LocationSearch: React.FC<LocationSearchProps> = ({ locations, onLocationChange }) => {    
  const [searchTerm, setSearchTerm] = useState('');  
  const [filteredLocations, setFilteredLocations] = useState(locations);  
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {  
    const value = e.target.value;  
    setSearchTerm(value);  
      
    // Filter locations based on the input value  
    const filtered = locations.filter(location =>  
      location.city_name.toLowerCase().includes(value.toLowerCase())  
    );  
      
    setFilteredLocations(filtered);  
    onLocationChange(value); // Call the onLocationChange with the current input value  
  };  
  
  return (  
    <div>  
      <input    
        type="text"    
        placeholder="Pilih Kota"    
        value={searchTerm}  
        onChange={handleInputChange}    
      />  
      {searchTerm && (  
        <ul>  
          {filteredLocations.length > 0 ? (  
            filteredLocations.map(location => (  
              <li key={location.city_id} onClick={() => onLocationChange(location.city_name)}>  
                {location.city_name}  
              </li>  
            ))  
          ) : (  
            <li>No records found</li>  
          )}  
        </ul>  
      )}  
    </div>  
  );    
};    
  
export default LocationSearch;  
