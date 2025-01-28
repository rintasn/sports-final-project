import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useState, useEffect } from 'react';

import { SportActivity } from "./_schema/activity";


interface SportActivityDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SportActivityDrawer({ isOpen, onOpenChange }: SportActivityDrawerProps) {
  const [sportActivities, setSportActivities] = useState<SportActivity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<SportActivity | null>(null);
  const [isActivityDetailDrawerOpen, setIsActivityDetailDrawerOpen] = useState(false);

  const fetchSportActivities = async () => {
    const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
    const API_ENDPOINT = `/api/v1/sport-activities?is_paginate=false&per_page=10&page=1&search=${searchTerm}`;
    const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN');

    if (!BEARER_TOKEN) {
      setError("Bearer token not found in localStorage.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINT}`, {
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.message || "An error occurred while fetching data.");
      }

      setSportActivities(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    }
  };

  const fetchActivityDetail = async (id: number) => {
    const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
    const API_ENDPOINT = `/api/v1/sport-activities/${id}`;
    const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN');

    if (!BEARER_TOKEN) {
      setError("Bearer token not found in localStorage.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINT}`, {
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.message || "An error occurred while fetching data.");
      }

      setSelectedActivity(data.result);
      setIsActivityDetailDrawerOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    }
  };

  useEffect(() => {
    fetchSportActivities();
  }, [searchTerm]);

  return (
    <div>
        <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Sport Activities</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 p-2 border rounded"
          />
          {sportActivities.map(activity => (
            <div
              key={activity.id}
              className="p-2 border rounded mb-2 cursor-pointer"
              onClick={() => fetchActivityDetail(activity.id)}
            >
              <h3>{activity.title}</h3>
              <p>{activity.address}</p>
              <p>{activity.activity_date}</p>
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
        <Drawer open={isActivityDetailDrawerOpen} onOpenChange={setIsActivityDetailDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Activity Detail</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            {selectedActivity && (
              <>
                <h3>{selectedActivity.title}</h3>
                <p>{selectedActivity.description}</p>
                <p>Price: {selectedActivity.price}</p>
                <p>Discounted Price: {selectedActivity.price_discount}</p>
                <p>Slots: {selectedActivity.slot}</p>
                <p>Address: {selectedActivity.address}</p>
                <p>Activity Date: {selectedActivity.activity_date}</p>
                <p>Start Time: {selectedActivity.start_time}</p>
                <p>End Time: {selectedActivity.end_time}</p>
                <p>Organizer: {selectedActivity.organizer.name}</p>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
    
  );
}