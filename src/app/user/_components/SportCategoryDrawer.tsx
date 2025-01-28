import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useState, useEffect } from 'react';
import { SportCategory } from "./_schema/category";

interface SportCategoryDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SportCategoryDrawer({ isOpen, onOpenChange }: SportCategoryDrawerProps) {
  const [sportCategories, setSportCategories] = useState<SportCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null); 
  const [sportCategorySearchTerm, setSportCategorySearchTerm] = useState(''); 

  const fetchSportCategories = async () => {
    const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
    const API_ENDPOINT = `/api/v1/sport-categories?is_paginate=true&per_page=10&page=1&search=${sportCategorySearchTerm}`;
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

      setSportCategories(data.result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSportCategories();
    }
  }, [isOpen, searchTerm]);

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Sport Categories</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 p-2 border rounded"
          />
          {sportCategories.map(category => (
            <div
              key={category.id}
              className="p-2 border rounded mb-2"
            >
              <h3>{category.name}</h3>
              <p>Created At: {category.created_at}</p>
              <p>Updated At: {category.updated_at}</p>
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}