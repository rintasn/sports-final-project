import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";      
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";      
import { Badge } from "@/components/ui/badge";      
import { useState, useEffect } from 'react';      
import EditActivityDialog from "./EditActivityDialog";      
import AddActivityDialog from "./AddActivityDialog"; // Import the new dialog component    
import { SportActivity } from "./_schema/activity";      
import { Button } from "@/components/ui/button";      
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";      
import { useToast } from "@/hooks/use-toast";      
  
interface SportActivityDrawerProps {      
  isOpen: boolean;      
  onOpenChange: (open: boolean) => void;      
}      
  
export default function SportActivityDrawer({ isOpen, onOpenChange }: SportActivityDrawerProps) {      
  const { toast } = useToast();      
  const [sportActivities, setSportActivities] = useState<SportActivity[]>([]);      
  const [searchTerm, setSearchTerm] = useState('');      
  const [error, setError] = useState<string | null>(null);      
  const [selectedActivity, setSelectedActivity] = useState<SportActivity | null>(null);      
  const [isActivityDetailDrawerOpen, setIsActivityDetailDrawerOpen] = useState(false);      
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);      
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);      
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false); // State for the add dialog    
  const [currentPage, setCurrentPage] = useState(1);      
  const [totalPages, setTotalPages] = useState(1);      
  
  const fetchSportActivities = async (page: number = 1) => {      
    const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";      
    const API_ENDPOINT = `/api/v1/sport-activities?is_paginate=true&per_page=10&page=${page}&search=${searchTerm}`;      
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
  
      setSportActivities(data.result.data);      
      setCurrentPage(data.result.current_page);      
      setTotalPages(data.result.last_page);      
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
  
  const handleDeleteActivity = async () => {      
    if (!selectedActivity) return;      
  
    const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";      
    const API_ENDPOINT = `/api/v1/sport-activities/delete/${selectedActivity.id}`;      
    const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN');      
  
    if (!BEARER_TOKEN) {      
      setError("Bearer token not found in localStorage.");      
      return;      
    }      
  
    try {      
      const response = await fetch(`${BASE_URL}${API_ENDPOINT}`, {      
        method: 'DELETE',      
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
        throw new Error(data.message || "An error occurred while deleting data.");      
      }      
  
      // Refresh daftar aktivitas setelah menghapus      
      fetchSportActivities();      
      setIsActivityDetailDrawerOpen(false); // Tutup drawer detail      
      setIsDeleteDialogOpen(false); // Tutup dialog konfirmasi      
  
      // Tampilkan pesan sukses      
      toast({      
        title: "Success",      
        description: "Activity deleted successfully.",      
      });      
    } catch (err) {      
      setError(err instanceof Error ? err.message : "An unknown error occurred.");      
    }      
  };      
  
  useEffect(() => {      
    fetchSportActivities(currentPage);      
  }, [currentPage, searchTerm]);      
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {      
    setSearchTerm(e.target.value);      
    setCurrentPage(1); // Reset to first page when search term changes      
  };      
  
  const filteredActivities = sportActivities.filter(activity =>      
    activity.title.toLowerCase().includes(searchTerm.toLowerCase())      
  );      
  
  return (      
    <div>      
      {/* Drawer untuk Daftar Aktivitas */}      
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
              onChange={handleSearch}      
              className="mb-4 p-2 border rounded w-full"      
            />      
            <Button onClick={() => setIsAddDialogOpen(true)} className="mb-4">Add Sport Activity</Button> {/* Button to open add dialog */}    
            <div className="overflow-y-auto max-h-[60vh]"> {/* Scrollable content */}      
              {filteredActivities.map(activity => (      
                <Card      
                  key={activity.id}      
                  className="mb-4 cursor-pointer hover:bg-gray-50 transition-colors"      
                  onClick={() => fetchActivityDetail(activity.id)}      
                >      
                  <CardHeader>      
                    <CardTitle>{activity.title}</CardTitle>      
                    <CardDescription>{activity.address}</CardDescription>      
                  </CardHeader>      
                  <CardContent>      
                    <p className="text-sm text-gray-600">{activity.activity_date}</p>      
                  </CardContent>      
                </Card>      
              ))}      
              {filteredActivities.length === 0 && <p>No activities found.</p>}      
            </div>      
            <div className="flex justify-center mt-4">      
              <Button      
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}      
                disabled={currentPage === 1}      
                className="mr-2"      
              >      
                Previous      
              </Button>      
              <Button      
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}      
                disabled={currentPage === totalPages}      
              >      
                Next      
              </Button>      
            </div>      
          </div>      
        </DrawerContent>      
      </Drawer>      
  
      {/* Drawer untuk Detail Aktivitas */}      
      <Drawer open={isActivityDetailDrawerOpen} onOpenChange={setIsActivityDetailDrawerOpen}>      
        <DrawerContent>      
          <DrawerHeader>      
            <DrawerTitle>Activity Detail</DrawerTitle>      
          </DrawerHeader>      
          <div className="p-4 overflow-y-auto max-h-[70vh]"> {/* Scrollable content */}      
            {selectedActivity && (      
              <Card>      
                <CardHeader>      
                  <CardTitle>{selectedActivity.title}</CardTitle>      
                  <CardDescription>{selectedActivity.description}</CardDescription>      
                </CardHeader>      
                <CardContent className="space-y-4">      
                  <div className="flex items-center space-x-2">      
                    <Badge variant="outline">Price</Badge>      
                    <p>${selectedActivity.price}</p>      
                  </div>      
                  <div className="flex items-center space-x-2">      
                    <Badge variant="outline">Discounted Price</Badge>      
                    <p>${selectedActivity.price_discount}</p>      
                  </div>      
                  <div className="flex items-center space-x-2">      
                    <Badge variant="outline">Slots</Badge>      
                    <p>{selectedActivity.slot}</p>      
                  </div>      
                  <div className="flex items-center space-x-2">      
                    <Badge variant="outline">Address</Badge>      
                    <p>{selectedActivity.address}</p>      
                  </div>      
                  <div className="flex items-center space-x-2">      
                    <Badge variant="outline">Date</Badge>      
                    <p>{selectedActivity.activity_date}</p>      
                  </div>      
                  <div className="flex items-center space-x-2">      
                    <Badge variant="outline">Time</Badge>      
                    <p>      
                      {selectedActivity.start_time} - {selectedActivity.end_time}      
                    </p>      
                  </div>      
                </CardContent>      
                <CardFooter className="flex justify-end space-x-2">      
                  <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>      
                    Delete      
                  </Button>      
                  <Button onClick={() => setIsEditDialogOpen(true)}>Edit</Button>      
                </CardFooter>      
              </Card>      
            )}      
          </div>      
        </DrawerContent>      
      </Drawer>      
  
      {/* Dialog Konfirmasi Delete */}      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>      
        <AlertDialogContent>      
          <AlertDialogHeader>      
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>      
            <AlertDialogDescription>      
              This action cannot be undone. This will permanently delete the activity.      
            </AlertDialogDescription>      
          </AlertDialogHeader>      
          <AlertDialogFooter>      
            <AlertDialogCancel>Cancel</AlertDialogCancel>      
            <AlertDialogAction onClick={handleDeleteActivity}>Delete</AlertDialogAction>      
          </AlertDialogFooter>      
        </AlertDialogContent>      
      </AlertDialog>      
  
      {/* Dialog Edit */}      
      <EditActivityDialog      
        isOpen={isEditDialogOpen}      
        onOpenChange={setIsEditDialogOpen}      
        activity={selectedActivity}      
        onSave={(updatedActivity) => {      
          setSelectedActivity(updatedActivity); // Perbarui state dengan data yang diubah      
          setIsEditDialogOpen(false); // Tutup dialog      
        }}      
      />      
  
      {/* Dialog Add Activity */}      
      <AddActivityDialog      
        isOpen={isAddDialogOpen}      
        onOpenChange={setIsAddDialogOpen}      
        onAdd={fetchSportActivities} // Refresh the activity list after adding    
      />      
  
      {error && <p className="text-red-500 mt-4">{error}</p>}      
    </div>      
  );      
}  
