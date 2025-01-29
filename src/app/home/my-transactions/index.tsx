import { useEffect, useState } from "react";
import Navbar from "../_components/NavbarComponent";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import UploadDialog from "../../user/_components/UploadDialog";
import { Input } from "@/components/ui/input"; // Ensure you have an Input component
import { toast } from "react-toastify";
import DOMPurify from "dompurify";

// Define types for the transaction data
interface TransactionItem {
  id: number;
  transaction_id: number;
  sport_activity_id: number;
  title: string;
  price: number;
  price_discount: number | null;
  created_at: string;
  updated_at: string;
  sport_activities: {
    id: number;
    sport_category_id: number;
    city_id: number;
    user_id: number;
    title: string;
    description: string;
    image_url: string | null;
    price: number;
    price_discount: number | null;
    slot: number;
    address: string;
    map_url: string;
    activity_date: string;
    start_time: string;
    end_time: string;
    created_at: string;
    updated_at: string;
  };
}

interface Transaction {
  id: number;
  user_id: number;
  payment_method_id: number;
  invoice_id: string;
  status: string;
  total_amount: number;
  proof_payment_url: string | null;
  order_date: string;
  expired_date: string;
  created_at: string;
  updated_at: string;
  transaction_items: TransactionItem;
}

interface ApiResponse {
  error: boolean;
  result: {
    current_page: number;
    data: Transaction[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

interface DetailedTransaction {
  id: number;
  user_id: number;
  payment_method_id: number;
  invoice_id: string;
  status: string;
  total_amount: number;
  proof_payment_url: string | null;
  order_date: string;
  expired_date: string;
  created_at: string;
  updated_at: string;
  transaction_items: {
    id: number;
    transaction_id: number;
    sport_activity_id: number;
    title: string;
    price: number;
    price_discount: number | null;
    created_at: string;
    updated_at: string;
    sport_activities: {
      id: number;
      sport_category_id: number;
      city_id: number;
      user_id: number;
      title: string;
      description: string;
      image_url: string | null;
      price: number;
      price_discount: number | null;
      slot: number;
      address: string;
      map_url: string;
      activity_date: string;
      start_time: string;
      end_time: string;
      created_at: string;
      updated_at: string;
    };
  };
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<DetailedTransaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [proofPaymentUrl, setProofPaymentUrl] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
  >(null);

  const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token not found in localStorage");
      setLoading(false);
      return;
    }

    const url = new URL(`${BASE_URL}/api/v1/my-transaction`);
    url.searchParams.append("is_paginate", "true");
    url.searchParams.append("per_page", "6");
    url.searchParams.append("page", currentPage.toString());
    url.searchParams.append("search", searchTerm);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: ApiResponse = await response.json();
      if (data.error) {
        // Handle the error based on the API response structure
        setError("An error occurred while fetching data.");
        return;
      }

      // Sort transactions by order_date in descending order
      const sortedTransactions = data.result.data.sort((a, b) => {
        return new Date(b.order_date).getTime() - new Date(a.order_date).getTime();
      });

      setTransactions(sortedTransactions);
      setCurrentPage(data.result.current_page);
      setLastPage(data.result.last_page);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionDetails = async (transactionId: number) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token not found in localStorage");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/transaction/${transactionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: { error: boolean; result: DetailedTransaction } =
        await response.json();
      if (data.error) {
        // Handle the error based on the API response structure
        setError("An error occurred while fetching data.");
        return;
      }

      setSelectedTransaction(data.result);
      setSelectedTransactionId(transactionId);
      setProofPaymentUrl(data.result.proof_payment_url || "");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmProofPayment = async () => {
    if (selectedTransactionId === null) return;
    setActionLoading(true);
    setActionError(null);

    const BEARER_TOKEN = localStorage.getItem("token");
    if (!BEARER_TOKEN) {
      setActionError("Bearer token not found in localStorage.");
      setActionLoading(false);
      return;
    }

    const url = `${BASE_URL}/api/v1/transaction/update-proof-payment/${selectedTransactionId}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ proof_payment_url: proofPaymentUrl }), // Send proof payment URL in the request body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(
          data.message ||
            "An error occurred while processing the proof payment."
        );
      }

      // Show toast notification for successful proof payment update
      toast.success("Proof Payment Updated");
      setSelectedTransaction((prev) =>
        prev ? { ...prev, proof_payment_url: proofPaymentUrl } : null
      );
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setActionLoading(false);
      setIsDialogOpen(false);
    }
  };

  const openUploadDialogHandler = () => {
    setIsDialogOpen(true);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
    setSelectedTransactionId(null);
    setProofPaymentUrl("");
    setActionError(null);
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <header className="bg-red-500 text-white py-12 px-6 mb-8 rounded-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">MY TRANSACTION</h1>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-white p-4 rounded-lg shadow-md flex flex-col"
                >
                  <h2 className="text-xl font-semibold mb-2">
                    {transaction.invoice_id}
                  </h2>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <span className="text-gray-600 font-medium">Status:</span>
                    <span className="text-gray-600">{transaction.status}</span>

                    <span className="text-gray-600 font-medium">
                      Total Amount:
                    </span>
                    <span className="text-gray-600">
                      {transaction.total_amount}
                    </span>

                    <span className="text-gray-600 font-medium">
                      Order Date:
                    </span>
                    <span className="text-gray-600">
                      {transaction.order_date}
                    </span>

                    <span className="text-gray-600 font-medium">
                      Expired Date:
                    </span>
                    <span className="text-gray-600">
                      {transaction.expired_date}
                    </span>

                    <span className="text-gray-600 font-medium">Title:</span>
                    <span className="text-gray-600">
                      {transaction.transaction_items.title}
                    </span>
                  </div>

                  <button
                    className="mt-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => fetchTransactionDetails(transaction.id)}
                  >
                    Detail
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {lastPage}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600 font-medium">Invoice ID:</div>
              <div className="text-gray-600">
                {selectedTransaction.invoice_id}
              </div>

              <div className="text-gray-600 font-medium">Status:</div>
              <div className="text-gray-600">
                {selectedTransaction.status}
              </div>

              <div className="text-gray-600 font-medium">Total Amount:</div>
              <div className="text-gray-600">
                {selectedTransaction.total_amount}
              </div>

              <div className="text-gray-600 font-medium">Order Date:</div>
              <div className="text-gray-600">
                {selectedTransaction.order_date}
              </div>

              <div className="text-gray-600 font-medium">Expired Date:</div>
              <div className="text-gray-600">
                {selectedTransaction.expired_date}
              </div>

              <div className="text-gray-600 font-medium">Title:</div>
              <div className="text-gray-600">
                {selectedTransaction.transaction_items.title}
              </div>

              <div className="text-gray-600 font-medium">Description:</div>
              <div
                className="text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    selectedTransaction.transaction_items.sport_activities
                      .description
                  ),
                }}
              />
            </div>

            {/* Open Upload Dialog */}
            <Button onClick={openUploadDialogHandler} className="mt-4">
              Upload Image
            </Button>

            {/* Input path image */}
            <div className="space-y-2 mt-4">
              <Input
                type="text"
                value={proofPaymentUrl}
                onChange={(e) => setProofPaymentUrl(e.target.value)}
                placeholder="Enter proof payment URL"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              {actionError && (
                <p className="text-red-500 mt-2">{actionError}</p>
              )}
            </div>

            <div className="mt-4 flex justify-between">
              <Button
                onClick={confirmProofPayment}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={actionLoading}
              >
                {actionLoading ? "Updating..." : "Update"}
              </Button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <UploadDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </main>
  );
}
