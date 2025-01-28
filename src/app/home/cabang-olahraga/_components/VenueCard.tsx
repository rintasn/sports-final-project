// VenueCard.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface TransactionFormData {
    sport_activity_id: number;
    payment_method_id: number;
}

const formSchema = z.object({
    sport_activity_id: z.number().min(1, "Sport activity is required"),
    payment_method_id: z.number().min(1, "Payment method is required"),
});

interface VenueCardProps {
    id: number;
    name: string;
    location: string;
    sportType: string;
    onTransactionCreated: () => void;
}

const VenueCard: React.FC<VenueCardProps> = ({ id, name, location, sportType, onTransactionCreated }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [sportActivities, setSportActivities] = useState<{ id: number; title: string }[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<{ id: number; name: string; virtual_account_number: string; virtual_account_name: string; image_url: string }[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<{ virtual_account_number: string; virtual_account_name: string; image_url: string } | null>(null);

    const form = useForm<TransactionFormData>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        const fetchSportActivities = async () => {
            const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
            try {
                const response = await fetch(`${BASE_URL}/api/v1/sport-activities/${id}`);
                const result = await response.json();
                if (!result.error) {
                    setSportActivities([{ id: result.result.id, title: result.result.title }]);
                } else {
                    toast.error("Failed to fetch sport activities");
                }
            } catch (error) {
                console.error("Error fetching sport activities:", error);
                toast.error("Error fetching sport activities");
            }
        };

        const fetchPaymentMethods = async () => {
            const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
            try {
                const response = await fetch(`${BASE_URL}/api/v1/payment-methods`);
                const result = await response.json();
                if (!result.error) {
                    setPaymentMethods(result.result);
                } else {
                    toast.error("Failed to fetch payment methods");
                }
            } catch (error) {
                console.error("Error fetching payment methods:", error);
                toast.error("Error fetching payment methods");
            }
        };

        fetchSportActivities();
        fetchPaymentMethods();
    }, [id]);

    const onSubmit = async (data: TransactionFormData) => {
        const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
        const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN');

        try {
            const response = await fetch(`${BASE_URL}/api/v1/transaction/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${BEARER_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!result.error) {
                toast.success(result.message, { // Display success toast  
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                onTransactionCreated();
                setIsDialogOpen(false);
            } else {
                toast.error(result.message, { // Display error toast  
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                console.error("Transaction creation failed", result.message);
            }
        } catch (error) {
            toast.error("Transaction creation error", { // Display error toast  
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            console.error("Transaction creation error", error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-sm mb-6 cursor-pointer" onClick={() => setIsDialogOpen(true)}>
            <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{name}</h3>
                <p className="text-gray-600 mb-2">{location}</p>
                <p className="text-gray-600">{sportType}</p>
                <p className="text-gray-600">{id}</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Transaction</DialogTitle>
                        <DialogDescription>
                            Fill in the form below to create a transaction.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4">
                            <FormField
                                control={form.control}
                                name="sport_activity_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sport Activity</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))}
                                            value={field.value?.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a sport activity" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {sportActivities.map((activity) => (
                                                    <SelectItem
                                                        key={activity.id}
                                                        value={activity.id.toString()}
                                                    >
                                                        {activity.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="payment_method_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Method</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(Number(value));
                                                const selectedMethod = paymentMethods.find(method => method.id === Number(value));
                                                setSelectedPaymentMethod(selectedMethod || null);
                                            }}
                                            value={field.value?.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a payment method" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {paymentMethods.map((method) => (
                                                    <SelectItem
                                                        key={method.id}
                                                        value={method.id.toString()}
                                                    >
                                                        {method.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {selectedPaymentMethod && (
                                <div className="mt-4">
                                    <p><strong>Virtual Account Number:</strong> {selectedPaymentMethod.virtual_account_number}</p>
                                    <p><strong>Virtual Account Name:</strong> {selectedPaymentMethod.virtual_account_name}</p>
                                    <img src={selectedPaymentMethod.image_url} alt={selectedPaymentMethod.virtual_account_name} className="mt-2" />
                                </div>
                            )}
                            <DialogFooter>
                                <Button type="submit">Create Transaction</Button>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default VenueCard;
