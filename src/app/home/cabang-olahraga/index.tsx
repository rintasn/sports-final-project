// Home.tsx
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import VenueCard from "./_components/VenueCard";  
import Navbar from "../_components/NavbarComponent";
import LocationSearch from "./_components/LocationSearch";
import SportsBranchSelect from "./_components/SportsBranchSelect";

const axiosInstance = axios.create({
  baseURL: "https://sport-reservation-api-bootcamp.do.dibimbing.id",
});

const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data);

interface Venue {
  id: number;
  title: string;
  address: string;
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

  const { data: locationsData, error: locationsError } = useSWR("/api/v1/location/cities?is_paginate=true&per_page=5000&page=1", fetcher);
  const { data: sportsBranchesData, error: sportsBranchesError } = useSWR("/api/v1/sport-categories?is_paginate=true&per_page=5000&page=1", fetcher);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sportCategoryId = urlParams.get("sport_category_id");
    if (sportCategoryId) {
      const id = Number(sportCategoryId);
      setSelectedSportType(id);
      fetchVenues(id, selectedLocation); // Automatically fetch venues with the sport category ID
    }
  }, []);

  useEffect(() => {
    if (selectedSportType && selectedLocation) {
      fetchVenues(selectedSportType, selectedLocation); // Fetch venues when both values are set
    }
  }, [selectedSportType, selectedLocation]);

  const fetchVenues = async (sportCategoryId: number | undefined, cityId: number | undefined) => {
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

      setVenues(response.data.result); // Ensure this matches the Venue type
    } catch (err) {
      setError("Failed to fetch venues. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (locationsError || sportsBranchesError) {
    return <div>Error loading data</div>;
  }

  if (!locationsData || !sportsBranchesData) {
    return <div>Loading...</div>;
  }
  
  const locations = locationsData?.result?.data.map((location: any) => ({
    city_id: location.city_id,
    city_name: location.city_name,
  }));

  const sportsBranches = sportsBranchesData.result.data.map((branch: any) => ({
    id: branch.id,
    name: branch.name,
  }));

  return (  
    <main>
      <Navbar />
      <div className="mx-auto p-4">
        <header className="bg-red-500 text-white py-12 px-6 mb-8 rounded-lg">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">BOOKING LAPANGAN ONLINE TERBAIK</h1>
            <button className="bg-white text-red-500 px-6 py-3 rounded-lg font-bold hover:bg-red-100 transition duration-300">
              Daftarkan Venue
            </button>
          </div>
        </header> 
      </div>
      <div className="p-6 max-w-7xl mx-auto">          
        <div className="flex justify-between items-center mb-8"> 
          <div className="flex-grow mr-2"> {/* Added margin for spacing */}
            <LocationSearch  
              locations={locations}  
              onLocationChange={(location) => {
                setSelectedLocation(location.city_id);
                fetchVenues(selectedSportType, location.city_id); // Fetch venues when location changes
              }} 
            /> 
          </div>
          
          <div className="flex-grow mx-2"> {/* Added margin for spacing */}
            <SportsBranchSelect  
              sportsBranches={sportsBranches}  
              onBranchChange={(id) => setSelectedSportType(id)} 
              selectedBranchId={selectedSportType} // Pass the selected sport type ID
            /> 
          </div>

          <button 
            className="bg-ayo text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => fetchVenues(selectedSportType, selectedLocation)} // Optional: Keep this for manual fetch
            disabled={loading}
          >  
            {loading ? "Loading..." : "Cari venue"}  
          </button>  
        </div>  
        {error && <p className="text-red-500 text-center mb-8">{error}</p>}
        <p className="text-center mb-8">Menampilkan {venues.length} venue tersedia</p>  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">  
          {venues.map((venue) => (  
            <VenueCard
              id={venue.id}
              name={venue.title}
              location={venue.address}
              sportType={venue.sport_category.name}
              onTransactionCreated={() => console.log('Transaction created')} // Replace with your own implementation
            /> 
          ))}  
        </div>  
      </div>  
    </main>
  );  
};  
  
export default Home;
