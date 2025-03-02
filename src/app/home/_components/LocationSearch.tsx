// LocationSearch.tsx
import React, { useState, useEffect, useRef } from 'react';
import { z } from 'zod';

const locationSchema = z.object({    
  city_id: z.number(),    
  city_name: z.string(),    
});    

type LocationSearchProps = {    
  locations: z.infer<typeof locationSchema>[];    
  onLocationChange: (cityId: number) => void;
  isDisabled: boolean;
  selectedCityId: number | null;
};    

const LocationSearch: React.FC<LocationSearchProps> = ({ 
  locations, 
  onLocationChange,
  isDisabled,
  selectedCityId
}) => {    
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState(locations);
  const searchRef = useRef<HTMLDivElement>(null);

  // Reset search when locations change or when disabled
  useEffect(() => {
    if (isDisabled || locations.length === 0) {
      setSearchTerm('');
      setFilteredLocations([]);
    } else {
      setFilteredLocations(locations);
    }
  }, [locations, isDisabled]);

  // Update search term when selectedCityId changes
  useEffect(() => {
    if (selectedCityId === null) {
      setSearchTerm('');
    } else {
      const selectedCity = locations.find(city => city.city_id === selectedCityId);
      if (selectedCity) {
        setSearchTerm(selectedCity.city_name);
      }
    }
  }, [selectedCityId, locations]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);
      
    const filtered = locations.filter(location =>
      location.city_name.toLowerCase().includes(value.toLowerCase())
    );
      
    setFilteredLocations(filtered);
  };

  const handleLocationSelect = (location: z.infer<typeof locationSchema>) => {
    setSearchTerm(location.city_name);
    onLocationChange(location.city_id);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        placeholder={isDisabled ? "Pilih provinsi terlebih dahulu" : "Pilih Kota"}    
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => !isDisabled && setIsOpen(true)}
        disabled={isDisabled}
        className={`w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
          isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
        }`}
      />

      {isOpen && !isDisabled && (
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