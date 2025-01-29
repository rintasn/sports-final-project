import React, { useState, useEffect } from "react";
import axios from "axios";
import VenueCard from "./_components/VenueCard";  
import Navbar from "../_components/NavbarComponent";
import LocationSearch from "./_components/LocationSearch";
import SportsBranchSelect from "./_components/SportsBranchSelect";
import AddActivityDialog from "../../user/_components/AddActivityDialog";
import { Button } from "@/components/ui/button";

const axiosInstance = axios.create({
  baseURL: "https://sport-reservation-api-bootcamp.do.dibimbing.id",
});

interface Venue {
  id: number;
  title: string;
  description: string;
  price: number;
  price_discount: number | null;
  slot: number;
  address: string;
  activity_date: string;
  start_time: string;
  end_time: string;
  organizer: {
    id: number;
    name: string;
    email: string;
  };
  participants: Array<{
    id: number;
    user: {
      name: string;
      email: string;
    };
  }>;
  city: {
    city_name: string;
    province: {
      province_name: string;
    };
  };
  sport_category: {
    name: string;
  };
}

const Home: React.FC = () => {  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<number | undefined>();
  const [selectedSportType, setSelectedSportType] = useState<number | undefined>();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [sportsBranches, setSportsBranches] = useState([]);

  useEffect(() => {
    fetchInitialData();
    checkUrlParams();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [locationsResponse, sportsBranchesResponse] = await Promise.all([
        axiosInstance.get("/api/v1/location/cities?is_paginate=true&per_page=5000&page=1"),
        axiosInstance.get("/api/v1/sport-categories?is_paginate=true&per_page=5000&page=1")
      ]);

      setLocations(locationsResponse.data.result.data);
      setSportsBranches(sportsBranchesResponse.data.result.data);
    } catch (err) {
      setError("Failed to fetch initial data");
    }
  };

  const checkUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sportCategoryId = urlParams.get("sport_category_id");
    const cityId = urlParams.get("city_id");

    if (cityId) {
      setSelectedLocation(Number(cityId));
      setSelectedSportType(Number(sportCategoryId || 1));
      fetchVenues(Number(sportCategoryId || 1), Number(cityId));
    } else if (sportCategoryId) {
      const id = Number(sportCategoryId);
      setSelectedSportType(id);
      fetchVenues(id, selectedLocation);
    }
  };

  const fetchVenues = async (sportCategoryId: number | undefined, cityId: number | undefined) => {
    if (!sportCategoryId) {
      setError("Please select both location and sport type");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get("/api/v1/sport-activities", {
        params: {
          is_paginate: false,
          city_id: cityId,
          per_page: 50,
          page: 1,
          search: searchTerm,
          sport_category_id: sportCategoryId,
        },
      });

      setVenues(response.data.result);
    } catch (err) {
      setError("Failed to fetch venues. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionCreated = () => {
    // Refresh venues list after transaction
    fetchVenues(selectedSportType, selectedLocation);
  };

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (  
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto p-4">
        <header className="bg-red-500 text-white py-12 px-6 mb-8 rounded-lg">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">EVENT MAIN BARENG</h1>
            <button 
              onClick={() => setIsAddDialogOpen(true)} 
              className="bg-white text-red-500 px-6 py-3 rounded-lg font-bold hover:bg-red-100 transition duration-300"
            >
              Daftarkan Agenda
            </button>
          </div>
        </header> 
      </div>

      <div className="p-6 max-w-7xl mx-auto">          
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-grow">
            <LocationSearch  
              locations={locations}  
              onLocationChange={(location) => {
                setSelectedLocation(location.city_id);
              }} 
            /> 
          </div>
          
          <div className="flex-grow">
            <SportsBranchSelect  
              sportsBranches={sportsBranches}  
              onBranchChange={(id) => setSelectedSportType(id)} 
              selectedBranchId={selectedSportType}
            /> 
          </div>

          <button 
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => fetchVenues(selectedSportType, selectedLocation)}
            disabled={loading || !selectedSportType}
          >  
            {loading ? "Searching..." : "Find Events"}  
          </button>  
        </div>  

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        <p className="text-center text-gray-600 mb-8">
          Showing {venues.length} available events
        </p>  

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">  
          {venues.map((venue) => (  
            <VenueCard
              key={venue.id}
              venue={venue}
              onTransactionCreated={handleTransactionCreated}
            /> 
          ))}  
        </div>  
      </div>  

      <AddActivityDialog      
        isOpen={isAddDialogOpen}      
        onOpenChange={setIsAddDialogOpen}      
        onAdd={() => fetchVenues(selectedSportType, selectedLocation)}
      /> 
    </main>
  );  
};  
  
export default Home;