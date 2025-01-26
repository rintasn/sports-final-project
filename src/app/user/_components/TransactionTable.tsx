import {  
  Table as UITable,  
  TableBody,  
  TableCaption,  
  TableCell,  
  TableHead,  
  TableHeader,  
  TableRow,  
} from "@/components/ui/table"  
import { z } from "zod"  
import { useState, useEffect } from "react"  
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"  
import { Loader2 } from "lucide-react"  
  
// Define the Zod schema for transaction items      
const TransactionItemSchema = z.object({  
  id: z.number(),  
  invoice_id: z.string(),  
  status: z.string(),  
  total_amount: z.number(),  
  order_date: z.string(),  
  transaction_items: z.object({  
    title: z.string(),  
  }),  
});  
  
// Define the type for a transaction item based on the Zod schema      
type TransactionItem = z.infer<typeof TransactionItemSchema>;  
  
// Define the props for the TransactionTable component      
interface TransactionTableProps {  
  transactions: TransactionItem[];  
  currentPage: number;  
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;  
  totalPages: number;  
}  
  
const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, currentPage, setCurrentPage, totalPages }) => {  
  // Validate transactions using Zod      
  const validatedTransactions = transactions.map(transaction => {  
    const result = TransactionItemSchema.safeParse(transaction);  
    if (!result.success) {  
      console.error("Validation error:", result.error);  
      return null; // or handle the error as needed      
    }  
    return result.data; // Return the validated data      
  }).filter((item): item is TransactionItem => item !== null); // Filter out invalid items      
  
  // State for the dialog  
  const [isOpen, setIsOpen] = useState(false);  
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);  
  const [transactionDetails, setTransactionDetails] = useState<any | null>(null);  
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState<string | null>(null);  
  
  // Fetch transaction details when selectedTransactionId changes  
  useEffect(() => {  
    if (selectedTransactionId !== null) {  
      setLoading(true);  
      setError(null);  
      setTransactionDetails(null);  
  
      const fetchTransactionDetails = async () => {  
        const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN');  
        if (!BEARER_TOKEN) {  
          setError("Bearer token not found in localStorage.");  
          setLoading(false);  
          return;  
        }  
  
        try {  
          const response = await fetch(`https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/transaction/${selectedTransactionId}`, {  
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
  
          setTransactionDetails(data.result);  
        } catch (err) {  
          setError(err instanceof Error ? err.message : "An unknown error occurred.");  
        } finally {  
          setLoading(false);  
        }  
      };  
  
      fetchTransactionDetails();  
    }  
  }, [selectedTransactionId]);  
  
  // Function to handle row click  
  const handleRowClick = (id: number) => {  
    setSelectedTransactionId(id);  
    setIsOpen(true);  
  };  
  
  return (  
    <>  
      <div className="bg-white rounded-lg shadow-md p-6">  
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>  
        <UITable>  
          <TableCaption>A list of your recent transactions.</TableCaption>  
          <TableHeader>  
            <TableRow>  
              <TableHead>Invoice ID</TableHead>  
              <TableHead>Status</TableHead>  
              <TableHead>Total Amount</TableHead>  
              <TableHead>Order Date</TableHead>  
              <TableHead>Activity Title</TableHead>  
            </TableRow>  
          </TableHeader>  
          <TableBody>  
            {validatedTransactions.map((transaction) => (  
              <TableRow key={transaction.id} onClick={() => handleRowClick(transaction.id)} className="cursor-pointer hover:bg-gray-100">  
                <TableCell className="font-medium">{transaction.invoice_id}</TableCell>  
                <TableCell>{transaction.status}</TableCell>  
                <TableCell>{transaction.total_amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>  
                <TableCell>{new Date(transaction.order_date).toLocaleDateString()}</TableCell>  
                <TableCell>{transaction.transaction_items.title}</TableCell>  
              </TableRow>  
            ))}  
          </TableBody>  
        </UITable>  
      </div>  
      <div className="flex justify-between mt-4">  
        <button  
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}  
          disabled={currentPage === 1}  
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"  
        >  
          Previous  
        </button>  
        <span>Page {currentPage} of {totalPages}</span>  
        <button  
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}  
          disabled={currentPage === totalPages}  
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"  
        >  
          Next  
        </button>  
      </div>  
  
      {/* Dialog for transaction details */}  
      <Dialog open={isOpen} onOpenChange={setIsOpen}>  
        <DialogContent className="sm:max-w-[425px]">  
          <DialogHeader>  
            <DialogTitle>Transaction Details</DialogTitle>  
            {loading && <DialogDescription><Loader2 className="animate-spin" /> Loading...</DialogDescription>}  
            {error && <DialogDescription className="text-red-500">{error}</DialogDescription>}  
            {!loading && !error && transactionDetails && (  
              <DialogDescription>  
                <div className="space-y-2">  
                  <p><strong>ID:</strong> {transactionDetails.id}</p>  
                  <p><strong>Invoice ID:</strong> {transactionDetails.invoice_id}</p>  
                  <p><strong>Status:</strong> {transactionDetails.status}</p>  
                  <p><strong>Total Amount:</strong> {transactionDetails.total_amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>  
                  <p><strong>Order Date:</strong> {new Date(transactionDetails.order_date).toLocaleDateString()}</p>  
                  <p><strong>Activity Title:</strong> {transactionDetails.transaction_items.title}</p>  
                  {/* Add more fields as needed */}  
                </div>  
              </DialogDescription>  
            )}  
          </DialogHeader>  
        </DialogContent>  
      </Dialog>  
    </>  
  )  
}  
  
export default TransactionTable;  
