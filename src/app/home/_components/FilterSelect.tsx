import React from "react";  
import useSWR from "swr";  
import axios from "axios";  
import ActivitySelect from "./ActivitySelect";  
import LocationSearch from "./LocationSearch";  
import SportsBranchSelect from "./SportsBranchSelect";  
  
const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";  
  
// Create an Axios instance with default headers  
const axiosInstance = axios.create({  
  baseURL: BASE_URL,  
  headers: {  
    Authorization: `Bearer YOUR_TOKEN_HERE`, // Replace with your actual token  
  },  
});  
  
// Fetcher function for SWR  
const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data);  
  
export default function FilterSelect() {  
  // Use SWR to fetch activities  
  const { data: activitiesData, error: activitiesError } = useSWR("/api/v1/sport-activities", fetcher);  
  const { data: locationsData, error: locationsError } = useSWR("/api/v1/location/cities", fetcher);  
  const { data: sportsBranchesData, error: sportsBranchesError } = useSWR("/api/v1/sport-categories", fetcher);  
  
  // Handle loading and error states  
  if (activitiesError || locationsError || sportsBranchesError) {  
    return <div>Error loading data</div>;  
  }  
  
  if (!activitiesData || !locationsData || !sportsBranchesData) {  
    return <div>Loading...</div>;  
  }  
  
  // Map the data to the required format  
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
    <div className="card bg-base-100 shadow-md p-2">  
      <div className="flex justify-between items-center">  
        <div className="flex-1 mr-4">  
          <h3 className="text-xs font-semibold mb-2">Pilih Aktivitas</h3>  
          <ActivitySelect  
            activities={activities}  
            onActivityChange={(id) => console.log("Selected Activity ID:", id)}  
          />  
        </div>  
  
        <div className="flex-1 mr-4">  
          <h3 className="text-xs font-semibold mb-2">Lokasi</h3>  
          <LocationSearch locations={locations} onLocationChange={(location) => console.log("Selected Location:", location)} />  
        </div>  
  
        <div className="flex-1">  
          <h3 className="text-xs font-semibold mb-2">Pilih Cabang Olahraga</h3>  
          <SportsBranchSelect  
            sportsBranches={sportsBranches}  
            onBranchChange={(id) => console.log("Selected Branch ID:", id)}  
          />  
        </div>  
      </div>  
    </div>  
  );  
}  
