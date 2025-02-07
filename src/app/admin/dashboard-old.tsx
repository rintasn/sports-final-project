import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useEffect, useState } from 'react'
import TransactionTable from "./_components/TransactionTable";
import TransactionDrawer from "./_components/TransactionDrawer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Import Dialog components  
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"; // Import Drawer components  

const menuItems = [
  { name: 'My Transaction', href: '/user', icon: '💰' },
  { name: 'Sport Activity', href: '/sport-activity', icon: '🏃‍♂️' },
  { name: 'Sport Category', href: '/sport-category', icon: '🏅' },
  { name: 'File Upload', href: '/file-upload', icon: '📁' },
]

interface SportActivity {
  id: number;
  title: string;
  address: string;
  activity_date: string;
  description: string;
  price: number;
  price_discount: number;
  slot: number;
  start_time: string;
  end_time: string;
  organizer: {
    name: string;
  };
}

interface SportCategory {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export default function Page() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State untuk Dialog  
  const [uploadType, setUploadType] = useState('image');
  const [file, setFile] = useState<File | null>(null); // Specify the type for file  
  const [uploadResponse, setUploadResponse] = useState<string | null>(null);
  const [sportActivities, setSportActivities] = useState<SportActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<SportActivity | null>(null);
  const [isActivityDetailDrawerOpen, setIsActivityDetailDrawerOpen] = useState(false);
  const [sportCategories, setSportCategories] = useState<SportCategory[]>([]);
  const [isSportCategoryDrawerOpen, setIsSportCategoryDrawerOpen] = useState(false);
  const [sportCategorySearchTerm, setSportCategorySearchTerm] = useState('');
  const [isSportActivityDrawerOpen, setIsSportActivityDrawerOpen] = useState(false); // Added state for Sport Activity Drawer  
  const { toast } = useToast();

  const fetchTransactions = async () => {
    const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
    const API_ENDPOINT = `/api/v1/my-transaction?is_paginate=true&per_page=10&page=${currentPage}&search=${searchTerm}`;
    const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN');

    if (!BEARER_TOKEN) {
      setError("Bearer token not found in localStorage.");
      setLoading(false);
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

      const transactions = data.result.data || data.result || [];

      setTransactions(transactions);
      setTotalPages(data.result.last_page || data.total_pages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

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
    fetchTransactions();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchSportActivities();
  }, [searchTerm]);

  useEffect(() => {
    if (isSportCategoryDrawerOpen) {
      fetchSportCategories();
    }
  }, [isSportCategoryDrawerOpen, sportCategorySearchTerm]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null); // Use optional chaining to safely access files  
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
    const API_ENDPOINT = uploadType === 'image' ? '/api/v1/upload-image' : '/api/v1/upload-file';
    const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN');

    if (!BEARER_TOKEN) {
      toast({
        title: "Error",
        description: "Bearer token not found in localStorage.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.message || "An unknown error occurred while uploading file.");
      }

      setUploadResponse(data.result);
      toast({
        title: "Success",
        description: "File uploaded successfully.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  if (item.name === 'File Upload') {
                    setIsDialogOpen(true); // Open the dialog  
                  } else if (item.name === 'Sport Activity') {
                    setIsSportActivityDrawerOpen(true); // Open the sport activity drawer  
                  } else if (item.name === 'Sport Category') {
                    setIsSportCategoryDrawerOpen(true); // Open the sport category drawer  
                  } else {
                    window.location.href = item.href;
                  }
                }}
                className="group relative block rounded-lg bg-white p-6 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl text-blue-500">{item.icon}</span>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                        {item.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
              <>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-4 p-2 border rounded"
                />
                <TransactionDrawer onTransactionCreated={fetchTransactions} />
                <TransactionTable
                  transactions={transactions}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                />
              </>
            )}
          </div>
        </div>
      </SidebarInset>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>
              Upload an image or file to the server.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="upload-type">Upload Type:</Label>
              <select
                id="upload-type"
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="image">Image</option>
                <option value="file">File</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="file">Select File:</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="border p-2 rounded"
              />
            </div>
            <Button onClick={handleUpload}>Upload</Button>
            {uploadResponse && (
              <div className="mt-4">
                <Label>Upload Result:</Label>
                <Textarea
                  value={uploadResponse}
                  readOnly
                  className="border p-2 rounded mt-2"
                />
                <Button
                  onClick={() => navigator.clipboard.writeText(uploadResponse)}
                  className="mt-2"
                >
                  Copy Link
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Drawer open={isSportActivityDrawerOpen} onOpenChange={setIsSportActivityDrawerOpen}>
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
      <Drawer open={isSportCategoryDrawerOpen} onOpenChange={setIsSportCategoryDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Sport Categories</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <input
              type="text"
              placeholder="Search..."
              value={sportCategorySearchTerm}
              onChange={(e) => setSportCategorySearchTerm(e.target.value)}
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
    </SidebarProvider>
  )
}  
