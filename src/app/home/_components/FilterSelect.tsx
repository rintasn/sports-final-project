import React from "react";
import useSWR from "swr";
import axios from "axios";
import ActivitySelect from "./ActivitySelect";
import LocationSearch from "./LocationSearch";
import SportsBranchSelect from "./SportsBranchSelect";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer YOUR_TOKEN_HERE`,
  },
});

const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data);

export default function FilterSelect() {
  const { data: activitiesData, error: activitiesError } = useSWR("/api/v1/sport-activities", fetcher);
  const { data: locationsData, error: locationsError } = useSWR("/api/v1/location/cities?is_paginate=true&per_page=5000&page=1", fetcher);
  const { data: sportsBranchesData, error: sportsBranchesError } = useSWR("/api/v1/sport-categories?is_paginate=true&per_page=5000&page=1", fetcher);

  if (activitiesError || locationsError || sportsBranchesError) {
    return <div>Error loading data</div>;
  }

  if (!activitiesData || !locationsData || !sportsBranchesData) {
    return <div>Loading...</div>;
  }

  const activities = activitiesData.result.data.map((activity: any) => ({
    id: activity.sport_category_id,
    name: activity.title,
  }));

  const locations = locationsData.result.data.map((location: any) => ({
    city_id: location.city_id,
    city_name: location.city_name,
  }));

  const sportsBranches = sportsBranchesData.result.data.map((branch: any) => ({
    id: branch.id,
    name: branch.name,
  }));

  return (  
    <div className="relative -mt-8 z-30 px-4 max-w-7xl mx-auto">  
      <div className="bg-ayo rounded-lg shadow-xl p-4">  
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">  
          {/* Aktivitas */}  
          <div className="relative">  
            <div className="flex items-center gap-2 mb-2">  
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">  
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">  
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />  
                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />  
                  <path fillRule="evenodd" d="M3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />  
                </svg>  
              </div>  
              <span className="text-white font-medium">Aktivitas</span>  
            </div>  
            <div className="relative">  
              <ActivitySelect  
                activities={activities}  
                onActivityChange={(id) => console.log("Selected Activity ID:", id)}  
              />  
              <div className="absolute inset-x-0 top-full bg-white rounded-b-lg shadow-lg max-h-60 overflow-y-auto z-50" /> {/* Container untuk dropdown */}  
            </div>  
          </div>  
    
          {/* Lokasi */}  
          <div className="relative">  
            <div className="flex items-center gap-2 mb-2">  
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">  
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">  
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />  
                </svg>  
              </div>  
              <span className="text-white font-medium">Lokasi</span>  
            </div>  
            <div className="relative">  
              <LocationSearch  
                locations={locations}  
                onLocationChange={(location) => console.log("Selected Location:", location)}  
              />  
              <div className="absolute inset-x-0 top-full bg-white rounded-b-lg shadow-lg max-h-60 overflow-y-auto z-50" />  
            </div>  
          </div>  
    
          {/* Cabang Olahraga */}  
          <div className="relative">  
            <div className="flex items-center gap-2 mb-2">  
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">  
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">  
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />  
                </svg>  
              </div>  
              <span className="text-white font-medium">Cabang Olahraga</span>  
            </div>  
            <div className="relative">  
              <SportsBranchSelect  
                sportsBranches={sportsBranches}  
                onBranchChange={(id) => console.log("Selected Branch ID:", id)}  
              />  
              <div className="absolute inset-x-0 top-full bg-white rounded-b-lg shadow-lg max-h-60 overflow-y-auto z-50" />  
            </div>  
          </div>  
    
          {/* Temukan */}  
          <div className="relative flex justify-end items-center">  
            <div className="flex items-center gap-2 mb-2">  
              <div className="w-8 h-8 bg-ayo rounded-lg flex items-center justify-center">  
              </div>  
              <span className="text-white font-medium"></span>  
            </div>  
            <div className="relative">  
              <button className="bg-white text-primary font-medium px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors h-full w-full">  
                Temukan  
              </button>  
              <div className="absolute inset-x-0 top-full bg-white rounded-b-lg shadow-lg max-h-60 overflow-y-auto z-50" />  
            </div>  
          </div>  
        </div>  
      </div>  
    </div>  
  );    
}