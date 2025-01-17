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
};  
  
const SportsBranchSelect: React.FC<SportsBranchSelectProps> = ({ sportsBranches, onBranchChange }) => {  
  return (  
    <select onChange={(e) => onBranchChange(Number(e.target.value))}>  
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
