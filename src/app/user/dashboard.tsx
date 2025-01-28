import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from 'react';
import TransactionTable from "./_components/TransactionTable";
import TransactionDrawer from "./_components/TransactionDrawer";
import UploadDialog from "./_components/UploadDialog";
import SportActivityDrawer from "./_components/SportActivityDrawer";
import ActivityDetailDrawer from "./_components/ActivityDetailDrawer";
import SportCategoryDrawer from "./_components/SportCategoryDrawer";
import { useToast } from "@/hooks/use-toast";
// src/app/page.tsx

import { SportActivity } from "./_components/_schema/activity";

const menuItems = [
  { name: 'All Transaction', href: '/user', icon: '💰' },
  { name: 'Sport Activity', href: '/sport-activity', icon: '🏃‍♂️' },
  { name: 'Sport Category', href: '/sport-category', icon: '🏅' },
  { name: 'File Upload', href: '/file-upload', icon: '📁' },
];

export default function Page() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSportActivityDrawerOpen, setIsSportActivityDrawerOpen] = useState(false);
  const [isActivityDetailDrawerOpen, setIsActivityDetailDrawerOpen] = useState(false);
  const [isSportCategoryDrawerOpen, setIsSportCategoryDrawerOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<SportActivity | null>(null);
  const { toast } = useToast();

  const fetchTransactions = async () => {
    const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
    const API_ENDPOINT = `/api/v1/all-transaction?is_paginate=true&per_page=10&page=${currentPage}&search=${searchTerm}`;
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

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, searchTerm]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb />
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
                    setIsDialogOpen(true);
                  } else if (item.name === 'Sport Activity') {
                    setIsSportActivityDrawerOpen(true);
                  } else if (item.name === 'Sport Category') {
                    setIsSportCategoryDrawerOpen(true);
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
      <UploadDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <SportActivityDrawer isOpen={isSportActivityDrawerOpen} onOpenChange={setIsSportActivityDrawerOpen} />
      <ActivityDetailDrawer
        isOpen={isActivityDetailDrawerOpen}
        onOpenChange={setIsActivityDetailDrawerOpen}
        selectedActivity={selectedActivity} // Tambahkan prop ini
      />
      <SportCategoryDrawer isOpen={isSportCategoryDrawerOpen} onOpenChange={setIsSportCategoryDrawerOpen} />
    </SidebarProvider>
  );
}