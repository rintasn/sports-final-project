import React, { useState, useEffect, useRef } from 'react';
import { z } from 'zod';

// Define the schema for location    
const locationSchema = z.object({    
  city_id: z.number(),    
  city_name: z.string(),  
});    

type LocationSearchProps = {    
  locations: z.infer<typeof locationSchema>[];    
  onLocationChange: (location: any) => void;    
};    

const LocationSearch: React.FC<LocationSearchProps> = ({ locations, onLocationChange }) => {    
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState(locations);
  const searchRef = useRef<HTMLDivElement>(null);

  // Set default value from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cityId = urlParams.get('city_id');
    
    if (cityId) {
      const selectedLocation = locations.find(
        location => location.city_id === Number(cityId)
      );
      
      if (selectedLocation) {
        setSearchTerm(selectedLocation.city_name);
        onLocationChange({ city_id: selectedLocation.city_id });
      }
    }
  }, [locations, onLocationChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);
      
    // Filter locations based on the input value
    const filtered = locations.filter(location =>
      location.city_name.toLowerCase().includes(value.toLowerCase())
    );
      
    setFilteredLocations(filtered);
  };

  const handleLocationSelect = (location: z.infer<typeof locationSchema>) => {
    setSearchTerm(location.city_name);
    onLocationChange(location);
    setIsOpen(false);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown when ESC is pressed
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full">
      <input    
        type="text"    
        placeholder="Pilih Kota"    
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
      />

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {filteredLocations.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {filteredLocations.map(location => (
                  <li
                    key={location.city_id}
                    onClick={() => handleLocationSelect(location)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                  >
                    {location.city_name}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-2 text-gray-500">No records found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );    
};    

export default LocationSearch;