import { Table as UITable, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";  
import { z } from "zod";  
import { useState, useEffect } from "react";  
import { Button } from "@/components/ui/button";  
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";  
import { Loader2 } from "lucide-react";  
import { Input } from "@/components/ui/input";  
import { useToast } from "@/hooks/use-toast"; // Import the useToast hook  
  
// Define the Zod schema for transaction items  
const TransactionItemSchema = z.object({  
  id: z.number(),  
  invoice_id: z.string(),  
  status: z.string(),  
  total_amount: z.number(),  
  order_date: z.string(),  
  proof_payment_url: z.string().nullable(), // Allow proof_payment_url to be null  
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
  // Initialize the toast hook  
  const { toast } = useToast(); // Destructure the toast function from useToast  
  
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
  const [actionDialogOpen, setActionDialogOpen] = useState(false);  
  const [proofPaymentDialogOpen, setProofPaymentDialogOpen] = useState(false);  
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);  
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);  
  const [transactionDetails, setTransactionDetails] = useState<any | null>(null);  
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState<string | null>(null);  
  const [actionLoading, setActionLoading] = useState(false);  
  const [actionError, setActionError] = useState<string | null>(null);  
  const [proofPaymentUrl, setProofPaymentUrl] = useState<string>(""); // State for proof payment URL  
  
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
          setProofPaymentUrl(data.result.proof_payment_url || ""); // Set proof payment URL from transaction details  
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
  
  // Function to handle proof payment click  
  const handleProofPayment = (id: number) => {  
    setSelectedTransactionId(id);  
    setProofPaymentDialogOpen(true);  
  };  
  
  // Function to handle action button click  
  const handleActionClick = (id: number, hasProof: boolean) => {  
    if (!hasProof) {  
      setAlertDialogOpen(true);  
      return;  
    }  
    setSelectedTransactionId(id);  
    setActionDialogOpen(true);  
  };  
  
  // Function to handle action selection  
  const handleAction = async (action: 'process' | 'cancel') => {  
    if (selectedTransactionId === null) return;  
    setActionLoading(true);  
    setActionError(null);  
  
    const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN');  
    if (!BEARER_TOKEN) {  
      setActionError("Bearer token not found in localStorage.");  
      setActionLoading(false);  
      return;  
    }  
  
    const url = action === 'process' ?  
      `https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/transaction/update-status/${selectedTransactionId}` :  
      `https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/transaction/cancel/${selectedTransactionId}`;  
  
    const requestOptions = {  
      method: 'POST',  
      headers: {  
        'Authorization': `Bearer ${BEARER_TOKEN}`,  
        'Content-Type': 'application/json',  
      },  
      body: action === 'process' ? JSON.stringify({ status: 'success' }) : undefined,  
    };  
  
    try {  
      const response = await fetch(url, requestOptions);  
  
      if (!response.ok) {  
        throw new Error(`HTTP error! Status: ${response.status}`);  
      }  
  
      const data = await response.json();  
      if (data.error) {  
        throw new Error(data.message || "An error occurred while processing the action.");  
      }  
  
      // Show toast notification for successful action  
      toast({ title: "Success", description: "Transaction Updated", variant: "default" });  
    } catch (err) {  
      setActionError(err instanceof Error ? err.message : "An unknown error occurred.");  
    } finally {  
      setActionLoading(false);  
      setActionDialogOpen(false);  
    }  
  };  
  
  // Function to handle proof payment confirmation  
  const confirmProofPayment = async () => {  
    if (selectedTransactionId === null) return;  
    setActionLoading(true);  
    setActionError(null);  
  
    const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN');  
    if (!BEARER_TOKEN) {  
      setActionError("Bearer token not found in localStorage.");  
      setActionLoading(false);  
      return;  
    }  
  
    const url = `https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/transaction/update-proof-payment/${selectedTransactionId}`;  
  
    try {  
      const response = await fetch(url, {  
        method: 'POST',  
        headers: {  
          'Authorization': `Bearer ${BEARER_TOKEN}`,  
          'Content-Type': 'application/json',  
        },  
        body: JSON.stringify({ proof_payment_url: proofPaymentUrl }), // Send proof payment URL in the request body  
      });  
  
      if (!response.ok) {  
        throw new Error(`HTTP error! Status: ${response.status}`);  
      }  
  
      const data = await response.json();  
      if (data.error) {  
        throw new Error(data.message || "An error occurred while processing the proof payment.");  
      }  
  
      // Show toast notification for successful proof payment update  
      toast({ title: "Success", description: "Proof Payment Updated", variant: "default" });  
    } catch (err) {  
      setActionError(err instanceof Error ? err.message : "An unknown error occurred.");  
    } finally {  
      setActionLoading(false);  
      setProofPaymentDialogOpen(false);  
    }  
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
              <TableHead>Proof Payment</TableHead>  
              <TableHead>Action</TableHead>  
            </TableRow>  
          </TableHeader>  
          <TableBody>  
            {validatedTransactions.map((transaction) => (  
              <TableRow key={transaction.id} className="cursor-pointer hover:bg-gray-100">  
                <TableCell className="font-medium">{transaction.invoice_id}</TableCell>  
                <TableCell>{transaction.status}</TableCell>  
                <TableCell>{transaction.total_amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>  
                <TableCell>{new Date(transaction.order_date).toLocaleDateString()}</TableCell>  
                <TableCell>{transaction.transaction_items.title}</TableCell>  
                <TableCell>  
                  {transaction.proof_payment_url ? (  
                    <img  
                      src={transaction.proof_payment_url ?? ''}  
                      alt="Proof of Payment"  
                      className="cursor-pointer w-16 h-16 object-cover"  
                      onClick={() => window.open(transaction.proof_payment_url ?? '', "_blank")}  
                    />  
                  ) : (  
                    <span>No proof available</span>  
                  )}  
                </TableCell>  
                <TableCell>  
                  <Button onClick={() => handleRowClick(transaction.id)}>Details</Button>  
                  <Button variant="secondary" onClick={() => handleProofPayment(transaction.id)}>Upload Payment</Button>  
                  <Button  
                    variant="destructive"  
                    onClick={() => handleActionClick(transaction.id, !!transaction.proof_payment_url)}  
                  >  
                    Action  
                  </Button>  
                </TableCell>  
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
  
      {/* Dialog for proof payment confirmation */}  
      <Dialog open={proofPaymentDialogOpen} onOpenChange={setProofPaymentDialogOpen}>  
        <DialogContent className="sm:max-w-[425px]">  
          <DialogHeader>  
            <DialogTitle>Confirm Proof Payment</DialogTitle>  
            {actionLoading && <DialogDescription><Loader2 className="animate-spin" /> Processing...</DialogDescription>}  
            {actionError && <DialogDescription className="text-red-500">{actionError}</DialogDescription>}  
            {!actionLoading && !actionError && (  
              <DialogDescription>  
                <div className="space-y-2">  
                  <Input  
                    type="text"  
                    value={proofPaymentUrl}  
                    onChange={(e) => setProofPaymentUrl(e.target.value)}  
                    placeholder="Enter proof payment URL"  
                  />  
                </div>  
              </DialogDescription>  
            )}  
          </DialogHeader>  
          <DialogFooter>  
            <Button variant="secondary" onClick={() => setProofPaymentDialogOpen(false)}>Cancel</Button>  
            <Button  
              variant="destructive"  
              onClick={confirmProofPayment}  
              disabled={!proofPaymentUrl} // Disable button if proofPaymentUrl is empty  
            >  
              Confirm  
            </Button>  
          </DialogFooter>  
        </DialogContent>  
      </Dialog>  
  
      {/* Dialog for action confirmation */}  
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>  
        <DialogContent className="sm:max-w-[425px]">  
          <DialogHeader>  
            <DialogTitle>Confirm Action</DialogTitle>  
            {actionLoading && <DialogDescription><Loader2 className="animate-spin" /> Processing...</DialogDescription>}  
            {actionError && <DialogDescription className="text-red-500">{actionError}</DialogDescription>}  
            {!actionLoading && !actionError && (  
              <DialogDescription>  
                Are you sure you want to proceed with this action?  
              </DialogDescription>  
            )}  
          </DialogHeader>  
          <DialogFooter>  
            <Button variant="secondary" onClick={() => handleAction('cancel')}>Cancel</Button>  
            <Button variant="destructive" onClick={() => handleAction('process')}>Process</Button>  
          </DialogFooter>  
        </DialogContent>  
      </Dialog>  
  
      {/* Alert Dialog for missing proof of payment */}  
      <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>  
        <DialogContent className="sm:max-w-[425px]">  
          <DialogHeader>  
            <DialogTitle>Alert</DialogTitle>  
            <DialogDescription>  
              You need to upload proof of payment first before performing this action.  
            </DialogDescription>  
          </DialogHeader>  
          <DialogFooter>  
            <Button variant="secondary" onClick={() => setAlertDialogOpen(false)}>  
              Close  
            </Button>  
          </DialogFooter>  
        </DialogContent>  
      </Dialog>  
    </>  
  );  
};  
  
export default TransactionTable;  
