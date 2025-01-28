import React from "react";  
  
interface VenueCardProps {  
  name: string;  
  location: string;  
  rating: string;  
  sportType: string;  
  imageUrl: string;  
}  
  
const VenueCard: React.FC<VenueCardProps> = ({ name, location, rating, sportType, imageUrl }) => {  
  return (  
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-sm mb-6">  
      <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />  
      <div className="p-4">  
        <h3 className="text-xl font-bold mb-2">{name}</h3>  
        <p className="text-gray-600 mb-2">{location}</p>  
        <p className="text-gray-600 mb-2">Rating: {rating}</p>  
        <p className="text-gray-600">{sportType}</p>  
      </div>  
    </div>  
  );  
};  
  
export default VenueCard;  
