import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface SportCategory {
  id: number;
  name: string;
}

interface City {
  city_id: number;
  city_name: string;
  city_name_full: string;
}

interface AddActivityDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: () => void;
}

export default function AddActivityDialog({ isOpen, onOpenChange, onAdd }: AddActivityDialogProps) {
  const { toast } = useToast();
  const [sportCategories, setSportCategories] = useState<SportCategory[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [searchCity, setSearchCity] = useState<string>('');
  const [formData, setFormData] = useState({
    sport_category_id: "",
    city_id: "",
    title: "",
    description: "",
    slot: 0,
    price: 0,
    address: "",
    activity_date: "",
    start_time: "",
    end_time: "",
    map_url: "",
  });

  const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
  const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN');

  useEffect(() => {
    const fetchData = async () => {
      if (!BEARER_TOKEN) return;

      try {
        // Fetch sport categories
        const sportCategoriesResponse = await fetch(
          `${BASE_URL}/api/v1/sport-categories?is_paginate=true&per_page=1000&page=1`,
          {
            headers: {
              'Authorization': `Bearer ${BEARER_TOKEN}`,
            },
          }
        );
        const sportCategoriesData = await sportCategoriesResponse.json();
        if (!sportCategoriesData.error) {
          setSportCategories(sportCategoriesData.result.data);
        }

        // Fetch cities
        const citiesResponse = await fetch(
          `${BASE_URL}/api/v1/location/cities?is_paginate=true&per_page=5000&page=1`,
          {
            headers: {
              'Authorization': `Bearer ${BEARER_TOKEN}`,
            },
          }
        );
        const citiesData = await citiesResponse.json();
        if (!citiesData.error) {
          setCities(citiesData.result.data);
          setFilteredCities(citiesData.result.data);
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch categories or cities",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCitySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchCity(value);
    setFilteredCities(
      cities.filter(city =>
        city.city_name_full.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSubmit = async () => {
    if (!BEARER_TOKEN) {
      toast({
        title: "Error",
        description: "Bearer token not found in localStorage.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/v1/sport-activities/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.message || "An error occurred while adding data.");
      }

      toast({
        title: "Success",
        description: "Activity added successfully.",
      });

      onAdd();
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Activity</DialogTitle>
          <DialogDescription>Fill in the details of the new activity.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Sport Category</Label>
            <Select
              onValueChange={(value) => handleSelectChange("sport_category_id", value)}
              value={formData.sport_category_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a sport category" />
              </SelectTrigger>
              <SelectContent>
                {sportCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>City</Label>
            <Select
              onValueChange={(value) => handleSelectChange("city_id", value)}
              value={formData.city_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <Input
                    placeholder="Search city..."
                    value={searchCity}
                    onChange={handleCitySearch}
                  />
                </div>
                {filteredCities.map((city) => (
                  <SelectItem key={city.city_id} value={city.city_id.toString()}>
                    {city.city_name_full}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Title</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Slot</Label>
            <Input
              name="slot"
              type="number"
              value={formData.slot}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Price</Label>
            <Input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Address</Label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Activity Date</Label>
            <Input
              name="activity_date"
              type="date"
              value={formData.activity_date}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Start Time</Label>
            <Input
              name="start_time"
              type="time"
              value={formData.start_time}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>End Time</Label>
            <Input
              name="end_time"
              type="time"
              value={formData.end_time}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Map URL</Label>
            <Input
              name="map_url"
              value={formData.map_url}
              onChange={handleChange}
            />
          </div>
          <Button onClick={handleSubmit}>Add Activity</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
