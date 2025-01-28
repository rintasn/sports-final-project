// SportsBranchSelect.tsx
import React from 'react';  
import { z } from 'zod';  
  
// Define the schema for sports branches  
const sportsBranchSchema = z.object({  
  id: z.number(),  
  name: z.string(),  
});  
  
type SportsBranchSelectProps = {  
  sportsBranches: z.infer<typeof sportsBranchSchema>[];  
  onBranchChange: (id: number) => void;  
  selectedBranchId?: number; // Add selectedBranchId prop
};  
  
const SportsBranchSelect: React.FC<SportsBranchSelectProps> = ({ sportsBranches, onBranchChange, selectedBranchId }) => {  
  return (
    <select
      value={selectedBranchId} // Set the value to the selectedBranchId
      onChange={(e) => onBranchChange(Number(e.target.value))}
      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
      style={{
        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 1rem center',
        backgroundSize: '1em'
      }}
    >
      <option value="">Pilih Cabang Olahraga</option>
      {sportsBranches.map(branch => (
        <option key={branch.id} value={branch.id}>
          {branch.name}
        </option>
      ))}
    </select>
  );
};  
  
export default SportsBranchSelect;  
