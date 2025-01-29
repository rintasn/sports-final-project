// LocationProvinceSearch.tsx
import React, { useState, useEffect, useRef } from 'react';
import { z } from 'zod';

const locationSchema = z.object({    
  province_id: z.number(),    
  province_name: z.string(),    
});    

type LocationProvinceSearchProps = {    
  provinces: z.infer<typeof locationSchema>[];    
  onProvinceChange: (provinceId: number, provinceName: string) => void;
  selectedProvinceId: number | null;
};    

const LocationProvinceSearch: React.FC<LocationProvinceSearchProps> = ({ 
  provinces, 
  onProvinceChange,
  selectedProvinceId
}) => {    
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState(provinces);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update search term when selectedProvinceId changes
    if (selectedProvinceId === null) {
      setSearchTerm('');
    } else {
      const selectedProvince = provinces.find(p => p.province_id === selectedProvinceId);
      if (selectedProvince) {
        setSearchTerm(selectedProvince.province_name);
      }
    }
  }, [selectedProvinceId, provinces]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);
      
    const filtered = provinces.filter(province =>
      province.province_name.toLowerCase().includes(value.toLowerCase())
    );
      
    setFilteredLocations(filtered);
  };

  const handleLocationSelect = (province: z.infer<typeof locationSchema>) => {
    setSearchTerm(province.province_name);
    onProvinceChange(province.province_id, province.province_name);
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
        placeholder="Pilih Provinsi"    
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
                {filteredLocations.map(province => (
                  <li
                    key={province.province_id}
                    onClick={() => handleLocationSelect(province)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                  >
                    {province.province_name}
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

export default LocationProvinceSearch;